use rollyourown::config::locations::Locations;
use rollyourown::models::game::GameMode;
use rollyourown::packing::game_store::GameStoreImpl;
use rollyourown::systems::helpers::{shopping, trading};

#[derive(Copy, Drop, Serde)]
pub enum Actions {
    Trade: trading::Trade,
    Shop: shopping::Action,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
pub enum EncounterActions {
    Run,
    Pay,
    Fight,
}

#[starknet::interface]
trait IGameActions<T> {
    fn create_game(
        self: @T,
        game_mode: GameMode,
        player_name: felt252,
        multiplier: u8,
        hustler_token_id: u64,
    );
    fn end_game(self: @T, game_id: u32, actions: Span<Actions>);
    fn travel(self: @T, game_id: u32, next_location: Locations, actions: Span<Actions>);
}

#[dojo::contract]
mod game {
    use rollyourown::interfaces::vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use dojo::world::{IWorldDispatcherTrait, WorldStorageTrait};
    use openzeppelin::interfaces::token::erc721::{IERC721Dispatcher, IERC721DispatcherTrait};
    use rollyourown::config::locations::Locations;
    use rollyourown::constants::ns;
    use rollyourown::events::GameCreated;
    use rollyourown::helpers::season_manager::SeasonManagerTrait;
    use rollyourown::models::game::{GameImpl, GameMode};
    use rollyourown::models::hustler_instance::HustlerInstance;
    use rollyourown::packing::game_store::{GameStore, GameStoreImpl};
    use rollyourown::packing::player::PlayerImpl;
    use rollyourown::store::{StoreImpl, StoreTrait};
    use rollyourown::systems::helpers::trading::TradeDirection;
    use rollyourown::systems::helpers::{game_loop, shopping, trading};
    use rollyourown::utils::bytes16::Bytes16Impl;
    use rollyourown::utils::random::RandomImpl;
    use starknet::get_caller_address;


    #[abi(embed_v0)]
    impl GameActionsImpl of super::IGameActions<ContractState> {
        fn create_game(
            self: @ContractState,
            game_mode: GameMode,
            player_name: felt252,
            multiplier: u8,
            hustler_token_id: u64,
        ) {
            self.assert_not_paused();

            let mut world = self.world(@ns());
            let mut store = StoreImpl::new(world);

            let ryo_addresses = store.ryo_addresses();
            let player_id = get_caller_address();
            let random = IVrfProviderDispatcher { contract_address: ryo_addresses.vrf }
                .consume_random(Source::Nonce(player_id));
            let mut randomizer = RandomImpl::new(random);

            let game_id = world.dispatcher.uuid();

            // get season version
            let mut season_manager = SeasonManagerTrait::new(store);
            let season_version = season_manager.get_current_version();

            // PR-1e: ranked vs noob distinction is gone in v2 — entry stake
            // is paid via the purchase contract (PR-1d), not on game start.
            // The game_mode field still flows through to the helpers because
            // trading::execute_trade rejects Warrior mode.

            // [Lookup] Hustler ERC721 contract via DNS.
            let hustler_address = world
                .dns_address(@"hustler")
                .expect('hustler not found');
            let hustler_dispatcher = IERC721Dispatcher { contract_address: hustler_address };

            // [Check] Caller owns the hustler token.
            assert(
                player_id == hustler_dispatcher.owner_of(hustler_token_id.into()),
                'not hustler owner',
            );

            // [Read] HustlerInstance — written by the purchase contract on
            // mint. Holds the gear loadout the buyer's pack came with.
            let mut hustler_instance: HustlerInstance = world.read_model(hustler_token_id);
            assert(hustler_instance.token_id == hustler_token_id, 'hustler not registered');
            assert(!hustler_instance.used, 'hustler already used');

            // [Compute] equipment_by_slot — slot order matches ItemSlot enum
            // (0=Weapon, 1=Clothes, 2=Feet, 3=Transport). Stored as felt252
            // ids; items_packed reads the low byte as the item id.
            let equipment_by_slot = array![
                hustler_instance.gear_weapon.into(),
                hustler_instance.gear_clothes.into(),
                hustler_instance.gear_feet.into(),
                hustler_instance.gear_transport.into(),
            ]
                .span();

            // [Effect] Mark the hustler used and bind it to this game.
            hustler_instance.used = true;
            hustler_instance.game_id = game_id;
            world.write_model(@hustler_instance);

            // create game
            let mut game_config = store.game_config(season_version);
            let mut game = GameImpl::new(
                game_id,
                player_id,
                season_version,
                game_mode,
                player_name,
                multiplier,
                hustler_token_id,
                equipment_by_slot,
            );

            // save Game
            store.set_game(@game);

            // create & save GameStorePacked
            let game_store = GameStoreImpl::new(store, ref game, ref game_config, ref randomizer);
            game_store.save();

            // emit GameCreated
            let game_created = GameCreated {
                game_id,
                player_id,
                game_mode,
                player_name,
                multiplier,
                hustler_token_id,
            };
            world.emit_event(@game_created);
        }

