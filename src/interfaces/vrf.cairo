//! Local VRF provider interface — mirrors the ABI of cartridge-gg/vrf so the
//! same dispatcher works against the real VRF contract in production. We
//! vendor the interface (rather than depending on the `cartridge_vrf` package)
//! because that package is pinned to openzeppelin 2.x and blocks the v2
//! openzeppelin 3.0 upgrade. See docs/V2_DESIGN.md.

use starknet::ContractAddress;

#[starknet::interface]
pub trait IVrfProvider<TContractState> {
    fn request_random(self: @TContractState, caller: ContractAddress, source: Source);
    fn consume_random(ref self: TContractState, source: Source) -> felt252;
}

#[derive(Drop, Copy, Clone, Serde)]
pub enum Source {
    Nonce: ContractAddress,
    Salt: felt252,
}
