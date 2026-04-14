# Dopewars v2 — Design & Architecture

> Living document. Source of truth for the v2 contract + client layer.
> Last updated: 2026-04-14.

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
scarb test           # run 98+ tests (unit + integration)
scarb fmt --check    # linter
```

**Deploy** — everything is wired through `dojo_init`, no post-deploy script needed:

```bash
sozo migrate --profile sepolia   # deploys world + inits all contracts
```

`dojo_init` handles:
- `paper` + `hustler`: grant `DEFAULT_ADMIN_ROLE` to admin, grant `MINTER_ROLE`
  to game/purchase contracts via DNS lookup
- `purchase`: write PaymentConfig (Ekubo params, pricing), register 4 starterpack
  bundles with proper JSON metadata for the Cartridge Controller UI
- `marketplace`: write MarketConfig (per-tier PAPER prices + burn split)
- `content`: seed 72 GearTemplates + 4 HustlerTemplates

Init ordering is enforced via `order_inits` in the dojo profile toml.

## Deployed worlds

| Network | World Address | Seed | Torii Slot |
|---|---|---|---|
| Sepolia | `0x0124642dbf23403fdd2dd5daff592f1529d5d5e88115c5b04012dfd1d7260961` | `dopeseed_v3` | `dopewars-v2-sepolia` |

### Namespace

`dopewars` (changed from `dopewars_v0` in the v2 migration).

### Key addresses (sepolia)

| | Address |
|---|---|
| USDC (payment token) | `0x053b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080` |
| VRF Provider | `0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f` |
| Ekubo Router | `0x050d4da9f66589eadaa1d5e31cf73b08ac1a67c8b4dcd88e6fd4fe501c628af2` |
| Ekubo Positions | `0x06a2aee84bb0ed5dded4384ddd0e40e9c1372b818668375ab8e3ec08807417e5` |
| Ekubo Extension | `0x073ec792c33b52d5f96940c2860d512b3884f2127d25e023eb9d44a678e4b971` |

### Torii

Config: `torii_v2_sepolia.toml`. Create/recreate:

```bash
~/.slot/bin/slot d delete dopewars-v2-sepolia torii
~/.slot/bin/slot d create dopewars-v2-sepolia torii --version v1.8.6 --config ./torii_v2_sepolia.toml
```

### Redeploying

When contract code changes require a fresh world:

1. Bump the seed in `dojo_sepolia.toml` (e.g. `dopeseed_v4`)
2. `sozo migrate --profile sepolia`
3. Update `torii_v2_sepolia.toml` with new world address
4. Copy manifest with ABIs: `python3 -c "..."` (see scripts or run `scarb run copy_manifest sepolia`)
5. Regenerate GraphQL types: `cd web && NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.cartridge.gg/x/dopewars-v2-sepolia/torii/graphql pnpm run gen:dojo`
6. Delete + recreate torii slot

## Player loop

```
1. Connect wallet (Cartridge Controller)
2. Pick a starterpack (4 tiers: Junkie/Street/Dealer/Kingpin)
   → Controller opens bundle purchase UI via openBundle()
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
| **purchase** | `systems/purchase.cairo` | Embeds arcade `BundleComponent`. `dojo_init` accepts full PaymentConfig + registers 4 bundles with proper JSON metadata (uses `BundleMetadataTrait`). Lists PAPER in `additional_payment_tokens` for controller UI. Resolves `paper_mock` from DNS when `usdc=0x0`. `BundleTrait::on_issue` callback: Ekubo USDC→PAPER swap-and-burn, treasury share, mint Hustler NFT, write HustlerInstance. Admin: `set_payment_config`, `initialize`. |
| **marketplace** | `systems/marketplace.cairo` | Daily gear shop. `dojo_init` accepts tier prices + burn %. 4 items/day (one per slot via poseidon hash). `IMarketplace::buy(slot)` pulls PAPER, burns %, sends remainder to treasury, mints `GearInstance`. `IEquip::equip` for single-use gear binding. Admin: `set_config`. |
| **content** | `systems/content.cairo` | Seeds 4 `HustlerTemplate` + 72 `GearTemplate` rows in `dojo_init`. Admin: `register_hustler_template`, `register_gear_template`. |
| **game** | `systems/game.cairo` | Game loop. `create_game(game_mode, player_name, multiplier, hustler_token_id)` — no tokenIdType, no PAPER fee on start. Validates hustler ownership, reads gear loadout, marks hustler used. |
| **ryo** | `systems/ryo.cairo` | Season + RyoConfig management. |

### Token contracts (src/tokens/)

