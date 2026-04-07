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
| PR-0b | **in progress** | Bump `dojo 1.7.1 → 1.8.0`, `openzeppelin 2.0.0 → 3.0.0`, `starknet 2.12.2 → 2.13.1`, `cairo-version 2.12.2 → 2.13.1`, arcade dep `branch=dojo_1.7.1` → `rev=fc2e81c`. Bump `.tool-versions` (scarb 2.13.1, sozo 1.8.0, katana 1.8.0). Vendor VRF interface internally (`src/interfaces/vrf.cairo`) — `cartridge_vrf` is pinned to OZ 2.x and blocks the upgrade. **Disable the achievement integration entirely** because arcade migrated `Store::progress` to a component-based API that conflicts with `ContractAddress::Into<felt252>` via auto-generated event Into impls; the v2 plan was already removing most of the existing achievements anyway. Delete `src/achievements/achievements_v1.cairo`. New `_mocks/vrf_provider_mock.cairo` mirrors nums' hash-based stub. |
| PR-1  | not started | New mintable/burnable PAPER v2. Add Starterpack/HustlerTemplate/GearTemplate/Config models. Wire arcade bundle + collection. Port nums purchase.cairo → dopewars purchase.cairo. Refactor Game model + register_score to mint reward via Rewarder against total PAPER supply. Delete the `_stubs` crate.                     |
| PR-2  | not started | Cairo tests: cherry-pick rewarder parity tests from PR #427. New tests for Starterpack registration, Purchase execution (with mock USDC + mock Ekubo), Hustler minting, register_score reward minting.                                                                                                                      |
| PR-3  | not started | Web: `useConfig`, `useStarterpacks`, `useMultiplier` (live Ekubo quote), `ChartHelper`, reward curve chart component, pack picker UI. Wire on home + game-start.                                                                                                                                                             |
| PR-4  | not started | Content: 4 hustler templates + 12 gear templates (data + initial art). Initial pack catalog seeding script.                                                                                                                                                                                                                 |
| PR-5  | not started | **v2 achievement system.** Re-design the task catalog (drop the L1-keyed ones, refresh the rest) and re-enable progression tracking via the new arcade component API. Uncomment the `bushido_store.progress(...)` call sites in `systems/helpers/{shopping,trading,traveling}.cairo` and `systems/game.cairo`. |

## Open questions

- [ ] **Hustler stat schema** — proposing `health`, `cash`, `attack`, `defense`, `cargo` as base stats. What should the four templates' values look like?
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
