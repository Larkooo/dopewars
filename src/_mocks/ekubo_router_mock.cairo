// Test-only Ekubo router + clearer mock.
//
// Implements `ekubo::interfaces::router::IRouter` and
// `ekubo::components::clear::IClear` so the v2 purchase contract's
// `on_issue` swap-and-burn path can be exercised end-to-end in
// cairo_test without spinning up a real Ekubo pool.
//
// The mock is a regular starknet contract (not a dojo contract). The
// test fixture pre-funds it with PAPER, then sets
// `PaymentConfig.ekubo_router` = mock_address. When the purchase
// contract calls `swap()` it transfers USDC to the mock and the mock
// is "responsible" for producing PAPER. The mock doesn't actually do
// any swap math — it just sits on the pre-funded PAPER balance until
// `clear()` / `clear_minimum()` transfers it back to the caller.
//
// This means the test controls the effective swap rate by funding the
// mock with the desired PAPER amount before each issue() call. A test
// fund of 100 PAPER means each call to clear(paper) returns 100 PAPER
// to the caller, regardless of how much USDC the caller deposited.
//
// All IRouter methods other than `swap` are stubbed as `panic!` —
// the purchase contract only ever calls `swap`, and a panic on any
// other method would catch a regression where the contract starts
// using e.g. `multihop_swap`.

#[starknet::contract]
pub mod ekubo_router_mock {
    use ekubo::interfaces::router::{Depth, IRouter, RouteNode, Swap, TokenAmount};
    use ekubo::types::delta::Delta;
    use ekubo::types::i129::i129;
    use ekubo::types::keys::PoolKey;

    // Reuse Ekubo's default ClearImpl. Same `impl Foo = path<State>`
    // pattern that ekubo's own Router uses (see
    // ekubo::router::Router). The default impl calls
    // token.balanceOf(self) and token.transfer(recipient, balance),
    // both of which the dopewars paper contract responds to (it
    // embeds OZ ERC20CamelOnlyImpl). This avoids the duplicate-
    // trait-impl conflict that providing our own impl of IClear
    // would create.
    #[abi(embed_v0)]
    impl Clear = ekubo::components::clear::ClearImpl<ContractState>;

    #[storage]
    struct Storage {}

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[abi(embed_v0)]
    impl RouterImpl of IRouter<ContractState> {
        // The purchase contract's only Ekubo entry point. Caller has
        // already transferred USDC to this contract before calling.
        // The mock doesn't compute a real swap — it just no-ops here
        // and lets the subsequent `clear()` calls drain the pre-funded
        // PAPER and the just-deposited USDC back to the caller.
        fn swap(
            ref self: ContractState, node: RouteNode, token_amount: TokenAmount,
        ) -> Delta {
            let _ = node;
            let _ = token_amount;
            Delta { amount0: i129 { mag: 0, sign: false }, amount1: i129 { mag: 0, sign: false } }
        }

        fn multihop_swap(
            ref self: ContractState, route: Array<RouteNode>, token_amount: TokenAmount,
        ) -> Array<Delta> {
            let _ = route;
            let _ = token_amount;
            panic!("mock: multihop_swap not implemented")
        }

        fn multi_multihop_swap(
            ref self: ContractState, swaps: Array<Swap>,
        ) -> Array<Array<Delta>> {
            let _ = swaps;
            panic!("mock: multi_multihop_swap not implemented")
        }

        fn quote_multi_multihop_swap(
            self: @ContractState, swaps: Array<Swap>,
        ) -> Array<Array<Delta>> {
            let _ = swaps;
            panic!("mock: quote_multi_multihop_swap not implemented")
        }

        fn quote_multihop_swap(
            self: @ContractState, route: Array<RouteNode>, token_amount: TokenAmount,
        ) -> Array<Delta> {
            let _ = route;
            let _ = token_amount;
            panic!("mock: quote_multihop_swap not implemented")
        }

        fn quote_swap(
            self: @ContractState, node: RouteNode, token_amount: TokenAmount,
        ) -> Delta {
            let _ = node;
            let _ = token_amount;
            panic!("mock: quote_swap not implemented")
        }

        fn get_delta_to_sqrt_ratio(
            self: @ContractState, pool_key: PoolKey, sqrt_ratio: u256,
        ) -> Delta {
            let _ = pool_key;
            let _ = sqrt_ratio;
            panic!("mock: get_delta_to_sqrt_ratio not implemented")
        }

        fn get_market_depth(
            self: @ContractState, pool_key: PoolKey, sqrt_percent: u128,
        ) -> Depth {
            let _ = pool_key;
            let _ = sqrt_percent;
            panic!("mock: get_market_depth not implemented")
        }

        fn get_market_depth_v2(
            self: @ContractState, pool_key: PoolKey, percent_64x64: u128,
        ) -> Depth {
            let _ = pool_key;
            let _ = percent_64x64;
            panic!("mock: get_market_depth_v2 not implemented")
        }

        fn get_market_depth_at_sqrt_ratio(
            self: @ContractState,
            pool_key: PoolKey,
            sqrt_ratio: u256,
            percent_64x64: u128,
        ) -> Depth {
            let _ = pool_key;
            let _ = sqrt_ratio;
            let _ = percent_64x64;
            panic!("mock: get_market_depth_at_sqrt_ratio not implemented")
        }
    }

}
