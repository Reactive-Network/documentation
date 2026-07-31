---
title: Economy
sidebar_position: 6
description: Learn how reactive contracts pay for execution and cross-chain callbacks, including REACT funding, transaction fees, and callback pricing.
slug: /economy
hide_title: true
---

![Economy](./img/economy.jpg)

## Overview

Payment works the same way on both sides of the network. On Reactive, the system contract charges reactive contracts for executing `react()`. On a destination chain, the callback proxy charges callback contracts for delivering callbacks. Both inherit the same accounting logic, so the concepts and method names below apply to either side. Contracts must stay funded on both to remain active.

## Balances

Three separate numbers govern whether a contract can execute:

| Value    | Held by                           | Meaning                      |
|----------|-----------------------------------|------------------------------|
| Balance  | The contract itself               | Funds the contract can spend |
| Reserves | System contract or callback proxy | Pre-paid credit for fees     |
| Debt     | System contract or callback proxy | Fees owed but not yet paid   |

Charges consume reserves before debt accrues, and deposits clear debt before adding reserves, so a contract never holds both at once. Its balance is separate from both: a direct transfer raises the balance without creating reserves or settling debt.

:::warning[Any Debt Blocks Execution]
Execution stops whenever debt is greater than zero, not merely when a contract is underfunded. The system contract won't call `react()` and the callback proxy won't deliver a callback while any amount remains outstanding.
:::

## Fee Model 

Reactive transactions and callbacks share one pricing formula. The fee is
charged in the same transaction as the execution it pays for, and goes to
that transaction's originator: the validator that posted the reactive
transaction or delivered the callback.

$$
fee = p_{base} ⋅ C ⋅ (g_{used} + K)
$$

Where:

- $$p_{base}$$ — the greater of `tx.gasprice` and `block.basefee`
- $$C$$ — pricing coefficient, read from `_gasPriceCoeffPer1000` and divided by 1000
- $$g_{used}$$ — gas consumed during execution
- $$K$$ — fixed gas surcharge, read from `_extraGas`

On Reactive, the system contract initializes the coefficient to 1000, the
surcharge to 100,000 gas, and the payment gas budget to 50,000. The owner
can change all three, so query them rather than relying on the defaults:

```bash
cast call $SYSTEM_CONTRACT_ADDR "_gasPriceCoeffPer1000()" --rpc-url $REACTIVE_RPC | cast to-dec
```

```bash
cast call $SYSTEM_CONTRACT_ADDR "_extraGas()" --rpc-url $REACTIVE_RPC | cast to-dec
```

```bash
cast call $SYSTEM_CONTRACT_ADDR "_maxChargeGas()" --rpc-url $REACTIVE_RPC | cast to-dec
```

Each callback proxy is configured at deployment and has no defaults, so
values vary by destination chain and must be read from the proxy itself:

```bash
cast call $CALLBACK_PROXY_ADDR "_gasPriceCoeffPer1000()" --rpc-url $DESTINATION_RPC | cast to-dec
```

```bash
cast call $CALLBACK_PROXY_ADDR "_extraGas()" --rpc-url $DESTINATION_RPC | cast to-dec
```

```bash
cast call $CALLBACK_PROXY_ADDR "_maxChargeGas()" --rpc-url $DESTINATION_RPC | cast to-dec
```

