# Dopewars v2 — Design & Architecture

> Living document. Source of truth for the v2 contract layer.
> Last updated: 2026-04-10.

## Vision

V2 is a **fresh-world** rebuild of dopewars on the nums-style economic loop:

- **Mint-against-supply rewards** — no jackpot pool. PAPER is minted to the
  player at game-end based on the supply-aware Rewarder curve.
- **Starterpacks as entry** — buying a pack via `IBundle::issue` mints a
  Hustler NFT playable for exactly one game.
- **Daily gear marketplace** — a rotating shop sells one gear item per slot
  per day, priced in PAPER with a configurable burn/treasury split.
- **Native Starknet hustlers** — fresh ERC721, no L1 migration.
- **Same dopewars gameplay** — markets, drugs, encounters, locations, turns
  preserved.
- **No migration** — new world, new PAPER token, new hustler collection.

## Build / test / deploy

```bash
scarb build          # compile all contracts
scarb test           # run 93+ tests (unit + integration)
scarb fmt --check    # linter
```

**Deploy sequence** (production):
1. `sozo migrate` deploys the world + all contracts
2. Admin calls `purchase.set_payment_config(usdc, ekubo_router, ..., treasury_address)`
3. Admin calls `purchase.initialize()` (registers 4 paid bundles)
4. Admin calls `marketplace.set_config(tier1_price, tier2_price, tier3_price, burn_percentage)`
5. Admin grants `MINTER_ROLE` on Hustler ERC721 to the purchase contract
6. Admin grants `MINTER_ROLE` on Paper to OWNER (for minting rewards via game contract)

## Player loop

```
1. Connect wallet
2. Pick a starterpack (4 tiers: Naked/Street/Dealer/Kingpin)
3. Pay USDC → arcade BundleComponent handles payment + fees →
   on_issue callback: Ekubo swaps USDC→PAPER, burns PAPER,
   mints Hustler NFT, writes HustlerInstance with per-instance
   paper_burned recorded
4. (Optional) Buy gear from the daily marketplace (PAPER)
5. Play the game (existing dopewars loop)
6. register_score → Rewarder computes reward against PAPER supply
   using the per-instance paper_burned as the burn input →
   PAPER minted to player wallet
7. Hustler stays as a played-out collectible (single-use)
```

## Contract architecture

### Contracts (src/systems/)

| Contract | File | Purpose |
|---|---|---|
| **purchase** | `systems/purchase.cairo` | Embeds arcade `BundleComponent`. Exposes `IBundle::issue/quote/get_metadata`. `BundleTrait::on_issue` callback: Ekubo USDC→PAPER swap-and-burn (gated on `ekubo_router != 0`), treasury share, mint Hustler NFT, write HustlerInstance with `paper_burned`. Admin: `set_payment_config`, `initialize` (registers 4 paid bundles). |
| **marketplace** | `systems/marketplace.cairo` | Daily gear shop. 4 items/day (one per slot), tier rotates 1→2→3. `IMarketplace::buy(slot)` pulls PAPER, burns `burn_percentage`, sends remainder to treasury, mints `GearInstance`. One per slot per day per player. Admin: `set_config`. |
| **content** | `systems/content.cairo` | Seeds 4 `HustlerTemplate` + 12 `GearTemplate` rows in `dojo_init`. Admin: `register_hustler_template`, `register_gear_template`. |
| **game** | `systems/game.cairo` | Game loop. `create_game` validates hustler ownership, reads `HustlerInstance` + `HustlerTemplate`, applies stats via `template.apply_to(ref game_config)`, marks hustler used. `end_game`/`travel` unchanged. `on_game_over` calls `season_manager::on_register_score`. |
| **ryo** | `systems/ryo.cairo` | Season + RyoConfig management. Stripped of v0 jackpot fields in PR-1g. |

### Token contracts (src/tokens/)

| Token | File | Purpose |
|---|---|---|
| **PAPER v2** | `tokens/paper.cairo` | OZ ERC20 + AccessControl. `reward(recipient, amount)` (MINTER_ROLE), `burn(amount)`. |
| **Hustler** | `tokens/hustler.cairo` | OZ ERC721 + AccessControl. `mint(to, soulbound) -> u64`, `burn(token_id)`. Soulbound blocks transfer. |

### Models (src/models/)

