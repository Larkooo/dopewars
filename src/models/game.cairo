use rollyourown::store::StoreImpl;
use rollyourown::{utils::{bytes16::{Bytes16, Bytes16Impl}}};
use starknet::ContractAddress;

pub type GearId = felt252;

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked, DojoStore, Default)]
pub enum GameMode {
    #[default]
    Ranked,
    Noob,
    Warrior,
}

// IntrospectPacked : doesnt supports array
#[derive(Introspect, Copy, Drop, Serde, DojoStore)]
#[dojo::model]
pub struct Game {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    //
    pub season_version: u16,
    pub game_mode: GameMode,
    //
    pub player_name: Bytes16,
    pub multiplier: u8,
    //
    pub game_over: bool,
    pub final_score: u32,
    pub registered: bool,
    pub claimed: bool,
    pub claimable: u32,
    pub position: u16,
    //
    // PR-1e: replaces the v0 TokenId enum (GuestLootId/LootId/HustlerId).
    // The hustler is the v2 native ERC721 token id minted by the purchase
    // contract; the player must own this NFT at create_game time.
    pub hustler_token_id: u64,
    // PAPER reward minted on game over (0 if the score is below the
    // curve break-even or PAPER supply is over 2x target). Set by
    // season_manager::on_register_score in PR-1e.
    pub reward: u128,
    // sorted by slot order 0,1,2,3 (Weapon, Clothes, Feet, Transport).
    // Holds raw item ids as felt252 — the slot is implied by the index.
    pub equipment_by_slot: Span<GearId>,
}

#[generate_trait]
pub impl GameImpl of GameTrait {
    fn new(
        game_id: u32,
        player_id: ContractAddress,
        season_version: u16,
        game_mode: GameMode,
        player_name: felt252,
        multiplier: u8,
        hustler_token_id: u64,
        equipment_by_slot: Span<GearId>,
    ) -> Game {
        Game {
            game_id,
            player_id,
            //
            season_version,
            game_mode,
            //
            player_name: Bytes16Impl::from(player_name),
            multiplier,
            //
            game_over: false,
            final_score: 0,
            registered: false,
            claimed: false,
            claimable: 0,
            position: 0,
            //
            hustler_token_id,
            reward: 0,
            equipment_by_slot,
        }
    }

    fn exists(self: Game) -> bool {
        self.season_version > 0
    }

    fn is_ranked(self: Game) -> bool {
        self.game_mode == GameMode::Ranked
    }
}


#[generate_trait]
pub impl GearIdImpl of GearIdTrait {
    fn item_id(self: @GearId) -> u8 {
        let value: u256 = (*self).into();
        (value & 0xff).try_into().unwrap()
    }
    fn slot_id(self: @GearId) -> u8 {
        let value: u256 = (*self).into();
        (value & 0xff00).try_into().unwrap()
    }
}
