use starknet::ContractAddress;

#[starknet::interface]
trait ILaundromat<T> {
    fn register_score(self: @T, game_id: u32, prev_game_id: u32, prev_player_id: ContractAddress);
    fn launder(self: @T, season_version: u16);

    fn claim(self: @T, player_id: ContractAddress, game_ids: Span<u32>);
    fn claim_treasury(self: @T);
    fn supercharge_jackpot(self: @T, season_version: u16, amount_eth: u32);
}

#[dojo::contract]
mod laundromat {
    use achievement::store::StoreTrait as BushidoStoreTrait;
    use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};
    use dojo::event::EventStorage;
    use dojo::world::WorldStorageTrait;
    use dope_types::dope_gear::{GearItem, IDopeGearABIDispatcher, IDopeGearABIDispatcherTrait};
    use dope_types::dope_hustlers::{IDopeHustlersABIDispatcher, IDopeHustlersABIDispatcherTrait};
    use dope_types::helpers::is_og;
    use rollyourown::achievements::achievements_v1::Tasks;
    use rollyourown::config::ryo::RyoConfigTrait;
    use rollyourown::constants::{ETHER, MAX_MULTIPLIER, ns};
    use rollyourown::events::{Claimed, NewSeason};
    use rollyourown::helpers::rewarder::{Rewarder, RewarderTrait};
    use rollyourown::helpers::season_manager::{SeasonManagerImpl, SeasonManagerTrait};
    use rollyourown::interfaces::paper::{IPaperDispatcher, IPaperDispatcherTrait};
    use rollyourown::libraries::dopewars_items::{
        IDopewarsItemsDispatcherTrait, IDopewarsItemsLibraryDispatcher,
    };
    use rollyourown::models::game::{Game, GameImpl, GameTrait, TokenId};
    use rollyourown::models::season::{SeasonImpl, SeasonTrait};
    use rollyourown::packing::game_store::GameStoreImpl;
    use rollyourown::store::{StoreImpl, StoreTrait};
    use rollyourown::utils::payout_items::add_items_payout;
    use rollyourown::utils::random::RandomImpl;
    use rollyourown::utils::sorted_list::{SortedListImpl, SortedListTrait};
    use starknet::{ContractAddress, get_caller_address, get_contract_address};


    #[abi(embed_v0)]
    impl LaundromatImpl of super::ILaundromat<ContractState> {
        fn register_score(
            self: @ContractState, game_id: u32, prev_game_id: u32, prev_player_id: ContractAddress,
        ) {
            let world = self.world(@ns());

            let mut store = StoreImpl::new(world);

            let player_id = get_caller_address();

            let mut game = store.game(game_id, player_id);
            let season = store.season(game.season_version);

            // check if valid game
            assert(game.exists(), 'invalid game');
            // check if ranked game
            assert(game.is_ranked(), 'game is not ranked');
            // check dat game exists & is game_over
            assert(game.game_over, 'game is not over');
            // check not already registered
            assert(!game.registered, 'already registered');
            // check if season is still opened
            assert(season.is_open(), 'season has closed');

            // register final_score (cash earned)
            let mut game_store = GameStoreImpl::load(ref store, game_id, player_id);
            game.final_score = game_store.player.cash;
            game.registered = true;

            // --- Per-game reward calculation using nums-style curve ---
            let mut ryo_config = store.ryo_config();

            // Get laundromat Paper balance as "supply"
            let ryo_addresses = store.ryo_addresses();
            let laundromat_address = world.dns_address(@"laundromat").unwrap();
            let supply: u256 = IPaperDispatcher { contract_address: ryo_addresses.paper }
                .balance_of(laundromat_address);

            // burn = entry fee paid by player (in wei)
            let paper_fee: u32 = season.paper_fee.into() * game.multiplier.into();
            let burn: u256 = paper_fee.into() * ETHER;

            // Get average score from EMA
            let (avg_score_num, avg_score_den) = ryo_config.get_average_score();

            // Calculate multiplier using rewarder curve
            let reward_multiplier = Rewarder::multiplier(
                supply,
                ryo_config.target_supply.into() * ETHER,
                burn,
                avg_score_num.into(),
                avg_score_den.into(),
                ryo_config.max_score.into(),
            );

            // Calculate reward amount for this game's actual score
            let reward_wei = Rewarder::amount(
                game.final_score.into(),
                1, // score_den = 1 (cash is a whole number)
                ryo_config.max_score.into(),
                reward_multiplier,
            );

            // Store claimable in whole Paper tokens
            game.claimable = (reward_wei / ETHER).try_into().unwrap();

            // Update EMA with this game's score
            ryo_config.push_score(game.final_score);
            store.save_ryo_config(@ryo_config);

            store.set_game(@game);

            // handle new highscore & season version
            let mut season_manager = SeasonManagerTrait::new(store);
            season_manager.on_register_score(ref game_store);

            // Still add to sorted list for leaderboard display
            let list_id = game.season_version.into();
            let mut sorted_list = SortedListImpl::get(@store, list_id);
            sorted_list.add(ref store, game, (prev_game_id, prev_player_id));

            // quests
            let bushido_store = BushidoStoreTrait::new(world);

            if game_store.player.health == 1 {
                bushido_store
                    .progress(
                        player_id.into(), Tasks::SURVIVOR, 1, starknet::get_block_timestamp(),
                    );
            }

            if game_store.player.reputation == 100 {
                bushido_store
                    .progress(player_id.into(), Tasks::FAMOUS, 1, starknet::get_block_timestamp());
            }

            if game.multiplier == MAX_MULTIPLIER {
                bushido_store
                    .progress(
                        player_id.into(), Tasks::HIGH_STAKES, 1, starknet::get_block_timestamp(),
                    );
            }

            if let TokenId::HustlerId(huster_id) = game.token_id {
                if is_og(huster_id.into()) {
                    bushido_store
                        .progress(player_id.into(), Tasks::OG, 1, starknet::get_block_timestamp());
                }

                let weapon_id: u256 = (*game.equipment_by_slot.at(0)).into();
                let clothe_id: u256 = (*game.equipment_by_slot.at(1)).into();
                let foot_id: u256 = (*game.equipment_by_slot.at(2)).into();
                let vehicle_id: u256 = (*game.equipment_by_slot.at(3)).into();

                let weapon: GearItem = weapon_id.into();
                let clothe: GearItem = clothe_id.into();
                let foot: GearItem = foot_id.into();
                let vehicle: GearItem = vehicle_id.into();

                if weapon.suffix > 0
                    && weapon.suffix == clothe.suffix
                    && weapon.suffix == foot.suffix
                    && weapon.suffix == vehicle.suffix {
                    bushido_store
                        .progress(
                            player_id.into(), Tasks::GEAR_FROM, 1, starknet::get_block_timestamp(),
                        );
                }

                let items_disp = IDopewarsItemsLibraryDispatcher {
                    class_hash: world.dns_class_hash(@"DopewarsItems_v0").unwrap(),
                };

                let weapon_tier = items_disp.get_item_tier(weapon.slot, weapon.item);
                let clothe_tier = items_disp.get_item_tier(clothe.slot, clothe.item);
                let foot_tier = items_disp.get_item_tier(foot.slot, foot.item);
                let vehicle_tier = items_disp.get_item_tier(vehicle.slot, vehicle.item);

                if weapon_tier == clothe_tier
                    && weapon_tier == foot_tier
                    && weapon_tier == vehicle_tier {
                    let task = match weapon_tier {
                        0 => panic!("invalid tier"),
                        1 => Tasks::FULL_LATE,
                        2 => Tasks::FULL_MID,
                        3 => Tasks::FULL_EARLY,
                        _ => panic!("invalid tier"),
                    };
                    bushido_store
                        .progress(player_id.into(), task, 1, starknet::get_block_timestamp());
                }
            }
        }

        fn launder(self: @ContractState, season_version: u16) {
            let world = self.world(@ns());
            let mut store = StoreImpl::new(world);

            let ryo_addresses = store.ryo_addresses();
            let player_id = get_caller_address();
            let random = IVrfProviderDispatcher { contract_address: ryo_addresses.vrf }
                .consume_random(Source::Nonce(player_id));

            let season = store.season(season_version);

            let mut ryo_config = store.ryo_config();

            // check if exists
            assert(season.exists(), 'invalid season_version');
            // check if close
            assert(!season.is_open(), 'season is still opened');

            // retrieve Season SortedList (still used for season transition tracking)
            let list_id = season_version.into();
            let mut sorted_list = SortedListImpl::get(@store, list_id);

            // Mark list as locked and processed (rewards already calculated per-game)
            if !sorted_list.locked {
                sorted_list.lock(ref store, 0, 0);
            }
            if !sorted_list.processed {
                sorted_list.processed = true;
                sorted_list.set(ref store);
            }

            // create new season
            let next_season = store.season(season_version + 1);
            if !next_season.exists() {
                // update current version
                ryo_config.season_version += 1;
                store.save_ryo_config(@ryo_config);

                // create new season
                let mut randomizer = RandomImpl::new(random);
                let mut season_manager = SeasonManagerTrait::new(store);
                season_manager.new_season(ref randomizer, ryo_config.season_version);

                // emit NewSeason
                store
                    .world
                    .emit_event(
                        @NewSeason {
                            key: ryo_config.season_version,
                            season_version: ryo_config.season_version,
                        },
                    );
            } else {
                assert(false, 'launder already ended');
            }

            // retrieve paper address
            let paper_address = store.ryo_addresses().paper;
            let paper_reward_launderer: u256 = ryo_config.paper_reward_launderer.into() * ETHER;

            // reward launderer with some clean paper
            IPaperDispatcher { contract_address: paper_address }
                .transfer(get_caller_address(), paper_reward_launderer);
        }

        fn claim(self: @ContractState, player_id: ContractAddress, game_ids: Span<u32>) {
            let world = self.world(@ns());
            let mut dope_world = self.world(@"dope");

            let mut store = StoreImpl::new(world);

            let mut game_ids = game_ids;

            let mut gear_ids: Array<u256> = array![];
            let mut gear_ids_values: Array<u256> = array![];
            let mut hustler_count = 0;

            let hustler_dispatcher = IDopeHustlersABIDispatcher {
                contract_address: dope_world.dns_address(@"DopeHustlers").unwrap(),
            };
            let gear_dispatcher = IDopeGearABIDispatcher {
                contract_address: dope_world.dns_address(@"DopeGear").unwrap(),
            };

            let bushido_store = BushidoStoreTrait::new(world);
            let mut total_claimable = 0;

            while let Option::Some(game_id) = game_ids.pop_front() {
                let mut game = store.game(*game_id, player_id);

                // Per-game reward: just check game is registered and has a reward
                assert(game.registered, 'unregistered game');
                assert(!game.claimed, 'already claimed');
                assert(game.claimable > 0, 'nothing to claim');

                total_claimable = total_claimable + game.claimable;

                // update claimed & save
                game.claimed = true;
                store.set_game(@game);

                // add items rewards (top positions still get NFT rewards based on leaderboard)
                if game.position > 0 {
                    add_items_payout(
                        ref dope_world,
                        ref gear_ids,
                        ref gear_ids_values,
                        ref hustler_count,
                        game.season_version,
                        game.position,
                    );
                }

                // emit Claimed event
                store
                    .world
                    .emit_event(
                        @Claimed {
                            game_id: game.game_id,
                            player_id,
                            season_version: game.season_version,
                            paper: game.claimable,
                            rank: game.position,
                        },
                    );

                if game.position == 1 {
                    bushido_store
                        .progress(
                            player_id.into(), Tasks::KINGPIN, 1, starknet::get_block_timestamp(),
                        );
                }
            }

            bushido_store
                .progress(
                    player_id.into(),
                    Tasks::PAPER,
                    total_claimable.into(),
                    starknet::get_block_timestamp(),
                );

            // retrieve paper address
            let paper_address = store.ryo_addresses().paper;
            let total_claimable: u256 = total_claimable.into() * ETHER;

            // transfer reward to player_id
            IPaperDispatcher { contract_address: paper_address }
                .transfer(player_id, total_claimable);

            // mint gear items
            gear_dispatcher
                .mint_batch(player_id, gear_ids.span(), gear_ids_values.span(), array![].span());

            // mint hustlers
            while hustler_count > 0 {
                hustler_dispatcher.mint_hustler_to(player_id);
                hustler_count -= 1;
            }
        }

        fn claim_treasury(self: @ContractState) {
            let mut store = StoreImpl::new(self.world(@ns()));
            let mut ryo_config = store.ryo_config();

            assert(ryo_config.treasury_balance > 0, 'nothin to claim');

            // calc claimable amount
            let claimable: u256 = ryo_config.treasury_balance.into() * ETHER;

            // reset treasury_balance
            ryo_config.treasury_balance = 0;
            store.save_ryo_config(@ryo_config);

            let ryo_addresses = store.ryo_addresses();
            // transfer claimable to treasury
            IPaperDispatcher { contract_address: ryo_addresses.paper }
                .transfer(ryo_addresses.treasury, claimable);
        }

        fn supercharge_jackpot(self: @ContractState, season_version: u16, amount_eth: u32) {
            let mut store = StoreImpl::new(self.world(@ns()));
            // retrieve season
            let mut season = store.season(season_version);

            // check if exists
            assert(season.exists(), 'invalid season_version');
            // check if still open
            assert(season.is_open(), 'season has ended');

            // update season paper_balance for display & save
            season.paper_balance += amount_eth;
            store.save_season(@season);

            // retrieve paper address
            let ryo_addresses = store.ryo_addresses();
            let amount = amount_eth.into() * ETHER;

            // transfer paper from donnator to laundromat (adds to reward balance)
            IPaperDispatcher { contract_address: ryo_addresses.paper }
                .transfer_from(get_caller_address(), get_contract_address(), amount);
        }
    }
}
