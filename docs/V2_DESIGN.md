# Dopewars v2 — Design & Migration Tracker

> Living document. Source of truth for the v2 work. Edit freely as decisions
> evolve. Last updated: 2026-04-07.

## Vision

V2 is a **fresh-world** rebuild of dopewars on the nums-style economic loop:

- **Mint-against-supply rewards** — no more jackpot pool. PAPER is minted to the
  player at game-end based on the supply-aware Rewarder curve.
- **Starterpacks as the entry point** — buying a pack mints a Hustler NFT that
  is playable for exactly one game.
- **Native Starknet hustlers** — no L1 Dope NFT migration. v2 hustlers are a
  fresh ERC721 minted by the purchase flow.
- **Same dopewars gameplay** — markets, drugs, encounters, locations, turns are
  preserved and refactored to work with the new character + economy.
- **No migration story** — v2 is a brand-new world with a brand-new PAPER token
  and a brand-new hustler collection. Existing balances are not carried over.

## Player loop

```
1. Connect wallet
2. Pick a starterpack from the catalog (4 tiers)
3. Pay USDC → Ekubo swaps USDC → PAPER → PAPER is burned
4. Hustler NFT is minted to wallet, Game record is created with the pack's
   gear loadout + multiplier baked in
5. Play the game (existing dopewars markets/drugs/encounters loop, unchanged)
6. register_score → reward computed via Rewarder against total PAPER supply
   → PAPER is minted directly to the player wallet
7. Hustler NFT stays in the wallet as a played-out collectible record
   (single-use — can't start another game)
```

## Catalog

### Hustler templates

| ID | Name    | Concept                                 |
|----|---------|-----------------------------------------|
| 1  | Naked   | Cheapest entry, no gear                 |
| 2  | Street  | Tier-1 gear in 4 slots                  |
| 3  | Dealer  | Tier-2 gear in 4 slots                  |
| 4  | Kingpin | Tier-3 gear in 4 slots                  |

### Starterpacks

| ID | Pack    | Price  | Multiplier | Hustler | Gear           |
|----|---------|--------|------------|---------|----------------|
| 1  | Naked   | $2.00  | 1×         | #1      | none           |
| 2  | Street  | $3.92  | 2×         | #2      | tier-1 × 4     |
| 3  | Dealer  | $5.82  | 3×         | #3      | tier-2 × 4     |
| 4  | Kingpin | $7.68  | 4×         | #4      | tier-3 × 4     |

Pricing formula: `stake * base_price * (1 - stake/100)` with `base_price = $2`.
Override any cell in the table by editing this doc and the pack registration
script — the formula is just the default.

## Architecture

### Cairo dependencies (after PR-0b)

| Dep                  | Version       | Source           | Purpose                              |
|----------------------|---------------|------------------|--------------------------------------|
| dojo                 | 1.8.0         | scarb registry   | Framework                            |
| openzeppelin         | 3.0.0         | scarb registry   | ERC20/ERC721 bases                   |
| ekubo                | rev cf2e95f   | github           | USDC↔PAPER swap                      |
| arcade `bundle`      | rev fc2e81c   | github           | Pack catalog + payment + referrals   |
| arcade `collection`  | rev fc2e81c   | github           | Hustler NFT minting                  |
| arcade `achievement` | rev fc2e81c   | github           | Player progression                   |
| cartridge_vrf        | git           | github           | Randomness                           |

Dropped in PR-0a: `dope_types` (path dep on `../dope-migration/cairo/types`).

### Models (Cairo)

- **Config** — Ekubo + USDC fields, EMA params, target supply, base price
- **Starterpack** — pack catalog (id, name, price, multiplier, hustler_template_id, gear ids per slot)
- **HustlerTemplate** — fixed hustler presets with base stats
- **GearTemplate** — gear items per slot per tier
- **Game** (refactored) — references hustler NFT id, gear ids, multiplier
- **Bundle** (arcade) — backs each Starterpack with payment + fees
- **Collection** (arcade) — backs Hustler NFTs as game session tokens

