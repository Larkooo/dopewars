# Dope Wars Game Design Document

## Top Line
- Real-money skill game. Pay an entry fee, build your hustler, navigate encounters, get paid on performance.
- Daily Fantasy Sports meets roguelike builds, onchain. The meta changes every week and never gets solved.
- Three build archetypes: Fighter, Runner, Finesse. Your equipment choices determine how you play encounters.
- 7 randomized season dimensions create 2,187 possible configurations. Every season is a new slate.
- High stakes, high reward. USD entry, dynamic per-game PAPER rewards, 70% buy-back-and-burn. Fully onchain and verifiably fair.

## What This Game Is (And Isn't)

Dope Wars is an onchain adaptation of Drug Wars, but the game has evolved past its source material. The drug trading is the economic engine. The encounters are the game. Your build decisions determine your payout, and the meta never gets solved.

**vs. Original Drug Wars:** Adds encounter meta, real stakes, equipment builds, seasonal variety. The original was pure arbitrage. This is arbitrage funding a skill-based combat game.

**vs. Onchain Casinos (Rollbit, etc.):** Skill-based, not house-edge gambling. Every outcome traces to player decisions, not RNG. Encounters have three choices (Fight/Run/Pay), each with different expected value depending on your build. The house doesn't win by default.

**vs. DFS (FanDuel/DraftKings):** Similar structure: pay entry, make constrained skill decisions, get rewarded based on performance. Different payout model: Dope Wars rewards every player based on individual performance, not relative ranking. No zero-sum competition for a jackpot.

**vs. Roguelikes (Slay the Spire, Balatro):** Similar build diversity and adaptation to randomized conditions. But real money at stake. Your performance directly determines your PAPER reward through a dynamic reward function.

**vs. Other Onchain Games (Dark Forest, Loot Survivor):** Shares provable fairness and composability. Adds accessible session length (15-21 turns, minutes not hours) and real-money payout structure that rewards mastery.

## The Entry

Players enter with a **USD entry fee**.

- **Game Modes:** Ranked (USD entry, earns PAPER rewards), Noob (free, no rewards), Warrior (always encounters, 2x reputation).
- **Identity:** GuestLootId (F2P, 8 deterministic per season), LootId (DopeLoot NFT), HustlerId (DopeHustlers NFT).
- **Fee distribution:** 70% used to purchase PAPER off the AMM and **burn** it (deflationary pressure). 30% goes to the developer.
- **Before committing:** You see the season settings and your potential reward parameters. You know exactly what you're playing into.

**Reward model:** At the end of each round, PAPER is issued to the player based on their performance. The reward function is dynamic, computed per game, factoring in the player's item level. Higher item level = harder difficulty = higher potential reward. Rewards are **immediate**, not pooled across a season.

## The Build — Fight, Flee, or Finesse

This is the core of the game. Your equipment choices define your playstyle and determine how you handle every encounter.

### Three Archetypes

**FIGHTER** — Max Weapon (ATK) + Clothes (DEF). Example: Weapon Lv3, Clothes Lv3, Feet Lv0, Transport Lv0.
- Tank encounters. Win combat payouts. Trade health risk for cash acceleration.
- Fight payout: `(encounter_level x 3 + (turn/5)^2) x 1,000` cash. A Fighter at rep 80 on turn 15: (5 x 3 + 9) x 1,000 = 24,000 cash per fight won.
- Risk: low Speed means running is unreliable. Low Transport means you can't carry much product. You live and die by combat.

**RUNNER** — Max Feet (SPD) + Transport (carry capacity). Example: Weapon Lv0, Clothes Lv0, Feet Lv3, Transport Lv3.
- Evade encounters. Carry more drugs per trip. Consistent returns, lower ceiling.
- Speed advantage makes Run the dominant choice. High Transport lets you move maximum product per turn.
- Risk: if you get caught in a fight, you have no Attack or Defense. Getting cornered is death.

**FINESSE** — Balanced build. Example: Weapon Lv2, Clothes Lv1, Feet Lv2, Transport Lv1.
- Adapt per encounter. Pay when outmatched, fight when strong, run when fast enough.
- The three-way decision (Fight/Run/Pay) is genuinely open every encounter. Highest skill ceiling.
- Risk: master of none. No dominant strategy, every encounter is a judgment call.

### Equipment System

The DopeLoot/DopeHustlers NFT system supports **9 equipment slots** across two gear systems.

