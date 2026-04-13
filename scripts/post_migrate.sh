#!/bin/bash
# Post-migration admin setup for dopewars v2.
#
# Run after `sozo migrate --profile <PROFILE>` to wire:
#   1. MINTER_ROLE grants (hustler → purchase, paper → game)
#   2. PaymentConfig (Ekubo pool params, USDC, pricing)
#   3. purchase.initialize() (register 4 starterpack bundles)
#   4. marketplace.set_config() (per-tier PAPER prices + burn split)
#
# Usage:
#   ./scripts/post_migrate.sh dev      # local katana
#   ./scripts/post_migrate.sh sepolia  # sepolia testnet
#   ./scripts/post_migrate.sh mainnet  # starknet mainnet

set -euo pipefail

PROFILE="${1:-dev}"
NS="dopewars"

echo "=== Post-migrate setup for profile: $PROFILE ==="

# ─── Addresses from nums (same on all networks unless noted) ───
# MINTER_ROLE selector — matches selector!("MINTER_ROLE") in paper.cairo / hustler.cairo
MINTER_ROLE="0x4d494e5445525f524f4c45"

# Ekubo addresses per network
if [ "$PROFILE" = "mainnet" ]; then
    EKUBO_ROUTER="0x04505a9f06f2bd639b6601f37a4dc0908bb70e8e0e0c34b1220827d64f4fc066"
    EKUBO_POSITIONS="0x02e0af29598b407c8716b17f6d2795eca1b471413fa03fb145a5e33722184067"
    POOL_EXTENSION="0x043e4f09c32d13d43a880e85f69f7de93ceda62d6cf2581a582c6db635548fdc"
    USDC="0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"
    TREASURY="0x026C8df51A3b2652b6FaFD2d38ea0639f9131Ef097507758adef6E983Bcb7106"
elif [ "$PROFILE" = "sepolia" ]; then
    EKUBO_ROUTER="0x050d4da9f66589eadaa1d5e31cf73b08ac1a67c8b4dcd88e6fd4fe501c628af2"
    EKUBO_POSITIONS="0x06a2aee84bb0ed5dded4384ddd0e40e9c1372b818668375ab8e3ec08807417e5"
    POOL_EXTENSION="0x073ec792c33b52d5f96940c2860d512b3884f2127d25e023eb9d44a678e4b971"
    # On sepolia, use paper_mock as USDC stand-in (deployed by sozo)
    USDC="0x0"  # Will be filled from manifest after deploy
    TREASURY="0x44cea566ac53bf7c36b298e36536c1a53ba0b0bdf66b2c5f437965605acface"
else
    # dev / dopewars (katana) — use 0x0 to skip Ekubo swap path
    EKUBO_ROUTER="0x0"
    EKUBO_POSITIONS="0x0"
    POOL_EXTENSION="0x0"
    USDC="0x0"
    TREASURY="0xe29882a1fcba1e7e10cad46212257fea5c752a4f9b1b1ec683c503a2cf5c8a"
fi

# Ekubo pool params (same as nums — 0.3% fee tier)
POOL_FEE="0xccccccccccccccccccccccccccccccc"
POOL_TICK_SPACING="0x56a4c"   # 355884
# pool_sqrt — depends on token ordering (token0 < token1)
# These match nums' values; the correct one is chosen based on
# whether USDC < PAPER in address ordering.
POOL_SQRT_LOW="0x6f3528fe26840249f4b191ef6dff7928"
POOL_SQRT_HIGH="0xfffffc080ed7b455"

# Base price: 2 USDC (6 decimals) = 2_000_000
BASE_PRICE="0x1E8480"

# Distribution: 70% burn, 20% treasury (remaining 10% stays in contract)
BURN_PCT="70"
TREASURY_PCT="20"

# Marketplace: per-tier PAPER prices (18 decimals) + 50% burn
# Tier 1 (best gear): 500 PAPER, Tier 2: 200 PAPER, Tier 3 (junk): 50 PAPER
TIER1_PRICE="500000000000000000000"   # 500 * 1e18
TIER2_PRICE="200000000000000000000"   # 200 * 1e18
TIER3_PRICE="50000000000000000000"    # 50 * 1e18
MARKET_BURN_PCT="50"

echo ""
echo "--- Step 1: Grant MINTER_ROLE on hustler to purchase contract ---"
sozo -P "$PROFILE" execute "$NS-hustler" grant_role -c "$MINTER_ROLE","$NS-purchase"
echo "Done."

echo ""
echo "--- Step 2: Grant MINTER_ROLE on paper to game contract (for rewards) ---"
sozo -P "$PROFILE" execute "$NS-paper" grant_role -c "$MINTER_ROLE","$NS-game"
echo "Done."

if [ "$EKUBO_ROUTER" != "0x0" ]; then
    echo ""
    echo "--- Step 3: Set PaymentConfig (Ekubo + pricing) ---"
    sozo -P "$PROFILE" execute "$NS-purchase" set_payment_config \
        -c "$USDC","$EKUBO_ROUTER","$EKUBO_POSITIONS","$POOL_FEE","$POOL_TICK_SPACING","$POOL_EXTENSION","$POOL_SQRT_LOW","$POOL_SQRT_HIGH","$BASE_PRICE",0,"$BURN_PCT","$TREASURY_PCT","$TREASURY"
    echo "Done."
else
    echo ""
    echo "--- Step 3: SKIPPED (no Ekubo on $PROFILE — swap path disabled) ---"
fi

echo ""
echo "--- Step 4: Initialize purchase (register 4 starterpack bundles) ---"
sozo -P "$PROFILE" execute "$NS-purchase" initialize
echo "Done."

echo ""
echo "--- Step 5: Set marketplace config (per-tier PAPER prices + burn) ---"
sozo -P "$PROFILE" execute "$NS-marketplace" set_config \
    -c "$TIER1_PRICE",0,"$TIER2_PRICE",0,"$TIER3_PRICE",0,"$MARKET_BURN_PCT"
echo "Done."

echo ""
echo "=== Post-migrate complete for $PROFILE ==="
echo ""
echo "Checklist:"
echo "  [x] MINTER_ROLE on hustler → purchase"
echo "  [x] MINTER_ROLE on paper → game"
if [ "$EKUBO_ROUTER" != "0x0" ]; then
echo "  [x] PaymentConfig with Ekubo pool params"
else
echo "  [ ] PaymentConfig SKIPPED (no Ekubo)"
fi
echo "  [x] 4 starterpack bundles registered"
echo "  [x] Marketplace per-tier pricing set"