### Systems

- **setup** — wires bundle + collection components, registers 4 packs at init
- **purchase** (ported from nums) — USDC→PAPER swap+burn, multiplier calc
- **game** (refactored) — game loop unchanged, character loaded via Hustler NFT

### Token contracts

- **PAPER v2** — new ERC20, mintable by purchase/rewarder system, burnable
- **Hustler** — new ERC721 (via arcade Collection), one per pack purchase

## What dies in v2

- `systems/laundromat.cairo` (entire file)
- `utils/payout_items.cairo` (only used by laundromat)
- `dope_types` dependency (5 files affected)
- `_mocks/paper_mock.cairo` faucet flow (replaced with proper PAPER v2 in PR-1)
- L1-keyed achievements (Tasks::OG, FULL_LATE/MID/EARLY, GEAR_FROM, ELEGANT)
- Treasury / supercharge / launder reward
- Current hustler/gear selection UX (replaced by pack picker)
- `IRyo::laundromat()` getter

## What survives

- Rewarder math + EMA tracking + target supply curve (already ported on `feat/nums-reward-curve`)
- Season concept — but **stripped to a leaderboard-only wrapper** in PR-1e (no `paper_balance` jackpot, no `paper_fee` / `treasury_fee_pct` knobs — those moved to `PaymentConfig`). Keeps `version`, `season_duration`, `season_time_limit`, `next_version_timestamp`, `high_score`, plus optional snapshot fields like `paper_minted`, `games_played`, `avg_score_at_start` for end-of-season UI.
- Existing dopewars game loop (markets, drugs, encounters, locations, turns)
- VRF (cartridge_vrf) for randomness
- `achievement` arcade integration (with refreshed task list)
- Sorted leaderboard for season rankings

## PR sequence on `v2`

