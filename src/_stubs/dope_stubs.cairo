//! Transitional stubs replacing the `dope_types` external crate that v2 is
//! dropping. PR-0a removes the L1 Dope NFT integration so the codebase builds
//! without `../dope-migration/cairo/types`. The actual hustler/gear system is
//! introduced fresh in PR-1 (see docs/V2_DESIGN.md).
//!
//! Everything in this file is intentionally non-functional. Any runtime code
//! path that reaches a stub method panics, signalling "this branch is dead
//! pending PR-1." Tests should not exercise stub code; PR-1 deletes this file.

use dojo::world::WorldStorage;

// ──────────────────────────────────────────────────────────────────────────
// Slot enum
// ──────────────────────────────────────────────────────────────────────────

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
pub enum HustlerSlots {
    Weapon,
    Clothe,
    Foot,
    Vehicle,
    Accessory,
}

// ──────────────────────────────────────────────────────────────────────────
// Event payload shapes — replaced by v2 native types in PR-1
// ──────────────────────────────────────────────────────────────────────────

#[derive(Copy, Drop, Serde, Introspect)]
pub struct HustlerSlot {
    pub slot: HustlerSlots,
    pub gear_item_id: Option<felt252>,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub struct HustlerBody {
    pub slot: u8,
    pub item: u8,
}

// ──────────────────────────────────────────────────────────────────────────
// HustlerStore — read-side stub for Dope Hustlers NFT
// ──────────────────────────────────────────────────────────────────────────

#[derive(Drop, Copy)]
pub struct HustlerStore {
    pub world: WorldStorage,
}

#[generate_trait]
pub impl HustlerStoreImpl of HustlerStoreTrait {
    fn new(world: WorldStorage) -> HustlerStore {
        HustlerStore { world }
    }

    fn hustler_slot(self: @HustlerStore, _hustler_id: u256, slot: HustlerSlots) -> HustlerSlot {
        // Stub: returns an empty slot. PR-1 replaces the entire HustlerId
        // game branch with the new starterpack-minted hustler flow.
        HustlerSlot { slot, gear_item_id: Option::None }
    }

    fn hustler_slot_full(self: @HustlerStore, _hustler_id: u256) -> Span<HustlerSlot> {
        array![].span()
    }

    fn hustler_body_full(self: @HustlerStore, _hustler_id: u256) -> Span<HustlerBody> {
        array![].span()
    }
}

// ──────────────────────────────────────────────────────────────────────────
// LootStore — read-side stub for Dope Loot NFT
// ──────────────────────────────────────────────────────────────────────────

#[derive(Drop, Copy)]
pub struct LootStore {
    pub world: WorldStorage,
}

#[generate_trait]
pub impl LootStoreImpl of LootStoreTrait {
    fn new(world: WorldStorage) -> LootStore {
        LootStore { world }
    }

    fn gear_item_id(self: @LootStore, _loot_id: u256, _slot: HustlerSlots) -> u256 {
        // Stub: returns 0. PR-1 removes the LootId/GuestLootId game branches
        // entirely — v2 only supports HustlerId via starterpack purchase.
        0_u256
    }
}
