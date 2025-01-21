---
title: System Contract
sidebar_position: 5
description: Explore the core functionality of the System Contract and its affiliates.
slug: /system-contract
hide_title: true
---

![System Contract](./img/system-contract.jpg)

## Overview

The Reactive Network’s key operations are managed by three core contracts:

[System Contract](https://github.com/Reactive-Network/system-smart-contracts/blob/main/src/SystemContract.sol) oversees:
- Payments: Handles service payments for reactive contracts.
- Access Control: Manages contract whitelisting/blacklisting.
- Cron Events: Triggers periodic block interval actions.

[Callback Proxy](https://github.com/Reactive-Network/system-smart-contracts/blob/main/src/CallbackProxy.sol) ensures interactions with:
- Callback Management: Restricted to authorized senders.
- Payment & Reserves: Manages deposits, reserves, and debts.
- Gas Adjustment & Kickbacks: Calculates gas prices and rewards originators.
- Access Control: Tracks authorized contracts, emitting whitelist/blacklist updates.

[AbstractSubscriptionService](https://github.com/Reactive-Network/system-smart-contracts/blob/main/src/AbstractSubscriptionService.sol) manages event subscriptions with:
- Flexible Criteria: Subscribes/unsubscribes based on chain ID, address, or topics.
- Recursive Tracking: Supports complex criteria structures.
- Wildcard Support: Uses `REACTIVE_IGNORE` for broader matches.
- Event Emissions: Tracks subscription updates, including deployer events.

## Callback Payments

Callback execution is tied to payment, ensuring contracts either have sufficient balance or pay immediately upon receiving a callback. Failure to pay results in the contract being blacklisted, blocking future callbacks and transactions.

### Direct Transfers

To transfer funds directly to your callback contract, use the following command. This sends 0.1 ether to the callback contract on the destination chain:

```bash
cast send $CALLBACK_ADDR --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY --value 0.1ether
```

Funding your reactive contract is necessary, too. Ensure the contract's status is `active` on [Reactive Scan](https://kopli.reactscan.net/). A direct payment can be done like so:

```bash
cast send $CONTRACT_ADDR --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY --value 0.1ether
```

### Covering Debt

Should your contract ever be in debt (`inactive`), run the `coverDebt()` method. It verifies whether the contract has any debt and sufficient funds to pay it off. If both conditions are met, the contract will automatically settle its debt using its own funds.

```bash
cast send --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY $CALLBACK_ADDR "coverDebt()"
```

### Depositing Funds to Callback Proxy

The `depositTo()` method allows you to transfer funds to a callback contract through the `Callback Proxy`. The transaction fee is paid by the EOA address whose private key signs the transaction. Since the interaction occurs directly between the user's EOA and the system contract (or callback proxy), the user contract remains unaware of the transaction. The following request sends 0.1 ether to the callback contract on the destination chain:

```bash
cast send --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY $CALLBACK_PROXY_ADDR "depositTo(address)" $CALLBACK_ADDR --value 0.1ether
```

:::tip[On-The-Spot Payment]
Implement the `pay()` method or inherit from `AbstractPayer` for on-the-spot payments. `Callback Proxy` triggers the `pay()` method when a callback puts the contract in debt. The standard implementation verifies the caller is the proxy, checks for sufficient funds, and then settles the debt.
:::

### Checking Balance and Debt

To check the balance of a contract on the Reactive Network, use the following command:

```bash
cast balance --rpc-url $REACTIVE_RPC $CONTRACT_ADDR
```

To check a contract's debt on the destination chain, run this command:

```bash
cast call --trace --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY $CALLBACK_PROXY_ADDR "debts(address)" $CONTRACT_ADDR
```

To check a contract's debt on the Reactive Network, run the following command:

```bash
cast call --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY $SYSTEM_CONTRACT_ADDR "debt(address)" $CONTRACT_ADDR
```

:::info[On Debt Settlement]
You might catch the `Callback target currently in debt` error. Remember that the funds to cover the debt might be held in the user's callback contract account instead of `Callback Proxy`. When the callback contract transfers these funds to the proxy, it triggers the `receive()` function, closing the debt.
:::

### Callback Pricing

The current pricing formula incorporates dynamic block base fees. The callback price $$p_{callback}$$ is calculated as follows:

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