| PR    | Status      | Scope                                                                                                                                                                                                                                                                                                                       |
|-------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PR-0a | **merged** (#431) | Add this design doc. Drop `dope_types` from `Scarb.toml`. Add `src/_stubs/dope_stubs.cairo` with type stubs. Delete `systems/laundromat.cairo` + `utils/payout_items.cairo`. Update imports in `models/game.cairo`, `systems/game.cairo`, `events.cairo`. Remove laundromat references from `ryo.cairo`, `paper_mock.cairo`. |
| PR-0b | **merged** (#432) | Bump `dojo 1.7.1 → 1.8.0`, `openzeppelin 2.0.0 → 3.0.0`, `starknet 2.12.2 → 2.13.1`, `cairo-version 2.12.2 → 2.13.1`, arcade dep `branch=dojo_1.7.1` → `rev=fc2e81c`. Bump `.tool-versions`. Vendor VRF interface internally. **Disable the achievement integration entirely** (re-enabled in PR-5). |
| PR-1a | **merged** (#433) | Cherry-pick rewarder math from #427: `helpers::rewarder` (pure math + Cairo unit tests), EMA fields + `get_average_score` / `push_score` on `RyoConfig`, TS port + 17 vitest cases. No call sites yet. |
| PR-1b | **merged** (#434) | New mintable/burnable PAPER v2 (`tokens::paper`, OZ ERC20 + AccessControl + SRC5, MINTER_ROLE pattern). New `models::payment_config` (USDC quote + Ekubo router/positions/pool params + base_price + burn/treasury split). Self-contained — no callers. |
| PR-1c | **merged** (#435) | Hustler ERC721 (`tokens::hustler`, OZ-only — no arcade Collection dep, no graffiti/alexandria). Catalog models: `Starterpack`, `HustlerTemplate`, `GearTemplate`, `HustlerInstance`. 4 slots open on every hustler regardless of pack tier. |
| PR-1d | **merged** (#436) | Purchase contract (`systems::purchase`). PAPER as entry currency: buyer transfers PAPER, contract burns it, mints Hustler, writes HustlerInstance. `dojo_init` seeds the 4 packs using the discount formula. |
| PR-1e | **merged** (#438) | Game-loop rewrite. Drop the v0 `TokenId` enum (GuestLoot/Loot/Hustler L1 branches) and the `_stubs` crate. `create_game` takes a `hustler_token_id: u64`, validates ownership via the Hustler ERC721, reads `HustlerInstance` to seed the gear loadout, marks the hustler used. `on_game_over` calls `season_manager::on_register_score` which computes `Rewarder::amount` against the live `paper.total_supply()`, mints PAPER to the player via `IPaperToken::reward`, pushes the score into the EMA tracker, updates the season high score, and writes the final score back to the HustlerInstance. **First call site for the rewarder.** Game model gains `reward: u128`. Event payloads (GameCreated/GameOver/NewHighScore) drop `token_id: TokenId` for `hustler_token_id: u64`; GameOver gains `reward`. Strip-down of the obsolete RyoConfig fields (paper_fee / paper_reward_launderer / treasury_fee_pct / treasury_balance) and the Season jackpot fields is deferred to PR-1g cleanup. |
| PR-1f | not started | Wrap PR-1d's purchase with Ekubo USDC↔PAPER swap so buyers can pay in stable USDC. Adds the ekubo dep to `Scarb.toml`, swaps the burn-source from `transfer_from(buyer, this, price)` to `swap(usdc, paper) → burn`. Same `IPurchase::buy` interface. |
| PR-1g | **merged** (#441) | Cleanup. Strip the v0 jackpot/treasury fields that v2's mint-against-supply economy made dead. `RyoConfig`: drop `paper_fee`, `paper_reward_launderer`, `treasury_fee_pct`, `treasury_balance`. `Season`: drop `paper_fee`, `treasury_fee_pct`, `paper_balance`. `Game`: drop `claimed`, `claimable`, `position`. Delete `utils/sorted_list.cairo` + `utils/payout_structure.cairo` (the v0 leaderboard payout machinery — entirely unreachable in v2). Update callers in `systems/ryo.cairo` (drop `paper_fee` from interface + getter + `update_ryo_config`), `systems/devtools.cairo` (drop sorted_list usage in `create_fake_game`), `store.cairo` (drop sorted_list helpers + import), `lib.cairo` (drop the two module declarations). Net: +30 / -1179 lines. **Cairo-only — TS web client still references the dropped fields and lands in PR-3.** |
| PR-2  | **merged** (#439) | Test harness fix (add `cairo_test` + `dojo_cairo_test` dev-deps so `#[test]` works at all) + 51 tests: model unit tests for Starterpack/HustlerInstance/HustlerTemplate/GearTemplate/PaymentConfig, discount-curve unit tests, rewarder unit tests, **6 dojo integration tests** for `purchase` (dojo_init seeds catalog, buy() happy path with ownership + supply burn assertions, sequential token ids, disabled pack rejection, set_pack_enabled round-trip). |
| PR-2b | **merged** (#440) | Test consolidation + token-side integration coverage. Move the inline unit tests out of production files into `src/tests/v2_unit_*.cairo` so all v2 tests live in one tree. Add `v2_paper.cairo` (7 PAPER integration tests: dojo_init admin grant, MINTER_ROLE enforcement on `reward`, burn supply movement, admin grant/revoke round-trip + revoked-minter rejection) and `v2_hustler.cairo` (11 Hustler integration tests: dojo_init admin grant, sequential token ids, MINTER_ROLE enforcement on mint and burn, soulbound transfer + safe_transfer blocking, burn-clears-soulbound). |
| PR-2c | not started | `register_score` integration coverage. Requires expanding `v2_helper` to spawn the full game contract + Season + RyoConfig + GameConfig + a VRF mock — bigger fixture lift than PR-2b's scope. Targets the second rewarder call site end-to-end: purchase → create_game → end_game → reward minted to player + EMA pushed + season high_score updated. |
| PR-3  | not started | Web: `useConfig`, `useStarterpacks`, `useMultiplier`, reward curve chart, pack picker UI. |
| PR-4  | **merged** (#442) | Content seeding. New `systems::content` contract whose `dojo_init` writes the 4 canonical `HustlerTemplate` rows (Naked / Street / Dealer / Kingpin with a stepped stat curve) and the 12 canonical `GearTemplate` rows (3 weapons / 3 clothes / 3 feet / 3 transport across tiers 1-3). Adds admin `register_hustler_template` / `register_gear_template` entrypoints so ops can rebalance without redeploying. Stat consumers were left for follow-ups. 9 new integration tests in `v2_content.cairo`. |
| PR-4b | **in progress** | Wire `HustlerTemplate` stats into the run-time player. Adds `HustlerTemplate::apply_to(ref game_config)` which adds `template.starting_cash` on top of the season's `GameConfig.cash` and overrides `game_config.health` if the template's value is non-zero. `create_game` reads the template via the buyer's `HustlerInstance.hustler_template_id` and applies it before constructing `Player`. Per-game mutation is local — the season's `GameConfig` row stays untouched. Gear `stat_boost` (combat / encounters) is still TODO — that wiring is wider in scope and lands separately. 6 new unit tests on `apply_to` covering the canonical Naked/Street/Kingpin templates plus edge cases (health=0, cash=0, idempotency). |
| PR-5  | not started | **v2 achievement system.** Re-design the task catalog and re-enable progression tracking via the new arcade component API. Uncomment the `bushido_store.progress(...)` call sites. |

## Open questions

- [x] **Hustler stat schema** — `health`, `starting_cash`, `attack`, `defense`, `cargo`. PR-4 seeded the four templates with a stepped curve (Naked 90/0/10/10/10 → Kingpin 100/3000/30/25/25). `starting_cash` is intended as additive to the season's `GameConfig.cash` once a follow-up PR wires templates into `Player::new`. Values are conservative — the catalog can be rebalanced in place via `content::register_hustler_template`.
- [ ] **Gear effects on gameplay** — current dopewars has gear-tier checks scattered through trading/encounters logic. How do gear stats translate in v2?
- [ ] **Refreshed achievement task list** — the L1-keyed ones are gone; v2 needs replacements
- [ ] **Hustler NFT metadata + art** — placeholder OK for engineering, real art is a separate workstream
- [ ] **Ekubo USDC↔PAPER pool** — needs to be deployed before v2 launch (depends on PR-1 PAPER v2 contract address)
- [ ] **Free pack at launch?** — defaulting to no; can add a Twitter-gated pack later via a new pack id
- [ ] **Season transition mechanics** — current dopewars uses `launder` to roll seasons; with no laundromat, need a new trigger (cron? anyone-can-call after `next_version_timestamp`?). Whatever lands also needs to (a) snapshot the leaderboard, (b) optionally reset `RyoConfig.average_*` so the new season recalibrates the EMA from scratch.
- [ ] **Pack pricing for tiers 2/3/4** — defaulting to nums formula, override with concrete numbers if there's a target

## Decisions log

- **2026-04-06** — PR #427 (`feat/nums-reward-curve`) targets `v2` instead of `main`
- **2026-04-06** — Branched `v2` off `main`@07a2ae5f as the v2 integration branch
- **2026-04-06** — Added Cairo-parity tests for the TS rewarder port (PR #427 commit `a8a2ea48`)
- **2026-04-07** — Confirmed mint-against-supply economic model (drop laundromat-as-jackpot)
- **2026-04-07** — Confirmed fresh deployment — new PAPER token, new world, no migration
- **2026-04-07** — Confirmed 4 starterpacks (Naked $2 → Kingpin), hustlers as ERC721 NFTs, single-use per game
- **2026-04-07** — Drop `dope_types` entirely; v2 hustlers are native Starknet (no L1 lineage)
- **2026-04-07** — Split dojo bump out of PR-0 into its own PR-0b for bisectability
- **2026-04-07** — PR #427 will be closed without merging — superseded by PR-1; tests will be cherry-picked
- **2026-04-07** — PR-0a merged as cartridge-gg/dopewars#431 (commit `53619d91`)
- **2026-04-07** — PR-0b: vendor VRF interface internally (nums uses the same approach) — `cartridge_vrf` package is pinned to OZ 2.x across all branches/tags, blocking the upgrade
- **2026-04-07** — PR-0b: disable achievement integration in this PR (don't try to migrate the API). Reasons: (a) arcade `Store::progress` moved to a component method whose Event auto-Into impl conflicts with `ContractAddress::Into<felt252>`, requiring either a vendored fork of arcade's progress logic or a real architectural refactor of the helper modules; (b) the v2 plan was already removing the L1-keyed achievement tasks; (c) re-adding a v2-shaped achievement system is now tracked as PR-5
- **2026-04-07** — PR-1a merged as cartridge-gg/dopewars#433 (rewarder math + EMA helpers on `RyoConfig`, no call sites yet)
- **2026-04-07** — `Season` model survives v2 as a **leaderboard-only wrapper** (option 2 of three). Drop `paper_balance` / `paper_fee` / `treasury_fee_pct` (those become `PaymentConfig` fields). Keep `version`, `season_duration`, `season_time_limit`, `next_version_timestamp`, `high_score`. Lands in PR-1e alongside the `season_manager` rewrite — Season struct is left untouched until then.
- **2026-04-07** — PR-1b merged as cartridge-gg/dopewars#434 (PAPER v2 ERC20 + `PaymentConfig` model, no call sites yet)
- **2026-04-07** — PR-1c merged as cartridge-gg/dopewars#435 (Hustler ERC721 + Starterpack/HustlerTemplate/GearTemplate/HustlerInstance models, OZ-only — no arcade Collection dep). Slot decision: stick with the existing 4 ItemSlot types (Weapon/Clothes/Feet/Transport), all four slots open on every hustler regardless of pack tier — packs differ by which gear is **pre-loaded**, not by slot count. Naked ships empty so the buyer can fill slots from a future marketplace.
- **2026-04-07** — Add Accessory as a 5th slot was rejected: dopewars currently has **zero Accessory items** in `libraries/dopewars_items.cairo` (slots 3 and 4 are `panic!("invalid slot")` placeholders inherited from the L1 Dope Wars Loot schema). Adding Accessory would be a content workstream (10–15 new items + balancing + art), not a schema tweak — out of scope for PR-1c.
- **2026-04-07** — **PR-1d split into PR-1d (PAPER-direct purchase) and PR-1f (Ekubo USDC swap layer).** Reason: porting nums' full purchase contract pulls in arcade Bundle, Ekubo router/clearer, Vault component, and Leaderboard component all at once — not the small-additive rhythm the v2 stack has been on. PR-1d ships a working buy-pack-mint-hustler flow using PAPER as the entry currency (real burn → real supply pressure → rewarder works in PR-1e). PR-1f wraps it with USDC↔PAPER Ekubo swap so buyers don't need to hold PAPER directly. Same `IPurchase::buy` interface, swap-only implementation change.
- **2026-04-07** — PR-1d merged as cartridge-gg/dopewars#436. PR-1e merged as cartridge-gg/dopewars#438 — closes the rewarder loop end-to-end at compile level (purchase burns PAPER → register_score reads `paper.total_supply()` and mints reward via supply-aware curve). `_stubs/dope_stubs.cairo` deleted in the same PR.
- **2026-04-07** — PR-2 merged as cartridge-gg/dopewars#439 (51 tests). The blocker fix was adding `cairo_test = "2.13.1"` + `dojo_cairo_test = "1.8.0"` to `[dev-dependencies]` so `#[test]` worked at all. dojo's `read_model` returns a default-constructed row with the key populated for missing rows, so `Purchase::buy` collapses "missing pack" and "disabled pack" into the same `PURCHASE_PACK_DISABLED` error — there's no way to distinguish them without a sentinel field, and no user-facing reason to.
- **2026-04-07** — **PR-2 / PR-2b / PR-2c test split.** PR-2 lands the harness fix + the broad test surface (51 tests, 6 of them dojo integration tests for `purchase`). PR-2b consolidates all v2 tests under `src/tests/` (move inline `#[cfg(test)]` blocks out of production files into `v2_unit_*.cairo`) and adds 18 token-side integration tests: 7 for PAPER (role enforcement, supply movement, admin grant/revoke round-trip), 11 for Hustler (sequential ids, role enforcement on mint/burn, soulbound blocking on both transfer paths, burn clears soulbound). 68 total. PR-2c is deferred — `register_score` integration testing requires spawning the full game contract with VRF mock + Season + RyoConfig + GameConfig fixtures, which is bigger than PR-2b's scope. Rewarder math is already covered by the unit tests in `v2_unit_rewarder`; PR-2c will exercise the *call site* end-to-end.
- **2026-04-07** — **PR-1g scope widened from "drop fields" to "delete the v0 jackpot machinery."** Once `RyoConfig.paper_fee` / `Season.paper_balance` are gone, `utils/sorted_list.cairo` (the v0 leaderboard payout) won't compile — and the rest of the file is dead code in v2 anyway since the supply-aware rewarder mints rewards directly in `season_manager::on_register_score` instead of distributing a season-wide pot at the end. Same for `utils/payout_structure.cairo` (only used by sorted_list) and the `claimed` / `claimable` / `position` fields on `Game` (only written by sorted_list). PR-1g deletes the whole machinery in one pass: `+30 / -1179` lines. The TS web client still references the dropped fields and is left to PR-3. Merged as cartridge-gg/dopewars#441.
- **2026-04-08** — PR-2b merged as cartridge-gg/dopewars#440 (test consolidation + 18 token-side integration tests; 50 tests total after PR-1g's payout_structure unit tests went away).
- **2026-04-08** — **PR-4 ships content seeding via a separate `systems::content` contract**, not by extending `purchase::dojo_init`. Reasons: (a) separation of concerns — purchase deals with the buy flow, content holds the catalog; (b) lets ops re-seed content via `register_hustler_template` / `register_gear_template` without touching purchase; (c) the production deploy script can grant content writer access to just the catalog models, not the full namespace. Existing `purchase::dojo_init` still ships starterpacks with `gear_* = 0` — re-linking packs to the new gear ids is a follow-up so PR-4 stays purely additive (no behavioral change to the buy flow). Merged as cartridge-gg/dopewars#442.
- **2026-04-08** — **PR-4b template-stat semantics**: `starting_cash` is **additive** on top of the season's `GameConfig.cash` (so the season's "Broke / Average / Rich" cash mode still matters), `health` is an **override** if non-zero (templates intentionally pick a hustler-archetype-shaped health value). Mutation happens on a local copy of `GameConfig` in `create_game` — the season-wide config row is never written back, so two concurrent games with different templates don't fight over the row. attack/defense/cargo on `HustlerTemplate` are deliberately NOT applied in PR-4b — those flow through combat / encounters via a separate path that needs its own design pass (open question).
- **2026-04-08** — **PR-1f deferred.** Investigation of the cartridge-gg/nums codebase showed that nums **does not** use Ekubo for swap-on-purchase — their treasury uses Ekubo positions for fee collection only. The "USDC swap on purchase" pattern would have to be designed from scratch (slippage policy, mock router for tests, deployment dependency on a real USDC↔PAPER pool). That's real architectural work that needs user input before committing to a design — bouncing autonomous execution would burn time on a design the user might want different. PR-1f is queued; v2 launches with PAPER as entry currency and USDC purchasing can land later as a wrapper or as a UI-side swap-then-buy flow.