| Token | File | Purpose |
|---|---|---|
| **PAPER v2** | `tokens/paper.cairo` | OZ ERC20 + AccessControl. `dojo_init(admin)` grants DEFAULT_ADMIN_ROLE + MINTER_ROLE to game contract via DNS. `reward(recipient, amount)` (MINTER_ROLE), `burn(amount)`. |
| **Hustler** | `tokens/hustler.cairo` | OZ ERC721 + AccessControl. `dojo_init(admin)` grants DEFAULT_ADMIN_ROLE + MINTER_ROLE to purchase contract via DNS. `mint(to, soulbound) -> u64`, `burn(token_id)`. Soulbound blocks transfer. |

### Mocks (src/_mocks/)

| Mock | Purpose |
|---|---|
| `paper_mock` | Dev ERC20 with `faucet()`, `faucetTo(recipient)`, `mint(recipient, amount)` for testing. Used as USDC stand-in when `usdc=0x0`. |
| `ekubo_router_mock` | IRouter (swap=no-op) + IClear for testing the swap-and-burn path |
| `vrf_provider_mock` | Returns tx hash as random; for katana dev |

### Models (src/models/)

| Model | Key | Purpose |
|---|---|---|
| `PaymentConfig` | singleton (key=0) | USDC address, Ekubo router/pool params, base_price, burn_percentage, treasury_percentage, treasury_address |
| `Starterpack` | `bundle_id: u32` | Per-bundle catalog: hustler_template_id, gear_weapon/clothes/feet/transport, stake_multiplier |
| `HustlerInstance` | `token_id: u64` | Per-NFT state: bundle_id, template_id, gear loadout, paper_burned (actual Ekubo swap result), used flag, game_id, final_score |
| `HustlerTemplate` | `id: u8` | Preset stats: health, starting_cash, attack, defense, cargo |
| `GearTemplate` | `id: u8` | Gear catalog: name, slot (0-3), tier (1-3), stat_boost |
| `GearInstance` | `id: u32` | Owned gear unit from marketplace: owner, template_id, purchased_day, equipped_to (0=inventory, non-zero=consumed) |
| `MarketConfig` | singleton (key=0) | Per-tier PAPER prices, burn_percentage |
| `DailyPurchase` | `(player, slot, day)` | One-per-slot-per-day limit. `purchased: bool` flag. |
| `RyoConfig` | singleton | Season version, target_supply, max_score, EMA params |
| `Season` | `version: u16` | high_score, duration, timestamps |
| `Game` | `(game_id, player_id)` | Per-run state: hustler_token_id, multiplier, reward, final_score, registered |

### Dependencies (Scarb.toml)

| Dep | Version/Rev | Purpose |
|---|---|---|
| dojo | 1.8.0 | Framework |
| openzeppelin | 3.0.0 | ERC20/ERC721 |
| ekubo | rev cf2e95f | USDC↔PAPER swap router + clearer |
| arcade `bundle` | rev fc2e81c | Pack catalog + payment + referrals + metadata JSON |
| arcade `achievement` | rev fc2e81c | Player progression (disabled until PR-5) |

## Starterpack design

All four pack tiers share **identical stats** (health 90, cash 0, attack/defense/cargo 10) and the **same starter junk gear** (Razor Blade / Shirtless / Barefoot / Rollerblades). The only differentiator is the reward **multiplier** (1x/2x/3x/4x). No pay-to-win — gear progression is 100% earned via marketplace + in-game shop.

Bundle metadata uses `BundleMetadataTrait::new().jsonify()` from the arcade crate to produce proper JSON for the Cartridge Controller purchase UI. PAPER is listed in `additional_payment_tokens` so the controller shows "pay with PAPER or USDC".

Pricing follows the nums discount curve: `price = stake × base_price × (100 - stake) / 100`.

## Gear slot system

4 slots: Weapon (0), Clothes (1), Feet (2), Transport (3).

72 templates from the full original dopewars catalog (18 weapons, 20 clothes, 17 feet, 17 transport).

### Equip flow

`IEquip::equip(hustler_token_id, gear_instance_id)` — **single-use**: once equipped, the gear is consumed. Gear dies with the hustler after one game run.

### Marketplace daily shop

Each day: 4 random items (one per slot via `poseidon_hash(day, slot) % items_in_slot`). Each player can buy 1 per slot per day. Payment in PAPER with configurable burn/treasury split.

## Client (web/)

### Stack

Next.js 16 + Chakra UI + MobX + Dojo torii subscriptions.

### Key config

| Setting | Value |
|---|---|
| Namespace | `DW_NS = "dopewars"` |
| GraphQL NS | `DW_GRAPHQL_MODEL_NS = "dopewars"` |
| Controller | `@cartridge/controller@0.13.11`, `@cartridge/connector@0.13.11` |
| Torii URL | `https://api.cartridge.gg/x/dopewars-v2-sepolia/torii/graphql` |