| Model | Key | Purpose |
|---|---|---|
| `PaymentConfig` | singleton (key=0) | USDC address, Ekubo router/pool params, base_price, burn_percentage, treasury_percentage, treasury_address |
| `Starterpack` | `bundle_id: u32` | Per-bundle catalog: hustler_template_id, gear_weapon/clothes/feet/transport, stake_multiplier |
| `HustlerInstance` | `token_id: u64` | Per-NFT state: bundle_id, template_id, gear loadout, paper_burned (actual Ekubo swap result), used flag, game_id, final_score |
| `HustlerTemplate` | `id: u8` | Preset stats: health, starting_cash, attack, defense, cargo |
| `GearTemplate` | `id: u8` | Gear catalog: name, slot (0-3), tier (1-3), stat_boost |
| `GearInstance` | `id: u32` | Owned gear unit from marketplace: owner, template_id, purchased_day |
| `MarketConfig` | singleton (key=0) | Per-tier PAPER prices, burn_percentage |
| `DailyPurchase` | `(player, slot, day)` | One-per-slot-per-day limit. `purchased: bool` flag. |
| `RyoConfig` | singleton | Season version, EMA params, target_supply, max_score |
| `Season` | `version: u16` | Leaderboard wrapper: high_score, duration, timestamps |
| `Game` | `(game_id, player_id)` | Per-run state: hustler_token_id, multiplier, reward, final_score |

### Helpers (src/helpers/)

| Helper | File | Purpose |
|---|---|---|
| `rewarder` | `helpers/rewarder.cairo` | Pure math: `multiplier(supply, target, burn, avg_num, avg_den, max_score)`, `amount(score, quantity, max_score, multiplier)` |
| `season_manager` | `helpers/season_manager.cairo` | `on_register_score`: reads `HustlerInstance.paper_burned` as rewarder burn input, mints PAPER reward, pushes EMA |
| `daily_shop` | `helpers/daily_shop.cairo` | Pure: `day_number(timestamp)`, `today_tier(timestamp)`, `template_for_slot(slot, tier)` |

### Mocks (src/_mocks/)

| Mock | Purpose |
|---|---|
| `ekubo_router_mock` | IRouter (swap=no-op) + IClear (default ClearImpl) for testing the swap-and-burn path |
| `paper_mock` | Legacy v0 mock, still compiled but unused by v2 tests |
| `vrf_provider_mock` | Returns tx hash as random; for katana dev |

### Dependencies (Scarb.toml)

| Dep | Version/Rev | Purpose |
|---|---|---|
| dojo | 1.8.0 | Framework |
| openzeppelin | 3.0.0 | ERC20/ERC721 |
| ekubo | rev cf2e95f | USDC↔PAPER swap router + clearer |
| arcade `bundle` | rev fc2e81c | Pack catalog + payment + referrals |
| arcade `achievement` | rev fc2e81c | Player progression (disabled until PR-5) |

`build-external-contracts` in Scarb.toml must declare bundle + ekubo model/event class hashes for `cairo_test` to find them at deploy time.

## Gear slot system

4 slots: Weapon (0), Clothes (1), Feet (2), Transport (3).

### Gear catalog (12 templates seeded by content::dojo_init)

| Slot | Tier 1 (id) | Tier 2 (id) | Tier 3 (id) |
|---|---|---|---|
| Weapon | Knife (1) | Pistol (2) | Uzi (3) |
| Clothes | Hoodie (4) | Leather (5) | Kevlar (6) |
| Feet | Sneakers (7) | Boots (8) | Trainers (9) |
| Transport | Bicycle (10) | Scooter (11) | Sports Car (12) |

Formula: `template_id = slot * 3 + tier`

### Per-tier starterpack loadouts (seeded by purchase::initialize)

| Tier | Weapon | Clothes | Feet | Transport |
|---|---|---|---|---|
| Naked (stake 1) | — | — | — | — |
| Street (stake 2) | Knife | Hoodie | Sneakers | Bicycle |
| Dealer (stake 3) | Pistol | Leather | Boots | Scooter |
| Kingpin (stake 4) | Uzi | Kevlar | Trainers | Sports Car |

### Marketplace daily shop

Each day: all 4 slots offer the same tier (day % 3 + 1). Each player can buy 1 per slot per day. Payment in PAPER with configurable burn/treasury split.

### Equip flow (NOT YET IMPLEMENTED)

Currently `HustlerInstance.gear_*` holds template ids baked at purchase time. `GearInstance` rows from the marketplace are wallet-owned but not yet bindable to a hustler. The equip flow needs:
- An `equip(hustler_id, gear_instance_id)` entrypoint (on marketplace or game contract)
- Modification of `create_game` to accept `GearInstance` ids instead of (or alongside) pre-baked template ids
- Decision: can pre-equipped pack gear be replaced? (Likely yes — convert pack gear to GearInstances at purchase time)

## Known gotchas for agents

1. **cairo_test `get_block_timestamp()` returns 0.** Bundle's `assert_does_exist` checks `created_at != 0` (not row existence). Tests must call `set_block_timestamp(1)` before any `bundle.register` call. See `v2_helper.cairo`.