#### Permanent Gear (VRGDA Auction)

Players burn PAPER to permanently acquire items through a Variable Rate Gradual Dutch Auction. VRGDA pricing decays over time but rises when items are purchased faster than the target rate. Permanent gear persists across sessions and defines your baseline build.

#### Session Upgrades (Pawnshop)

During a game, spend in-game cash at the Pawnshop to temporarily boost equipment for the current session only. These upgrades reset at the end of each round. 4 upgrade levels (0-3), one upgrade per visit.

- Pawnshop access requires **wanted < 5** at the current location.
- Each purchase awards **+3 reputation**.
- All slots maxed triggers "Fully Loaded" achievement.

#### 9 Equipment Slots

| Slot | Stat | Effect |
|------|------|--------|
| Weapon | Attack | Damage dealt in combat |
| Clothes | Defense | % damage reduction |
| Feet | Speed | Initiative in combat, escape chance |
| Vehicle | Transport | Max drug weight carriable |
| Waist | Evasion | Reduce encounter trigger chance |
| Hand | Negotiation | Reduce demand_pct when paying |
| Neck | Reputation | Bonus rep gain per action |
| Ring | Luck | Improve market price variance in your favor |
| Drug | Tolerance | Carry multiple drug types or reduce drug weight |

The first 4 slots are **direct combat stats** mapping to the three encounter decisions (Fight, Run, Pay) plus economic capacity. The 5 additional slots are **indirect modifiers** that create hybrid archetypes. A Fighter with high Negotiation can Pay encounters they'd normally fight. A Runner with high Evasion avoids encounters entirely. The build space is combinatorial.

### Dynamic Item Difficulty

Item level affects encounter scaling. When the meta converges (everyone runs Fighter), Fighter encounters get harder. The meta self-balances so no single build dominates indefinitely. Higher item level = harder difficulty = higher PAPER reward ceiling.

## The Session — 15-21 Turns of Decisions

Every turn is three decisions. The game is short but the decision tree is deep.

### Decision 1: Where Do I Go?

6 neighborhoods plus Home. Each location tracks its own wanted level (0-7). Wanted determines encounter probability.

| ID | Location |
|----|----------|
| 0 | Home (safe hub, no encounters) |
| 1 | Queens |
| 2 | The Bronx |
| 3 | Brooklyn |
| 4 | Jersey City |
| 5 | Central Park |
| 6 | Coney Island |

- Traveling back to the same location: wanted +2/3/4 (WantedMode dependent).
- Leaving while carrying drugs: wanted +5/5/6 (WantedMode dependent).
- Other locations passively decay: -1 wanted per turn.
- Encounter probability: `(wanted x 15) - risk_modifier`. Warrior mode: always triggers.

