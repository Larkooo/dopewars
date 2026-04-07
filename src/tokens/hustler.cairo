// Hustler v2 — single-use ERC721 minted by the starterpack purchase flow.
//
// Each token represents one game session. Purchase (PR-1d) mints a hustler
// from the buyer's chosen starterpack template; the game contract (PR-1e)
// reads the template + gear loadout off the token to seed the run, marks the
// token "used" once the game ends, and may keep the NFT around for trophy
// display or burn it depending on PR-1e's final design.
//
// Mirrors nums systems/collection.cairo's `ICollection::mint(to, soulbound)
// -> u64` interface to make the PR-1d port near-mechanical, but we use only
// OpenZeppelin (no arcade collection dep, no graffiti/alexandria) to keep the
// blast radius of new dependencies small. ERC4906 / ERC7572 / dynamic
// metadata can be layered in by a later content PR.
//
// Per-token state (template_id, gear loadout, used flag) lives on the
// HustlerInstance dojo model — kept off the contract storage so the game
// contract can read/write it via the world without dispatching back into
// this contract.

use starknet::ContractAddress;

#[starknet::interface]
pub trait IHustler<TContractState> {
    /// Mint a fresh hustler to `to`. Restricted to MINTER_ROLE.
    /// Returns the new token id (u64, sequentially assigned starting at 1).
    fn mint(ref self: TContractState, to: ContractAddress, soulbound: bool) -> u64;
    /// Burn a token. Restricted to MINTER_ROLE so the game contract can
    /// retire used hustlers without exposing it to arbitrary callers.
    fn burn(ref self: TContractState, token_id: u256);
    /// Read the soulbound flag for `token_id`.
    fn is_soulbound(self: @TContractState, token_id: u256) -> bool;
}

pub fn NAME() -> ByteArray {
    "Hustler"
}

pub const MINTER_ROLE: felt252 = selector!("MINTER_ROLE");

#[dojo::contract]
pub mod hustler {
    use openzeppelin::access::accesscontrol::{AccessControlComponent, DEFAULT_ADMIN_ROLE};
    use openzeppelin::interfaces::token::erc721::{IERC721, IERC721Metadata};
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use starknet::ContractAddress;
    use super::MINTER_ROLE;

    pub mod ERRORS {
        pub const HUSTLER_SOULBOUND: felt252 = 'Hustler: token is soulbound';
    }

    component!(path: AccessControlComponent, storage: accesscontrol, event: AccessControlEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: ERC721Component, storage: erc721, event: ERC721Event);

    #[abi(embed_v0)]
    impl AccessControlImpl =
        AccessControlComponent::AccessControlImpl<ContractState>;
    impl AccessControlInternalImpl = AccessControlComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    #[storage]
    pub struct Storage {
        #[substorage(v0)]
        pub accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        pub src5: SRC5Component::Storage,
        #[substorage(v0)]
        pub erc721: ERC721Component::Storage,
        // Sequential token id counter — starts at 1 (0 is reserved as "no
        // hustler" everywhere else in the codebase).
        pub next_id: u64,
        // Per-token soulbound flag. Soulbound tokens cannot be transferred,
        // only burned by the minter — used for f2p / promotional hustlers.
        pub soulbound: Map<u256, bool>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        ERC721Event: ERC721Component::Event,
    }

    fn dojo_init(ref self: ContractState, admin: ContractAddress) {
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(DEFAULT_ADMIN_ROLE, admin);
        // Empty base_uri — content PR will plug in a real metadata renderer.
        self.erc721.initializer("Hustler", "HUSTLER", "");
    }

    // Custom ERC721 impl that adds the soulbound check on transfer.
    // We deliberately do NOT embed `ERC721Component::ERC721Impl` here so that
    // every transfer path goes through our `assert_not_soulbound` gate.
    #[abi(embed_v0)]
    impl ERC721Impl of IERC721<ContractState> {
        fn balance_of(self: @ContractState, account: ContractAddress) -> u256 {
            self.erc721.balance_of(account)
        }

        fn owner_of(self: @ContractState, token_id: u256) -> ContractAddress {
            self.erc721.owner_of(token_id)
        }

        fn safe_transfer_from(
            ref self: ContractState,
            from: ContractAddress,
            to: ContractAddress,
            token_id: u256,
            data: Span<felt252>,
        ) {
            self.assert_not_soulbound(token_id);
            self.erc721.safe_transfer_from(from, to, token_id, data)
        }

        fn transfer_from(
            ref self: ContractState, from: ContractAddress, to: ContractAddress, token_id: u256,
        ) {
            self.assert_not_soulbound(token_id);
            self.erc721.transfer_from(from, to, token_id)
        }

        fn approve(ref self: ContractState, to: ContractAddress, token_id: u256) {
            self.erc721.approve(to, token_id)
        }

        fn set_approval_for_all(
            ref self: ContractState, operator: ContractAddress, approved: bool,
        ) {
            self.erc721.set_approval_for_all(operator, approved)
        }

        fn get_approved(self: @ContractState, token_id: u256) -> ContractAddress {
            self.erc721.get_approved(token_id)
        }

        fn is_approved_for_all(
            self: @ContractState, owner: ContractAddress, operator: ContractAddress,
        ) -> bool {
            self.erc721.is_approved_for_all(owner, operator)
        }
    }

    #[abi(embed_v0)]
    impl ERC721MetadataImpl of IERC721Metadata<ContractState> {
        fn name(self: @ContractState) -> ByteArray {
            self.erc721.name()
        }

        fn symbol(self: @ContractState) -> ByteArray {
            self.erc721.symbol()
        }

        fn token_uri(self: @ContractState, token_id: u256) -> ByteArray {
            // [Check] Token exists — owner_of panics on missing tokens, so
            // wrap it the same way nums does.
            let _owner = self.erc721.owner_of(token_id);
            // Content PR will fill this in with a real renderer (likely SVG
            // pulling stats off the HustlerInstance model).
            ""
        }
    }

    #[abi(embed_v0)]
    impl HustlerImpl of super::IHustler<ContractState> {
        fn mint(ref self: ContractState, to: ContractAddress, soulbound: bool) -> u64 {
            self.accesscontrol.assert_only_role(MINTER_ROLE);
            let token_id = self.next_id.read() + 1;
            self.next_id.write(token_id);
            self.erc721.mint(to, token_id.into());
            if soulbound {
                self.soulbound.entry(token_id.into()).write(true);
            }
            token_id
        }

        fn burn(ref self: ContractState, token_id: u256) {
            self.accesscontrol.assert_only_role(MINTER_ROLE);
            self.erc721.burn(token_id);
            // Clear soulbound state so a future re-mint with the same id
            // (shouldn't happen, but defensively) starts clean.
            if self.soulbound.entry(token_id).read() {
                self.soulbound.entry(token_id).write(false);
            }
        }

        fn is_soulbound(self: @ContractState, token_id: u256) -> bool {
            self.soulbound.entry(token_id).read()
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn assert_not_soulbound(self: @ContractState, token_id: u256) {
            assert(!self.soulbound.entry(token_id).read(), ERRORS::HUSTLER_SOULBOUND);
        }
    }
}
