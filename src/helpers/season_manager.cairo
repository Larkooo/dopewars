use dojo::event::EventStorage;
use dojo::model::ModelStorage;
use dojo::world::WorldStorageTrait;
use openzeppelin::interfaces::token::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
use rollyourown::config::ryo::RyoConfigTrait;
use rollyourown::config::settings::SeasonSettingsImpl;
use rollyourown::constants::TEN_POW_18;
use rollyourown::events::NewHighScore;
use rollyourown::helpers::rewarder::Rewarder;
use rollyourown::models::hustler_instance::HustlerInstance;
use rollyourown::models::starterpack::Starterpack;
use rollyourown::packing::game_store::GameStore;
use rollyourown::store::{Store, StoreImpl, StoreTrait};
use rollyourown::tokens::paper::{IPaperTokenDispatcher, IPaperTokenDispatcherTrait};
use rollyourown::utils::random::Random;

#[derive(Drop, Copy)]
pub struct SeasonManager {
    store: Store,
}


#[generate_trait]
pub impl SeasonManagerImpl of SeasonManagerTrait {
    fn new(store: Store) -> SeasonManager {
        SeasonManager { store }
    }

    fn get_current_version(ref self: SeasonManager) -> u16 {
        let ryo_config = self.store.ryo_config();
        ryo_config.season_version
    }

    fn get_next_version_timestamp(ref self: SeasonManager) -> u64 {
        let current_timestamp = starknet::get_block_timestamp();
        let ryo_config = self.store.ryo_config();

        current_timestamp + ryo_config.season_duration.into()
    }

    fn new_season(ref self: SeasonManager, ref randomizer: Random, version: u16) {
        let mut store = self.store;
        let ryo_config = store.ryo_config();

        let season = ryo_config.build_season(version);
        let season_settings = SeasonSettingsImpl::random(ref randomizer, version);
        let game_config = season_settings.build_game_config();

        store.save_season(@season);
        store.save_season_settings(@season_settings);
        store.save_game_config(@game_config);
    }

    /// PR-1e: entry-stake collection moved to the purchase contract
    /// (PR-1d). The purchase flow burns PAPER directly, so the per-game
    /// transfer here is gone. Kept as a no-op for the create_game caller
    /// path until PR-1g (cleanup) drops it entirely.
    fn on_game_start(ref self: SeasonManager, _multiplier: u8) {}

    /// Compute the per-game PAPER reward via the supply-aware curve, mint
    /// it to the player, and update the EMA tracker. Called from
    /// game_loop::on_game_over after the GameOver event is emitted. Also
    /// updates the season high score and writes the final score back to
    /// the player's HustlerInstance for the leaderboard / trophy view.
    ///
    /// Returns the reward amount in PAPER wei.
    fn on_register_score(ref self: SeasonManager, ref game_store: GameStore) -> u128 {
        let mut store = self.store;
        let mut world = store.world;
        let final_score = game_store.player.cash;

        // [Read] PAPER + reward params.
        let paper_address = world.dns_address(@"paper").expect('paper not found');
        let paper = IPaperTokenDispatcher { contract_address: paper_address };
        let paper_erc20 = IERC20Dispatcher { contract_address: paper_address };
        let mut ryo_config = store.ryo_config();

        // [Read] Pack the hustler was minted from — gives us the burn input
        // for the rewarder. Falls back to 0 if the hustler is missing
        // (e.g. devtools fake games), which collapses the multiplier to 0
        // and skips the mint.
        let hustler_instance: HustlerInstance = world.read_model(game_store.game.hustler_token_id);
        // PR-1f: Starterpack catalog is now keyed by bundle_id (u32),
        // matching what HustlerInstance stores.
        let pack: Starterpack = world.read_model(hustler_instance.bundle_id);

        // [Compute] rewarder inputs. supply / target / burn are all in
        // PAPER wei (18 decimals). target_supply on RyoConfig is whole
        // tokens, so multiply up.
        let supply: u256 = paper_erc20.total_supply();
        let target: u256 = ryo_config.target_supply.into() * TEN_POW_18.into();
        let burn: u256 = pack.price_paper.into();
        let (avg_num, avg_den) = ryo_config.get_average_score();
        let max_score: u256 = ryo_config.max_score.into();

        let multiplier = Rewarder::multiplier(
            supply, target, burn, avg_num.into(), avg_den.into(), max_score,
        );
        let reward_u256 = Rewarder::amount(final_score.into(), 1, max_score, multiplier);
        let reward: u128 = reward_u256.try_into().unwrap_or(0);

        // [Effect] Mint the reward to the player. Requires MINTER_ROLE on
        // the PAPER contract; deploy script grants it to this game contract.
        if reward > 0 {
            paper.reward(game_store.game.player_id, reward.into());
        }

        // [Effect] Record the reward on the Game model so the UI can show it
        // without re-deriving from events.
        game_store.game.reward = reward;
        game_store.game.final_score = final_score;
        game_store.game.registered = true;
        store.set_game(@game_store.game);

        // [Effect] Push the score into the EMA tracker.
        ryo_config.push_score(final_score);
        store.save_ryo_config(@ryo_config);

        // [Effect] Update HustlerInstance with the final score for the
        // trophy view. The `used` flag was already set in create_game.
        let mut updated_instance = hustler_instance;
        updated_instance.final_score = final_score;
        world.write_model(@updated_instance);

        // [Effect] Update the season high score. The Season model still has
        // a high_score field; PR-1g may strip the rest of the jackpot
        // bookkeeping but the leaderboard wrapper survives v2.
        let current_version = self.get_current_version();
        let mut season = store.season(current_version);
        if final_score > season.high_score {
            season.high_score = final_score;
            season.next_version_timestamp = self.get_next_version_timestamp();
            store.save_season(@season);

            world
                .emit_event(
                    @NewHighScore {
                        game_id: game_store.game.game_id,
                        player_id: game_store.game.player_id,
                        season_version: game_store.game.season_version,
                        player_name: game_store.game.player_name.into(),
                        hustler_token_id: game_store.game.hustler_token_id,
                        cash: final_score,
                        health: game_store.player.health,
                        reputation: game_store.player.reputation,
                    },
                );
        }

        reward
    }
}