### Pages

| Route | Purpose |
|---|---|
| `/` | Home — leaderboard + "Play Now" button |
| `/game/new` | Starterpack picker — select tier, buy via `controller.controller.openBundle()` |
| `/game/[gameModeName]` | Legacy game creation (redirects to `/game/new`) |
| `/marketplace` | Daily gear shop + inventory (not yet built) |

### Regenerating GraphQL types

```bash
cd web
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.cartridge.gg/x/dopewars-v2-sepolia/torii/graphql pnpm run gen:dojo
```

### Key changes from v0 client

- Removed all `laundromat`, `DopeLoot`, `DopeHustlers`, `DopeGear`, `DopeLootClaim` references
- Removed `SortedList`, `claimable`, `claimed`, `position`, `token_id` union from Game model
- Added `hustler_token_id`, `reward`, `registered` to Game model
- Season gating removed — Play Now always visible
- SQL queries updated for v2 column names
- PAPER faucet button in drawer menu

## Known gotchas

1. **cairo_test `get_block_timestamp()` returns 0.** Bundle's `assert_does_exist` checks `created_at != 0`. Tests must call `set_block_timestamp(1)` before any `bundle.register` call.

2. **`build-external-contracts` required for cross-package models.** Missing entries cause `CLASS_HASH_NOT_FOUND` at spawn time.

3. **USDC == PAPER in tests.** The test fixture uses `paper` as the USDC stand-in.

4. **World uuid starts at 0.** Don't use `id == 0` as "not found" sentinel.

5. **Manifest needs inline ABIs.** sozo 1.8 generates manifests with ABIs in a separate array. The `DojoProvider` constructor needs them inline per contract. Run the Python script to merge them, or use `--manifest-abi-format per_contract`.

6. **`order_inits` required.** paper + hustler must init before purchase (DNS lookups in dojo_init). All profiles must specify `order_inits`.

## Test coverage (98 tests)

| File | Count | What it tests |
|---|---|---|
| `v2_paper` | 7 | PAPER ERC20 role enforcement, supply movement, admin grant/revoke |
| `v2_hustler` | 11 | Hustler ERC721 sequential ids, soulbound blocking, burn |
| `v2_purchase` | 9 | Bundle init, issue happy path, incremental ids, quantity, gear loadouts, PaymentConfig |
| `v2_purchase_swap` | 7 | Ekubo swap-and-burn, paper_burned recording, treasury share, gating |
| `v2_content` | 9 | Content seeding, template dispatchers, admin register/overwrite |
| `v2_marketplace` | 8 | Daily shop: buy, limit, treasury+burn split, rotation, quote |
| `v2_equip` | 5 | Equip: happy path, consumed gear, used hustler, wrong owner, pack overwrite |
| `v2_unit_daily_shop` | 8 | Pure day_number/today_tier/template_for_slot helpers |
| `v2_unit_*` (6 files) | ~34 | Model constructors, discount curve, rewarder math, payment config |

## Remaining work

### Contract-layer

- [ ] Gear stat_boost wiring into combat/encounters
- [ ] Upgrade system (4-level progression)
- [ ] register_score integration tests (needs VRF mock)
- [ ] Achievement system redesign (PR-5)
- [ ] Ekubo USDC↔PAPER pool deployment (before mainnet launch)

### Frontend

- [ ] Marketplace UI page (`/marketplace`) — daily shop + inventory + equip
- [ ] Full game flow testing (buy pack → play → register score → earn rewards)
- [ ] Game creation flow after pack purchase (select hustler → name → play)

### Ops

- [ ] Mainnet deployment
- [ ] Season transition mechanism (old `launder` is gone)

## PR history

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
| #446 | merged | Per-instance burn tracking |
| #447 | merged | Ekubo router mock + swap integration tests |
| #448 | merged | Treasury distribution share in on_issue |
| #449 | merged | Per-tier gear loadouts on starterpacks |
| #450 | merged | Daily gear marketplace with PAPER pricing |
| #452 | merged | Port full 72-item gear catalog |
| #453 | merged | Rename Naked to Junkie, equip tier-3 junk gear |
| #454 | merged | Flatten packs — same stats/gear, only multiplier differs |
| #455 | merged | Single-use equip flow |
| #458 | merged | Namespace dopewars_v0 → dopewars, dojo profiles for v2 |
| #459 | merged | Wire full init into dojo_init, role grants via DNS |
| #460 | merged | Client: sepolia config, torii, GraphQL regen, starterpack UI, controller upgrade |