        fn end_game(self: @ContractState, game_id: u32, actions: Span<super::Actions>) {
            let player_id = get_caller_address();

            let mut store = StoreImpl::new(self.world(@ns()));
            let mut game_store = GameStoreImpl::load(ref store, game_id, player_id);

            // execute actions (trades & shop)
            let mut actions = actions;
            self.execute_actions(ref game_store, ref actions);

            //save & on_game_over
            game_loop::on_game_over(ref game_store, ref store);
        }


        fn travel(
            self: @ContractState,
            game_id: u32,
            next_location: Locations,
            actions: Span<super::Actions>,
        ) {
            let mut store = StoreImpl::new(self.world(@ns()));

            let ryo_addresses = store.ryo_addresses();
            let player_id = get_caller_address();
            let random = IVrfProviderDispatcher { contract_address: ryo_addresses.vrf }
                .consume_random(Source::Nonce(player_id));

            //
            let mut game_store = GameStoreImpl::load(ref store, game_id, player_id);

            // check if can travel
            assert(game_store.can_continue(), 'player cannot travel');
            assert(next_location != Locations::Home, 'cannot travel to Home');
            assert(game_store.player.location != next_location, 'already at location');

            // execute actions (trades & shop)
            let mut actions = actions;
            self.execute_actions(ref game_store, ref actions);

            let mut randomizer = RandomImpl::new(random);
            let mut season_settings = store.season_settings(game_store.game.season_version);
            // save next_location
            game_store.player.next_location = next_location;

            // traveling
            let (is_dead, has_encounter) = game_loop::on_travel(
                ref game_store, ref season_settings, ref randomizer,
            );

            // check if dead
            if is_dead {
                // save & gameover RIP
                game_loop::on_game_over(ref game_store, ref store);
            } else {
                if has_encounter {
                    // save & no end turn
                    game_store.save();
                } else {
                    // save & on_turn_end
                    game_loop::on_turn_end(ref game_store, ref randomizer, ref store);
                }
            }
        }
    }


    #[generate_trait]
    impl InternalImpl of InternalTrait {
        // #[inline(always)]
        fn assert_not_paused(self: @ContractState) {
            let mut store = StoreImpl::new(self.world(@ns()));
            let ryo_config = store.ryo_config();
            assert(!ryo_config.paused, 'game is paused');
        }

        fn execute_actions(
            self: @ContractState, ref game_store: GameStore, ref actions: Span<super::Actions>,
        ) {
            let mut has_shopped = false;
            let mut is_first_sell = true;
            let mut is_first_buy = true;

            while let Option::Some(action) = actions.pop_front() {
                match action {
                    super::Actions::Trade(trade_action) => {
                        trading::execute_trade(
                            ref game_store, *trade_action, is_first_sell, is_first_buy,
                        );
                        if *trade_action.direction == TradeDirection::Sell {
                            is_first_sell = false;
                        }
                        if *trade_action.direction == TradeDirection::Buy {
                            is_first_sell = false;
                        };
                    },
                    super::Actions::Shop(shop_action) => {
                        assert(has_shopped == false, 'one upgrade by turn');
                        shopping::execute_action(ref game_store, *shop_action);
                        has_shopped = true;
                    },
                };
            };
        }
    }
}
