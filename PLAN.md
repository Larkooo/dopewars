# Equip Flow Implementation Plan

## Overview

Allow players to equip `GearInstance` items from their wallet onto a `HustlerInstance` before starting a game. Currently gear is baked at purchase time from starterpack loadouts and can't be changed. The equip flow makes marketplace-bought gear usable.

## Goals

- Player can equip a `GearInstance` they own onto a `HustlerInstance` they own (before it's used)
- Player can unequip gear back to their inventory for reuse on another hustler
- `create_game` reads the equipped gear as-is (no changes to the game contract)
- Gear slot validation: a weapon GearInstance can only go in the weapon slot

## Non-Goals

- Equipping during a game (gear is locked once `create_game` runs)
- Transferring GearInstances between wallets (secondary market)
- Minting GearInstances from pack gear (pack gear is just template ids, not owned instances — equipping over it overwrites silently)
- Changing the game contract's `create_game` interface

## Current State

```
HustlerInstance.gear_weapon: u8      ← template id (0..72), set at purchase
HustlerInstance.gear_clothes: u8
HustlerInstance.gear_feet: u8
HustlerInstance.gear_transport: u8
HustlerInstance.used: bool           ← true after create_game

GearInstance.id: u32                 ← unique uuid from marketplace buy
GearInstance.owner: ContractAddress
GearInstance.template_id: u8         ← references GearTemplate.id

GearTemplate.id: u8
GearTemplate.slot: u8               ← 0=Weapon, 1=Clothes, 2=Feet, 3=Transport
```

`create_game` reads `HustlerInstance.gear_*` and passes them to `GameImpl::new` as `equipment_by_slot`. No changes needed there — equip just writes different values into `gear_*` before the game starts.

## Technical Design

### New Entrypoints

On a new `IEquip` trait, implemented by a new contract OR added to the existing `marketplace` contract (simpler — marketplace already has writer access to the namespace):

```cairo
trait IEquip {
    /// Equip a GearInstance onto a HustlerInstance slot.
    /// Validates: caller owns both, hustler not used, gear slot matches.
    /// The GearInstance is marked as equipped (not available for other hustlers).
    fn equip(ref self, hustler_token_id: u64, gear_instance_id: u32);

    /// Unequip gear from a slot, returning the GearInstance to inventory.
    /// The HustlerInstance slot reverts to 0 (no gear) or the original
    /// pack template id — simplest is 0.
    fn unequip(ref self, hustler_token_id: u64, slot: u8);
}
```

### Model Changes

**GearInstance** — add `equipped_to: u64` field:
```cairo
pub struct GearInstance {
    #[key] pub id: u32,
    pub owner: ContractAddress,
    pub template_id: u8,
    pub purchased_day: u32,
    pub equipped_to: u64,    // NEW: hustler token_id this is equipped to (0 = in inventory)
}
```

This prevents double-equipping the same GearInstance to multiple hustlers.

**HustlerInstance** — no schema change needed. `gear_*` fields already hold template ids. Equip writes the GearInstance's template_id into the right slot. Unequip writes 0.

### Equip Flow

```
equip(hustler_token_id=42, gear_instance_id=7):
  1. Read HustlerInstance(42) — assert caller == hustler NFT owner, !used
  2. Read GearInstance(7) — assert caller == owner, equipped_to == 0
  3. Read GearTemplate(gear.template_id) — get slot
  4. Write gear.template_id into HustlerInstance.gear_[slot]
  5. Write equipped_to = hustler_token_id on GearInstance
```

### Unequip Flow

```
unequip(hustler_token_id=42, slot=1):
  1. Read HustlerInstance(42) — assert caller == hustler NFT owner, !used
  2. Read current template_id from HustlerInstance.gear_[slot]
  3. If template_id != 0, find the GearInstance with equipped_to == 42 and template_id
     — OR simpler: store the gear_instance_id on HustlerInstance too
  4. Write 0 into HustlerInstance.gear_[slot]
  5. Write equipped_to = 0 on the GearInstance (back to inventory)
```

**Problem with unequip:** we need to find WHICH GearInstance is equipped in that slot. Options:

**(a)** Store `gear_instance_id` alongside `template_id` on HustlerInstance — adds 4 more u32 fields. Clean but bloats the model.

**(b)** Change `gear_*` fields from `u8` (template_id) to `u32` (gear_instance_id). Then read the GearInstance to get the template_id when needed. Breaks the existing `create_game` which expects template ids.

**(c)** Add a reverse-lookup model `EquippedGear { hustler_token_id, slot } -> gear_instance_id`. Clean, no HustlerInstance bloat, easy unequip lookup.

**Recommendation: (c)** — new `EquippedGear` model.

### New Model: EquippedGear

```cairo
#[dojo::model]
pub struct EquippedGear {
    #[key] pub hustler_token_id: u64,
    #[key] pub slot: u8,
    pub gear_instance_id: u32,   // 0 = nothing equipped from inventory
}
```

This is a join table between HustlerInstance and GearInstance. `equip` writes both `HustlerInstance.gear_*` (for game consumption) AND `EquippedGear` (for unequip lookup). `unequip` reads `EquippedGear` to find the gear_instance_id, clears both.

## Implementation Plan

### Phase 0: Model Changes

| Task | Description | Output |
|------|-------------|--------|
| 0.1 | Add `equipped_to: u64` to GearInstance model + constructor | Updated model |
| 0.2 | Create `EquippedGear` model (hustler_token_id + slot → gear_instance_id) | New model file |
| 0.3 | Register new model in lib.cairo | Module declaration |
| 0.4 | Update marketplace's `buy()` to pass `equipped_to: 0` to GearInstanceTrait::new | Backward compat |
| 0.5 | Update unit tests for new GearInstance constructor | Green tests |

### Phase 1: Equip/Unequip Contract

| Task | Description | Output |
|------|-------------|--------|
| 1.1 | Add `IEquip` trait to marketplace.cairo (equip + unequip) | Interface |
| 1.2 | Implement `equip`: ownership checks, slot validation, write HustlerInstance.gear_*, write EquippedGear, write GearInstance.equipped_to | Logic |
| 1.3 | Implement `unequip`: ownership check, read EquippedGear, clear slot, clear equipped_to | Logic |
| 1.4 | Register EquippedGear in v2_helper + v2_marketplace test fixtures | Test infra |

### Phase 2: Tests

| Task | Description | Output |
|------|-------------|--------|
| 2.1 | test_equip_happy_path — buy gear from marketplace, equip to hustler, verify gear_* updated | Integration test |
| 2.2 | test_equip_wrong_slot_reverts — weapon GearInstance into clothes slot | Integration test |
| 2.3 | test_equip_not_owner_reverts — caller doesn't own the hustler | Integration test |
| 2.4 | test_equip_used_hustler_reverts — hustler already played | Integration test |
| 2.5 | test_equip_already_equipped_reverts — GearInstance already on another hustler | Integration test |
| 2.6 | test_unequip_happy_path — equip then unequip, verify slot cleared + GearInstance freed | Integration test |
| 2.7 | test_unequip_empty_slot_reverts — nothing to unequip | Integration test |
| 2.8 | test_equip_overwrites_pack_gear — equip over the starter junk, verify new template id | Integration test |

## Verification Checklist

- [ ] `scarb build` clean
- [ ] `scarb test` — all existing tests pass + 8 new equip tests
- [ ] Equip writes correct template_id into HustlerInstance.gear_[slot]
- [ ] Equip marks GearInstance.equipped_to = hustler_token_id
- [ ] Unequip clears both HustlerInstance.gear_[slot] and GearInstance.equipped_to
- [ ] Double-equip same GearInstance reverts
- [ ] Equip to used hustler reverts
- [ ] Wrong-slot equip reverts

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| HustlerInstance.gear_* holds template_id but we need to track instance_id for unequip | Certain | Med | EquippedGear join model solves this cleanly |
| Hustler ownership check needs ERC721 dispatcher | Low | Low | Already done in create_game — same pattern |
| Pack gear (template ids baked at purchase) has no GearInstance — unequip after overwriting pack gear would fail | Med | Low | Unequip checks EquippedGear row; if it's 0 (pack gear, never equipped via marketplace), slot just gets set to 0 |

## Decision Log

| Decision | Rationale | Alternatives |
|----------|-----------|-------------|
| Separate equip entrypoint (not at create_game time) | Simpler contract change; frontend builds inventory→equip→play flow | Pass equipment as create_game calldata |
| Overwrite pack gear silently | Pack gear is template ids, not owned instances; no GearInstance to return | Mint GearInstances for pack gear at purchase |
| EquippedGear join model for reverse lookup | Avoids bloating HustlerInstance with 4 extra u32 fields | Store gear_instance_ids on HustlerInstance directly |
| Add equip to marketplace contract | Already has namespace writer access; avoids deploying a new contract | New standalone equip contract |
| equip + unequip (not swap-only) | Gear reusability across hustler runs is the whole point of GearInstance | Swap-only (gear consumed on equip) |
