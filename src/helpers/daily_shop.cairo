// Daily shop helpers — pure functions, no world access.
//
// Each day, each slot offers one random item from the full 72-item
// gear catalog. The pick is derived from a deterministic hash of
// (day, slot), so anyone can compute today's lineup from the block
// timestamp without querying the contract. No VRF needed.
//
// The catalog layout (from content::dojo_init):
//   Weapon   (slot 0): 18 items, ids  1..18
//   Clothes  (slot 1): 20 items, ids 19..38
//   Feet     (slot 2): 17 items, ids 39..55
//   Transport(slot 3): 17 items, ids 56..72
//
// The pick formula is: first_id + poseidon_hash(day, slot) % count.
// This gives each slot an independent random item each day — you
// might see AK47 (tier-1 weapon) alongside Flip Flops (tier-3 feet).
//
// Pricing is based on the GearTemplate.tier field which the
// marketplace reads from the world, not from this helper.

use core::poseidon::poseidon_hash_span;
use rollyourown::systems::content;

/// Day number from a block timestamp (seconds since epoch).
pub fn day_number(timestamp: u64) -> u32 {
    (timestamp / 86400).try_into().unwrap()
}

/// Per-slot item count from the full catalog.
pub fn items_in_slot(slot: u8) -> u8 {
    if slot == 0 {
        content::WEAPON_COUNT
    } else if slot == 1 {
        content::CLOTHES_COUNT
    } else if slot == 2 {
        content::FEET_COUNT
    } else if slot == 3 {
        content::TRANSPORT_COUNT
    } else {
        0
    }
}

/// First GearTemplate id for a given slot.
pub fn first_id_for_slot(slot: u8) -> u8 {
    if slot == 0 {
        content::WEAPON_FIRST_ID
    } else if slot == 1 {
        content::CLOTHES_FIRST_ID
    } else if slot == 2 {
        content::FEET_FIRST_ID
    } else if slot == 3 {
        content::TRANSPORT_FIRST_ID
    } else {
        0
    }
}

/// Today's GearTemplate id for the given slot. Deterministic random
/// pick from the full catalog for that slot.
/// Returns 0 if slot is out of range.
pub fn todays_item(timestamp: u64, slot: u8) -> u8 {
    let count = items_in_slot(slot);
    if count == 0 {
        return 0;
    }
    let day: u32 = day_number(timestamp);
    let hash = poseidon_hash_span(array![day.into(), slot.into()].span());
    let hash_u256: u256 = hash.into();
    let index: u8 = (hash_u256 % count.into()).try_into().unwrap();
    first_id_for_slot(slot) + index
}
