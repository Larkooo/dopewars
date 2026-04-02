use starknet::ContractAddress;

#[starknet::interface]
pub trait IPaper<TState> {
    fn balance_of(self: @TState, account: ContractAddress) -> u256;
    fn transfer(ref self: TState, recipient: ContractAddress, amount: u256) -> bool;
    fn transfer_from(
        ref self: TState, sender: ContractAddress, recipient: ContractAddress, amount: u256,
    ) -> bool;
}
