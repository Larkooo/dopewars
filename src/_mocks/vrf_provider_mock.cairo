//! Dev/test VRF stub. Returns the current transaction hash as the random
//! value — sufficient for local development against katana, NOT secure for
//! production. Production uses the real Cartridge VRF provider; this mock is
//! only deployed under the dev profile.
//!
//! Replaces the previous mock that depended on `cartridge_vrf::vrf_provider`,
//! which is pinned to openzeppelin 2.x. See docs/V2_DESIGN.md.

#[dojo::contract]
mod vrf_provider_mock {
    use rollyourown::interfaces::vrf::Source;
    use starknet::ContractAddress;

    #[generate_trait]
    #[abi(per_item)]
    impl ExternalImpl of ExternalTrait {
        #[external(v0)]
        fn request_random(ref self: ContractState, caller: ContractAddress, source: Source) {}

        #[external(v0)]
        fn consume_random(ref self: ContractState, source: Source) -> felt252 {
            starknet::get_tx_info().unbox().transaction_hash
        }

        #[external(v0)]
        fn assert_consumed(ref self: ContractState, source: Source) {}
    }
}