2. **`build-external-contracts` required for cross-package models.** Adding a model from an external package (e.g. `bundle::models::index::m_Bundle`) to `TestResource::Model` in a test world requires the class hash to be declared in `Scarb.toml`'s `[[target.starknet-contract]]` `build-external-contracts` list. Missing entries cause `CLASS_HASH_NOT_FOUND` at spawn time.

3. **USDC == PAPER in tests.** The test fixture uses `paper` as the USDC stand-in. This means `balance_of(paper)` inside `on_issue` includes both the swap output AND the buyer's payment. The recorded `paper_burned` is `owed + pre_funded` in tests, not just the swap output. Production keeps USDC ≠ PAPER so this artifact doesn't exist there.

4. **World uuid starts at 0.** The first `world.dispatcher.uuid()` call returns 0. Don't use `id == 0` as a "not found" sentinel — use a boolean flag instead. See `DailyPurchase.purchased`.

5. **`bundle.register` must NOT be called from `dojo_init`.** The test world's `init_contract` re-entry context doesn't correctly propagate the Bundle model writes. Call `register` from a public admin entrypoint after spawn instead. This matches arcade's own bundle test pattern.

## Test coverage (93+ tests)

| File | Count | What it tests |
|---|---|---|
| `v2_paper` | 7 | PAPER ERC20 role enforcement, supply movement, admin grant/revoke |
| `v2_hustler` | 11 | Hustler ERC721 sequential ids, soulbound blocking, burn |
| `v2_purchase` | 9 | Bundle init, issue happy path, incremental ids, quantity, gear loadouts, PaymentConfig |
| `v2_purchase_swap` | 7 | Ekubo swap-and-burn, paper_burned recording, treasury share, gating |
| `v2_content` | 9 | Content seeding, template dispatchers, admin register/overwrite |
| `v2_marketplace` | 8 | Daily shop: buy, limit, treasury+burn split, rotation, quote |
| `v2_unit_daily_shop` | 8 | Pure day_number/today_tier/template_for_slot helpers |
| `v2_unit_*` (6 files) | ~34 | Model constructors, discount curve, rewarder math, payment config |

## Remaining work

### Contract-layer followups

- [ ] **Equip flow** — bind GearInstance to HustlerInstance slots before game start
- [ ] **PR-2c** — register_score integration tests (needs VRF mock + game spawn fixture)
- [ ] **Gear stat_boost wiring** — flow `GearTemplate.stat_boost` into combat / encounters
- [ ] **VRGDA dynamic pricing** — layer on top of the daily shop for demand-responsive pricing
- [ ] **PR-5** — v2 achievement system redesign

### Production / ops

- [ ] **Deploy script** — calls `set_payment_config` + `initialize` + `set_config` + role grants
- [ ] **Ekubo USDC↔PAPER pool** — must be deployed before v2 launch
- [ ] **Season transition** — needs a new trigger (the old `launder` is gone)

### Frontend

- [ ] **PR-3** — web rewrite: pack picker, `bundle.issue`, marketplace UI, reward chart
- [ ] **Close PR #427** — superseded by PR-1 series

## PR history on `v2`

| PR | # | Status | Summary |
|---|---|---|---|
| PR-0a | #431 | merged | Drop dope_types, delete laundromat |
| PR-0b | #432 | merged | Bump dojo 1.8.0 + OZ 3.0 + arcade rev + vendor VRF |
| PR-1a | #433 | merged | Rewarder math + EMA helpers |
| PR-1b | #434 | merged | PAPER v2 ERC20 + PaymentConfig model |
| PR-1c | #435 | merged | Hustler ERC721 + catalog models |
| PR-1d | #436 | merged | Purchase contract (PAPER-direct) |
| PR-1e | #438 | merged | Game loop rewrite + rewarder call site |
| PR-1f | #444 | merged | Embed arcade bundle component in purchase |
| PR-1f-followup | #445 | merged | Ekubo USDC→PAPER swap-and-burn in on_issue |
| PR-1g | #441 | merged | Delete v0 jackpot machinery |
| PR-2 | #439 | merged | Test harness fix + 51 tests |
| PR-2b | #440 | merged | Test consolidation + token integration tests |
| PR-4 | #442 | merged | Content seeding (4 hustler + 12 gear templates) |
| PR-4b | #443 | merged | Wire HustlerTemplate stats into Player::new |
| PR #1 | #446 | merged | Per-instance burn tracking, drop price_paper stopgap |
| PR #2 | #447 | merged | Ekubo router mock + swap integration tests |
| PR #3 | #448 | merged | Treasury distribution share in on_issue |
| PR #4 | #449 | merged | Per-tier gear loadouts on starterpacks |
| Marketplace | #450 | open | Daily gear shop with PAPER pricing + burn split |
