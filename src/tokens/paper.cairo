// PAPER v2 — mintable + burnable ERC20 with AccessControl.
//
// Ported from nums systems/token.cairo. The MINTER_ROLE pattern lets the
// purchase contract (PR-1d) and game contract (PR-1e) mint rewards while the
// admin (treasury) retains control over role grants.
//
// PR-1b: contract is fully standalone — no other v2 systems exist yet, so
// dojo_init only initializes ERC20 + AccessControl and grants
// DEFAULT_ADMIN_ROLE to the deployer-supplied admin. PR-1d will grant
// MINTER_ROLE to the purchase contract; PR-1e will grant it to the game
// contract for register_score rewards. Both can use the standard
// IAccessControl::grant_role entrypoint embedded here.
//
// The legacy paper_mock under src/_mocks/ stays in place until PR-1e rewires
// callers — see docs/V2_DESIGN.md.

use starknet::ContractAddress;

#[starknet::interface]
pub trait IPaperToken<TContractState> {
    /// Mint `amount` to `recipient`. Restricted to MINTER_ROLE.
    fn reward(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    /// Burn `amount` from the caller's balance.
    fn burn(ref self: TContractState, amount: u256);
}

pub fn NAME() -> ByteArray {
    "Paper"
}

pub const MINTER_ROLE: felt252 = selector!("MINTER_ROLE");

#[dojo::contract]
pub mod paper {
    use dojo::world::WorldStorageTrait;
    use openzeppelin::access::accesscontrol::{AccessControlComponent, DEFAULT_ADMIN_ROLE};
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc20::{DefaultConfig, ERC20Component};
    use starknet::{ContractAddress, get_caller_address};
    use super::MINTER_ROLE;

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);
    component!(path: AccessControlComponent, storage: accesscontrol, event: AccessControlEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    #[abi(embed_v0)]
    impl AccessControlImpl =
        AccessControlComponent::AccessControlImpl<ContractState>;
    #[abi(embed_v0)]
    impl ERC20Impl = ERC20Component::ERC20Impl<ContractState>;
    #[abi(embed_v0)]
    impl ERC20CamelOnlyImpl = ERC20Component::ERC20CamelOnlyImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;
    impl AccessControlInternalImpl = AccessControlComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        #[substorage(v0)]
        accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    fn dojo_init(ref self: ContractState, admin: ContractAddress) {
        // ERC20 metadata
        self.erc20.initializer("Paper", "PAPER");
        // AccessControl
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(DEFAULT_ADMIN_ROLE, admin);
        // Grant MINTER_ROLE to the game contract so it can mint PAPER
        // rewards via the rewarder in season_manager::on_register_score.
        // Silently skips if game contract isn't deployed yet (test fixture).
        let world = self.world(@rollyourown::constants::ns());
        if let Option::Some(game_address) = world.dns_address(@"game") {
            self.accesscontrol._grant_role(MINTER_ROLE, game_address);
        }
    }

    impl ERC20HooksImpl of ERC20Component::ERC20HooksTrait<ContractState> {}

    #[abi(embed_v0)]
    impl PaperTokenImpl of super::IPaperToken<ContractState> {
        fn reward(ref self: ContractState, recipient: ContractAddress, amount: u256) -> bool {
            self.accesscontrol.assert_only_role(MINTER_ROLE);
            self.erc20.mint(recipient, amount);
            true
        }

        fn burn(ref self: ContractState, amount: u256) {
            self.erc20.burn(get_caller_address(), amount);
        }
    }
}