`_maxChargeGas` doesn't enter the fee itself; it caps the gas available for
settling payment, covered under [Gas Limits](#gas-limits).

:::warning[Failed Execution Is Still Charged]
A reverting `react()` is caught, logged as a `ReactiveContractReverted` event, and charged in full. A failing callback is logged as a `CallbackFailure` event and charged in full. Neither is refunded, so a contract that reverts on every notification will still exhaust its funds. The sole exception is a callback addressed to an account holding no code, which is rejected before any charge applies.
:::

## Gas Limits

Both sides of the network cap gas, and callbacks receive slightly less than they request.

:::info[Reactive Transaction Gas Cap]
The maximum gas limit for reactive transactions is 900,000 units.
:::

:::info[Callback Gas Limit]
Reactive Network enforces a minimum callback gas limit of 100,000 gas. Callback requests below this threshold are ignored, as this minimum ensures sufficient gas for internal audits and computations required to process the callback.
:::

:::warning[Not All Requested Gas Reaches the Target]
Before invoking a callback recipient, the callback proxy sets aside gas for its own accounting once the call returns (`_extraGas`) and for settling payment if the contract owes anything (`_maxChargeGas`). Only the remainder is forwarded, so size gas limits with both deductions in mind. Delivery fails with `InsufficientGas` if too little is left to cover them.
:::

## Funding Reactive Contracts

Three options, in order of preference: hold a balance in the contract and let it settle automatically, deposit through the system contract, or transfer directly and settle manually.

### Hold a Balance and Implement pay()

The recommended approach is to keep a working balance in the contract and inherit `AbstractPayer`, which reactive contracts already do through `AbstractReactive`.

When a fee is charged and reserves are empty, the system contract calls `pay()` on the contract, asking for its entire outstanding debt. The standard implementation verifies the caller, checks the balance, and transfers the amount owed. Settlement happens inside the same transaction as the charge, so the contract never goes inactive.

:::info[Gas Budget for pay()]
The call to `pay()` is capped at `_maxChargeGas`. If a custom implementation exceeds that budget or the contract lacks funds, the call fails, a `PaymentFailure` event is emitted, and the debt remains outstanding. Keep custom payment logic minimal.
:::

### Deposit Through the System Contract

`depositTo()` credits any contract from the caller's own funds. It settles outstanding debt first, then adds the remainder to reserves. The caller pays the transaction fee.

```bash
cast send \
  --rpc-url $REACTIVE_RPC \
  --private-key $REACTIVE_PRIVATE_KEY \
  $SYSTEM_CONTRACT_ADDR "depositTo(address)" \
  $CONTRACT_ADDR \
  --value 0.1ether
  ```

This requires no cooperation from the target contract, so it is also the way to revive a third-party contract that has stalled in debt.

:::info[Always Specify the Target Contract]
Sending REACT directly to the system contract credits the sender's own address, not any contract. An externally owned account funding a contract this way credits an address that will never execute anything. Always pass the target through `depositTo()`.
:::

### Direct Transfers & coverDebt()

Funds sent straight to a reactive contract increase its balance. Converting that balance into a debt settlement requires the contract to call the system contract itself, because `pay()` accepts calls only from the system contract.

`AbstractPayer` implements the settlement logic as an internal `_coverDebt()` and leaves the decision to expose it to the contract author. To make it publicly callable, add the function to the reactive contract and make it external:

```solidity
/// @notice Settles outstanding debt from this contract's own balance.
function coverDebt() external {
    _coverDebt();
}
```

Add `onlyOwner` or any other access control if the operation should be restricted. A public version is useful for contracts serving third parties, since anyone can then fund the contract and restart it. Omitting the wrapper entirely is a valid choice.

Where the wrapper exists, fund and settle in two steps:

```bash
cast send $CONTRACT_ADDR \
  --rpc-url $REACTIVE_RPC \
  --private-key $REACTIVE_PRIVATE_KEY \
  --value 0.1ether
```

```bash
cast send \
  --rpc-url $REACTIVE_RPC \
  --private-key $REACTIVE_PRIVATE_KEY \
  $CONTRACT_ADDR "coverDebt()"
```

:::info[Funds Sent to an Indebted Contract Can Be Stranded]
A direct transfer neither settles debt nor creates reserves. If the contract exposes no way to pay the system contract from its balance, those funds can't be applied to the debt by anyone, and the contract stays inactive. Use `depositTo()` when unsure whether a contract exposes `coverDebt()`.
:::

### Reactive Contract Status

Contract status is available on [Reactscan](https://reactscan.net/).

- `active` — contract executes normally
- `inactive` — outstanding debt must be settled

Status follows debt automatically, on Reactive and on destination chains alike. When a contract's debt rises from zero, a `BlacklistContract` event is emitted and the network stops serving it. When a deposit or payment returns the debt to zero, a `WhitelistContract` event is emitted and service resumes. A contract that settles through `pay()` in the same transaction as the charge is never blacklisted at all.

## Funding Callback Contracts

The same three options apply on the destination chain, against the callback proxy rather than the system contract. The one difference is currency: callback contracts are funded in the destination chain's native token, ETH on Ethereum, BNB on BNB Chain, and so on, not in REACT.

Deposit through the callback proxy:

```bash
cast send \
  --rpc-url $DESTINATION_RPC \
  --private-key $DESTINATION_PRIVATE_KEY \
  $CALLBACK_PROXY_ADDR "depositTo(address)" \
  $CALLBACK_ADDR \
  --value 0.1ether
```

Or fund the contract directly and settle, if it exposes a `coverDebt()` wrapper:

```bash
cast send $CALLBACK_ADDR \
  --rpc-url $DESTINATION_RPC \
  --private-key $DESTINATION_PRIVATE_KEY \
  --value 0.1ether
```

```bash
cast send \
  --rpc-url $DESTINATION_RPC \
  --private-key $DESTINATION_PRIVATE_KEY \
  $CALLBACK_ADDR "coverDebt()"
```

## Querying Balances

The same three reads apply on both sides of the network: use the system
contract over `$REACTIVE_RPC` for reactive contracts, and the callback proxy over `$DESTINATION_RPC` for callback contracts.

### Balance

Retrieve the balance of a callback contract on a specific destination:

```bash
cast balance $CONTRACT_ADDR --rpc-url $DESTINATION_RPC
```

Retrieve the balance of a reactive contract on Reactive:

```bash
cast balance $CONTRACT_ADDR --rpc-url $REACTIVE_RPC
```

### Debt

Query the debt recorded by the callback proxy on a specific destination:

```bash
cast call $CALLBACK_PROXY_ADDR "debts(address)" $CONTRACT_ADDR --rpc-url $DESTINATION_RPC | cast to-dec
```

Query the debt recorded by the system contract on Reactive:

```bash
cast call $SYSTEM_CONTRACT_ADDR "debts(address)" $CONTRACT_ADDR --rpc-url $REACTIVE_RPC | cast to-dec
```

:::info[Aliases]
`debts(address)` returns the same value and is kept for compatibility with earlier tooling. New integrations should use `debt(address)`, which is part of the `IPayable` interface.
:::

### Reserves

Retrieve reserves held by the callback proxy on a specific destination:

```bash
cast call $CALLBACK_PROXY_ADDR "reserves(address)" $CONTRACT_ADDR --rpc-url $DESTINATION_RPC | cast to-dec
```

Retrieve reserves held by the system contract on Reactive:

```bash
cast call $SYSTEM_CONTRACT_ADDR "reserves(address)" $CONTRACT_ADDR --rpc-url $REACTIVE_RPC | cast to-dec
```

### Service Provider

Confirm which contract a given payer owes fees to:

```bash
cast call $CONTRACT_ADDR "_SERVICE_PROVIDER()" --rpc-url $REACTIVE_RPC
cast call $CALLBACK_ADDR "_SERVICE_PROVIDER()" --rpc-url $DESTINATION_RPC
```

This returns the system contract for reactive contracts and the callback proxy for callback contracts.

## Inspecting Callbacks

The system contract records every callback posted to a destination chain,
indexed by the hash of the reactive transaction that requested it. Because a single reactive transaction can request several callbacks, the call returns an array:

```bash
cast call $SYSTEM_CONTRACT_ADDR \
"getCallbacks(uint256)((uint256,address,uint256,uint256,uint256,bytes)[])" \
$REACTIVE_TX_HASH --rpc-url $REACTIVE_RPC
```

Each record carries the block number, the requesting reactive contract, the callback's index within the transaction, the destination chain ID, the destination transaction hash, and any error data returned by the destination contract. `err` is empty when the callback succeeded.

Validators write these records after delivery, so an empty array means no
callback has been recorded yet rather than that one failed.