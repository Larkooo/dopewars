use core::num::traits::Pow;

pub const ETHER: u256 = 1_000_000_000_000_000_000;
pub const MAX_MULTIPLIER: u8 = 10; // TODO: make configurable

pub const TEN_POW_18: u128 = 10_u128.pow(18);
pub const MULTIPLIER_PRECISION: u128 = 1_000_000;


pub fn ns() -> ByteArray {
    "dopewars_v0"
}

pub fn ns_felt252() -> felt252 {
    'dopewars_v0'
}