**The calculus:** High-wanted locations have better market opportunities (you've been moving prices there) but higher encounter risk. Low-wanted locations are safe but the margins are thinner. Fighters want encounters. Runners avoid them. Finesse players read the situation.

### Decision 2: What Do I Trade?

Markets fund your build. Drug trading is a constant-product market (Uniswap-like). Your trades move prices, creating information asymmetry across locations.

- 8 drugs in ascending price tiers. You carry only 1 drug type at a time.
- Carry capacity = Transport stat vs (drug weight x quantity).
- Drug access gated by `drug_level`: only 4 drugs available at a time, advancing every 20 reputation.
- Price formula: `price = base + (tick x step)`, tick range 0-63.

**The calculus:** Runners with high Transport carry more product per trip. Fighters treat trading as secondary income between combat payouts. The capital allocation puzzle is real: every dollar spent on equipment is a dollar not invested in drug inventory.

### Decision 3: Fight, Flee, or Finesse?

This is where your build matters. See **The Encounters** section below.

### Reputation: The Difficulty Dial

Reputation (0-100) gates drug access AND scales encounter difficulty. This is the core tension of the game.

| Action | Rep Change |
|--------|-----------|
| Travel with > 5 drugs | +2 per turn |
| Travel without drugs | +1 per turn |
| Buy equipment | +3 |
| Win fight | +(level x 3) |
| Escape encounter | +(level x 2) |
| Pay off encounter | -(level x 5) |
| Jailed (failed run, Cops) | +6, -(level x 2) |
| Hospitalized (failed run, Gang) | +4, -(level x 2) |

**Warrior mode:** All reputation gains and losses are doubled.

**Drug Level Progression:** `drug_level = min(reputation / 20, 4)`
- Level 0: Ludes through Shrooms (drugs 0-3)
- Level 1: Speed through Acid (drugs 1-4)
- Level 2: Weed through Ketamine (drugs 2-5)
- Level 3: Shrooms through Heroin (drugs 3-6)
- Level 4: Acid through Cocaine (drugs 4-7)

Higher rep = better drugs = more profit potential BUT harder encounters = more risk. Every reputation point is simultaneously an asset and a liability.

### Turn Structure

1. **Start at Home** (turn 0). No encounter on the first travel.
2. **Arrive at location.** View local drug market prices.
3. **Trade** — Buy or sell drugs on the location's constant-product market.
4. **Shop** — If the Pawnshop is open (wanted < 5), upgrade one equipment slot.
5. **Travel** — Pick the next neighborhood.
6. **Encounter check** — VRF determines trigger based on wanted level.
7. **If encounter:** Choose Fight, Run, or Pay.
8. **Turn end** — Increment turn, award reputation, level up drug access, randomize market prices.
9. **Repeat** until max_turns reached or player dies.
10. **End game** — PAPER reward issued immediately based on performance.

## The Encounters — Where Skill Lives

This is the combat system. This is where your build matters. Every encounter is a meaningful three-way decision.

### Encounter Types

Two types determined by hash of game state (50/50 split):
- **Cops** — Confiscate drugs (Pay). Jail for 2 turns (failed Run). Represent risk to your inventory.
- **Gang** — Take cash (Pay, +1 HP damage). Hospitalize for 1 turn (failed Run). Represent risk to your capital.

**Design reasoning:** Cops and Gang create different emotional responses. Cops threaten your drug inventory (sunk cost, feels like theft). Gang threatens your cash (liquid capital, feels like robbery). The 50/50 split means you can't optimize for one type. Finesse players must handle both.

### Encounter Level

`level = reputation / divisor + 1`, capped at 6.

| EncountersOddsMode | Divisor |
|--------------------|---------|
| Easy | 20 |
| Normal | 16 |
| Hard | 12 |

### Encounter Stats (NoJokes baseline)

`stat = base + (level x step)`

| Type | HP Base | HP Step | ATK Base | ATK Step | DEF Base | DEF Step | SPD Base | SPD Step |
|------|---------|---------|----------|----------|----------|----------|----------|----------|
| Cops | 12 | 8 | 14 | 8 | 16 | 9 | 6 | 8 |
| Gang | 1 | 11 | 5 | 11 | 7 | 8 | 2 | 8 |

### Difficulty Mode Adjustments

| Mode | Cops adjustment | Gang adjustment |
|------|----------------|-----------------|
| Chill | All stats -2 | Base unchanged, step -2 |
| NoJokes | Baseline | Baseline |
| UltraViolence | All stats +2 | All stats +3 |

### Fight — When Your Build Can Take It

- Speed race determines initiative (who attacks first each round).
- Attack = player_attack +/- 20% random variance.
- Damage shielded = attack x (defender_defense / 100).
- Net damage = attack - shielded.
- Encounter attack uses attack/3 (currently hardcoded, marked TODO in source).
- Continues until one side dies (no round limit).
- Victory payout: `(encounter_level x 3 + (turn/5)^2) x 1,000` cash.
- Victory rep gain: encounter_level x 3.

**When to fight:** Your Attack exceeds their effective HP / rounds needed to kill. Fighter builds with Weapon Lv3 can clear most encounters profitably. The payout scales with level and turn, so late-game fights at high reputation are the biggest cash injections in the game.

### Run — When Speed Is Your Edge

- Speed race: `random(0, player_speed)` vs `random(0, encounter_speed)`. Up to 3 rounds.
- Each failed round: encounter attacks at attack/5 damage, lose max(1% drugs, 2 units).
- Success: Escaped. Rep gain = level x 2.
- Failure (caught after 3 rounds): Redirected to random location.
  - Cops: Jailed (lose 2 turns). Rep +6, -(level x 2).
  - Gang: Hospitalized (lose 1 turn). Rep +4, -(level x 2).

**When to run:** Your Speed exceeds theirs and you're carrying valuable inventory. Runner builds with Feet Lv3 have a dominant speed advantage. The +EV play is running even when you could fight, because preserving turns and inventory compounds over the session.

### Pay — The Calculated Loss

- Cops confiscate `demand_pct`% of your drugs. Gang takes `demand_pct`% of your cash.
- Gang also deals 1 HP damage (non-lethal).
- Reputation loss: level x 5.

**demand_pct distribution:**

| Roll (0-99) | < 1 | 1-9 | 10-19 | 20-49 | 50-99 |
|-------------|-----|-----|-------|-------|-------|
| demand_pct | 69% | 50% | 40% | 30% | 20% |

**When to pay:** When the encounter level outclasses your build and running is too risky. Paying 20% of your drugs (50% chance) is better than dying. The rep loss hurts, but dead hustlers don't score. Finesse players pay strategically to preserve resources for fights they can win.

### Encounter Outcomes

| Outcome | Condition | Effect |
|---------|-----------|--------|
| Died | Health reaches 0 | Game over |
| Paid | Chose Pay | Lose drugs (Cops) or cash (Gang) |
| Escaped | Won Run speed check | Continue to destination |
| Victorious | Won Fight | Cash payout + reputation |
| Jailed | Failed Run vs Cops | Lose 2 turns, random location |
| Hospitalized | Failed Run vs Gang | Lose 1 turn, random location |

## The Season — Your Weekly Slate

Every season randomizes 7 dimensions. 3 variants each = 2,187 possible configurations. Like a new DFS slate every week, the optimal strategy changes and the meta resets.

### Season Settings (Randomized per Season)

| Dimension | Variant 1 | Variant 2 | Variant 3 |
|-----------|-----------|-----------|-----------|
| CashMode | Broke (420) | Average (1,000) | Rich (2,600) |
| HealthMode | Junkie (70) | Hustler (90) | Streetboss (110) |
| TurnsMode | OnSpeed (15) | OnWeed (18) | OnMush (21) |
| EncountersMode | Chill (-2 stats) | NoJokes (base) | UltraViolence (+2/+3) |
| EncountersOddsMode | Easy (/20) | Normal (/16) | Hard (/12) |
| DrugsMode | Cheap | Normal | Expensive |
| WantedMode | KoolAndTheGang | ThugLife | MostWanted |

### How Settings Change Optimal Play

- **Broke + UltraViolence:** Fighter builds dominate. You can't afford to lose drugs or cash to Pay. You need combat payouts to build capital. Every encounter is a must-win.
- **Rich + Chill:** Trade-heavy Finesse plays are viable. Encounters are manageable, starting capital lets you invest in drugs immediately. Paying off encounters is affordable.
- **OnSpeed + Hard:** Reputation races matter more. With only 15 turns and fast encounter scaling, you need to commit to a build archetype early. No time to experiment.
- **OnMush + KoolAndTheGang:** Runner builds thrive. 21 turns with low encounter odds means more trading turns. High Transport pays off over the long session.

### Fixed Per-Season Config

| Parameter | Value | Description |
|-----------|-------|-------------|
| max_wanted_shopping | 5 | Wanted threshold to enter pawnshop |
| max_rounds | 3 | Max rounds when running from encounter |
| rep_drug_step | 20 | Reputation needed per drug level |
| rep_buy_item | 3 | Rep earned per equipment purchase |
| rep_carry_drugs | 2 | Rep earned per turn carrying > 5 drugs |
| rep_hospitalized | 4 | Rep earned when hospitalized |
| rep_jailed | 6 | Rep earned when jailed |

### Season Lifecycle

1. Season created with randomized SeasonSettings via VRF.
2. Players pay a USD entry fee to enter Ranked games.
3. Fee split: 70% buys PAPER off the AMM and burns it, 30% to developer.
4. Players play rounds within the season. Each round issues PAPER rewards immediately.
5. Season settings change when a new season begins, reshuffling the meta.

**Design reasoning:** Season randomization prevents the meta from being "solved." In a static game, optimal play converges and the skill ceiling flattens. With 2,187 possible configs, players must read the season settings and adapt their build. The skill is in the adaptation, not in memorizing one strategy.

## Rewards — Dynamic Per-Game

Rewards are computed per game and issued immediately at the end of each round. There is no pooled jackpot or tournament structure.

### Reward function

The reward is a dynamic function of:
- **Player performance** — Final cash at end of round
- **Player item level** — Higher item level increases difficulty, which increases the reward multiplier
- **PAPER token dynamics** — Supply and market conditions factor into the reward computation

### Entry fee distribution

| Allocation | Percentage | Purpose |
|-----------|-----------|---------|
| Buy-back and burn | 70% | Purchases PAPER from the AMM and burns it. Deflationary pressure on supply. |
| Developer | 30% | Platform revenue and development. |

### Key properties

- **Immediate payout:** PAPER is issued at round end. No waiting for season close, no claim step.
- **Individual performance:** Your reward depends on your play, not on how others performed. Not zero-sum.
- **Item-level scaling:** Equipping better gear raises difficulty, which raises the reward ceiling. This creates a natural progression: better gear = harder game = more PAPER if you can handle it.
- **Deflationary pressure:** 70% of all entry fees buy and burn PAPER. The more people play, the more PAPER is burned.

**Design reasoning:** Per-game rewards with item-level scaling create a clean feedback loop. Players are rewarded for pushing their build, not for grinding easy games. The dynamic difficulty from item level means there's always a harder, more rewarding challenge ahead.

## The Meta — What Changes

### Season Randomization
2,187 possible season configurations. The optimal build archetype shifts with every season. No solved states.

### Reputation as Difficulty Dial
Higher reputation unlocks better drugs (more profit) but spawns harder encounters (more risk). Players choose how fast to climb. Aggressive rep gain is a gamble that pays off for strong builds.

### Dynamic Item Difficulty
Item level will affect encounter scaling. When the meta converges (everyone runs Fighter), Fighter encounters get harder. The meta self-balances so no single build dominates indefinitely. Design thesis, not yet specified. Implementation details (update cadence, scaling formula, safety bounds) are open design questions.

### Deeper Build Diversity
More equipment slots, item synergies, seasonal item rotations. The build space should feel like assembling a DFS lineup, not picking the obvious best-in-slot.


## Identity & Progression

### NFT Integration - **GuestLootId:** Free-to-play, 8 deterministic IDs per season. Same stat system as NFT players.
- **LootId:** DopeLoot NFT owners use their gear as starting equipment.
- **HustlerId:** DopeHustlers NFT owners play with their hustler identity.

### Achievements 
26 achievements across 11 groups, integrated with Cartridge Arcade (bushido) framework.

| Group | Achievement | Points | Condition |
|-------|------------|--------|-----------|
| Brawler | Brawler | 80 | Defeat a max-level Cop AND max-level Gang |
| Notorious | Notorious | 50 | End a game with 100 reputation |
| Domination | Kingpin | 80 | Win a season |
| Fully Loaded | Fully Loaded | 50 | Max out all equipment (hidden) |
| Discipline | Luck | 10 | Buy at lowest / sell at highest price x20 |
| Discipline | Skill | 30 | Buy at lowest / sell at highest price x100 |
| Discipline | Habit | 80 | Buy at lowest / sell at highest price x250 |
| Dealer | Operator | 10 | Sell drugs for 69M total |
| Dealer | Broker | 30 | Sell drugs for 420M total |
| Dealer | Cartel | 75 | Sell drugs for 69B total |
| Gambler | Roller | 10 | Play 5 games at max multiplier |
| Gambler | Staker | 30 | Play 25 games at max multiplier |
| Gambler | Dicer | 80 | Play 100 games at max multiplier |
| Launderer | Receipts | 10 | Claim 69,000 $PAPER |
| Launderer | Funds | 30 | Claim 420,000 $PAPER |
| Launderer | Nest Egg | 80 | Claim 1,000,000 $PAPER |
| Drip | Drip | 25 | Play with a matched gear set (hidden) |
| Survivor | Survivor | 10 | End a game with 1 HP (hidden) |
| Encounters | Tough | 10 | Defeat 100 Cops or Gangs |
| Encounters | Dangerous | 30 | Defeat 500 Cops or Gangs |
| Encounters | Infamous | 80 | Defeat 1,000 Cops or Gangs |
| Elegant | Elegant | 25 | Start a game with an accessory (hidden) |
| Strategist | Quick | 20 | Play 5 games with full early-tier items (hidden) |
| Strategist | Versatile | 20 | Play 5 games with full mid-tier items (hidden) |
| Strategist | Sturdy | 20 | Play 5 games with full late-tier items (hidden) |
| OG | Original Gangsta | 25 | Play with an OG hustler (hidden) |

## To Begin

1. **Pick your hustler.** Choose a Guest identity (free), or bring your DopeLoot or DopeHustlers NFT. Your gear defines your starting build.
2. **Choose your stakes.** Pay a USD entry fee for Ranked mode (earn PAPER rewards) or play Noob mode for free. Higher stakes, higher reward ceiling.
3. **Hit the streets.** Trade drugs, upgrade your build, navigate encounters. PAPER reward issued at the end of each round based on your performance.

## Theme Direction
- Grimy fictional NYC drug trade. Pixel art aesthetic with neon accents.
- Core fantasy: "street-level hustle under pressure." High stakes, high reward.
- DopeLoot and DopeHustlers NFT universe provides identity and gear cosmetics.
- Retro Drug Wars nostalgia modernized with onchain transparency and real stakes.
- Hip-hop soundtrack (15 neighborhood-themed tracks) and weapon-specific sound effects.

## The Stack
- **Starknet L2** with **Dojo 1.7.1** (Cairo 2.12.2) for game contracts.
- **Cartridge VRF** for provable on-chain randomness (encounters, season generation, market variations).
- **Torii** indexer with GraphQL subscriptions for real-time frontend state.
- **Next.js 16** frontend with MobX stores, Chakra UI, and PWA support.
- **Namespace:** `dopewars_v0`.
- **Geo-blocked:** AZ, AR, CT, DE, LA, MT, SC, SD, TN (skill-based real-money compliance).

**Why onchain:** Provable fairness. Transparent payout math. No hidden house edge. Every encounter outcome, every payout calculation, every season configuration is verifiable on Starknet. Players don't have to trust the operator. They can verify.

## Appendix: Drug Market Tables

### Normal Mode

| Drug | ID | Base | Step | Weight | Price Range |
|------|----|------|------|--------|-------------|
| Ludes | 0 | 24 | 2 | 10 | 24 - 150 |
| Speed | 1 | 150 | 8 | 14 | 150 - 654 |
| Weed | 2 | 402 | 16 | 19 | 402 - 1,410 |
| Shrooms | 3 | 906 | 32 | 27 | 906 - 2,922 |
| Acid | 4 | 1,914 | 64 | 37 | 1,914 - 5,946 |
| Ketamine | 5 | 3,930 | 128 | 52 | 3,930 - 12,002 |
| Heroin | 6 | 7,962 | 256 | 72 | 7,962 - 24,090 |
| Cocaine | 7 | 16,026 | 512 | 100 | 16,026 - 48,282 |

### Cheap Mode

| Drug | ID | Base | Step | Weight | Price Range |
|------|----|------|------|--------|-------------|
| Ludes | 0 | 18 | 1 | 5 | 18 - 81 |
| Speed | 1 | 85 | 6 | 10 | 85 - 463 |
| Weed | 2 | 290 | 18 | 15 | 290 - 1,424 |
| Shrooms | 3 | 980 | 54 | 25 | 980 - 4,382 |
| Acid | 4 | 2,900 | 111 | 30 | 2,900 - 9,893 |
| Ketamine | 5 | 6,800 | 186 | 45 | 6,800 - 18,518 |
| Heroin | 6 | 13,500 | 231 | 65 | 13,500 - 28,053 |
| Cocaine | 7 | 19,800 | 284 | 100 | 19,800 - 37,692 |

### Expensive Mode

| Drug | ID | Base | Step | Weight | Price Range |
|------|----|------|------|--------|-------------|
| Ludes | 0 | 25 | 1 | 12 | 25 - 88 |
| Speed | 1 | 76 | 3 | 17 | 76 - 265 |
| Weed | 2 | 218 | 10 | 23 | 218 - 848 |
| Shrooms | 3 | 796 | 28 | 31 | 796 - 2,560 |
| Acid | 4 | 1,989 | 56 | 41 | 1,989 - 5,517 |
| Ketamine | 5 | 4,467 | 109 | 58 | 4,467 - 11,334 |
| Heroin | 6 | 7,934 | 186 | 76 | 7,934 - 19,652 |
| Cocaine | 7 | 17,220 | 333 | 100 | 17,220 - 38,199 |

## Appendix: Wanted Risk Table

| Wanted | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|--------|---|---|---|---|---|---|---|---|
| Raw risk (wanted x 15) | 0% | 15% | 30% | 45% | 60% | 75% | 90% | 105% |

| Mode | Risk modifier | Travel-back | Leave-with-drugs |
|------|--------------|-------------|------------------|
| KoolAndTheGang | -20 | +2 | +5 |
| ThugLife | -15 | +3 | +5 |
| MostWanted | -10 | +4 | +6 |

