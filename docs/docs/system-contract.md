---
title: System Contract
sidebar_position: 5
description: Explore the core functionality of the System Contract and its affiliates.
slug: /system-contract
hide_title: true
---

![System Contract](./img/system-contract.jpg)

## Overview

The [System Contract](https://github.com/Reactive-Network/system-smart-contracts/blob/main/src/SystemContract.sol) is responsible for managing subscriptions on the Reactive Network (RNK), acting as a callback proxy contract. Integrated into the genesis block, it operates with immutable code, handling essential network functions without a mutable state. Extending `CallbackProxy` and `AbstractSubscriptionService`, the system contract also manages payments, whitelisting and blacklisting of contracts.

The [Callback Proxy](https://github.com/Reactive-Network/system-smart-contracts/blob/main/src/CallbackProxy.sol) operates independently on destination chains and as an integrated part within the system contract on RNK. It primarily authorizes callback senders, processes callbacks, and manages contract balances and debt with methods like `withdraw()`, `addCallbackSenders()`, `callback()`, along with internal functions for deposit and charge management.

## Callback Payments

Callback execution is tied to payment, ensuring contracts either have sufficient balance or pay immediately upon receiving a callback. Failure to pay results in the contract being blacklisted, blocking future callbacks and transactions.

### Direct Transfers

To transfer funds directly to your callback contract, use the following command. This sends 0.1 ether to the callback contract on the destination chain:

```bash
cast send $CALLBACK_ADDR --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY --value 0.1ether
```

Funding your reactive contract is necessary, too. Ensure the contract's status is `active` on [Reactive Scan](https://kopli.reactscan.net/). A direct payment can be done like so:

```bash
cast send $REACTIVE_CONTRACT_ADDR --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY --value 0.1ether
```

### Covering Debt

Should your contract ever be in debt, run the `coverDebts()` method. It verifies whether the contract has any debt and sufficient funds to pay it off. If both conditions are met, the contract will automatically settle its debt using its own funds.

```bash
cast send --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY $CALLBACK_ADDR "coverDebt()"
```

### Depositing Funds to Callback Proxy

You can use the `depositTo()` method to transfer funds to the callback contract via `Callback Proxy`, with the transaction fee paid by the EOA address whose private key signs the transaction. The following request sends 0.1 ether to the callback contract on the destination chain:

```bash
cast send --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY $CALLBACK_PROXY_ADDR "depositTo(address)" $CALLBACK_ADDR --value 0.1ether
```

:::tip[On-The-Spot Payment]
Implement the `pay()` method or inherit from `AbstractPayer` for on-the-spot payments. `Callback Proxy` triggers `pay()` when a callback puts the contract in debt. The standard implementation verifies the proxy as the caller, ensures sufficient funds are available, and then settles the debt.
:::

### Checking Balance and Debt

To check the balance of a contract on the Reactive Network, use the following command:

```bash
cast balance --rpc-url $REACTIVE_RPC $REACTIVE_CONTRACT_ADDR
```

To check the debt status of a specific contract on the destination chain, run this command:

```bash
cast call --trace --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY $CALLBACK_PROXY_ADDR "debts(address)" $CONTRACT_ADDR
```

:::info[On Debt Settlement]
You might catch the `Callback target currently in debt` error. Remember that the funds to cover the debt might be held in the user's callback contract account instead of `Callback Proxy`. When the callback contract transfers these funds to the proxy, it triggers the `receive()` function, closing the debt.
:::

### Callback Pricing

The current pricing formula, subject to change, is simplified for testing. It is set at 1 wei per gas unit but will later incorporate dynamic block base fees. The callback price $$p_{callback}$$ is calculated as follows:

$$
p_{callback} = p_{orig} ⋅ C ⋅ (g_{callback} + K)
$$

Where:

- $$p_{orig}$$: The base gas price, determined by `tx.gasprice` and `block.basefee`.
- $$C$$: A pricing coefficient specific to the destination network.
- $$g_{callback}$$: The gas used for the callback.
- $$K$$: A fixed gas surcharge for the destination network.

:::info[Reactive Transaction Payments]
Reactive Transactions share the same payment mechanism as RNK's callback payments, with a common balance. Separate contracts may be used for reactive and callback functionalities.
:::

### Gas / Tokenomics

Gas usage and gas limits are tracked for all reactive transactions. On the Reactive Network (RNK), users are charged based on the formula: Gas Used × Gas Price = Total REACT Charge. This amount is deducted from the user's REACT token balance. Certain transactions may involve a `value` field, such as contract deployment or fund transfers. In these cases, the specified value (in REACT) is deducted from the user's balance.

## Most Common Errors 

**Unauthorized Access**: Modifier-related errors (e.g., `onlyOwner`, `rvmIdOnly`, `sysConOnly`) prevent unauthorized users from accessing specific contract functions. Reverts with 'Unauthorized' or 'Authorized X only' if the caller does not meet required conditions.

**Incorrect Address or Contract Binding**: Misconfigured addresses like `service`, `vendor`, or `rvm_id` can cause contract failures, as external interactions depend on these addresses being correct.

**Uninitialized Variables**: If addresses like `rvm_id` or `vendor` are uninitialized, contracts can restrict access or fail during external calls. Uninitialized variables can also cause authorization failures.

**Transfer/Payment Failures**: Errors like 'Insufficient funds' or 'Transfer failed' occur if the contract doesn’t have enough funds in the balance or if `.call` to external contracts fails.

**Already Paused or Not Paused State**: Functions like `pause` or `resume` in pausable contracts may revert if the contract is already in the required state, either paused or unpaused, leading to redundant or unnecessary actions.

**Unsuccessful External Calls**: Calls to external contracts like `subscribe`, `unsubscribe`, or `pay` can silently fail due to reentrancy, gas issues, or misconfigured target contracts.

**Expensive Gas Operations**: Operations involving loops, recursion, or multiple subscriptions (e.g., in `unsubscribe` or `findSubscribersRecursively`) may result in high gas costs or out-of-gas errors.

**Duplicate or Invalid Subscriptions**: Contracts that handle subscriptions may fail to check for duplicates or invalid entries (e.g., all `REACTIVE_IGNORE`), leading to inefficiencies or unexpected behavior.

**Debt and Payment Issues**: Insufficient payment or improper debt calculation can block further contract operations like resuming subscriptions, processing payments, or avoiding callback failures.

**Modifier Conflicts or Context Errors**: Modifiers like `rnOnly`, `vmOnly`, or `sysConOnly` can cause errors if called in the wrong context, particularly in systems involving reactive virtual machines or system contracts.