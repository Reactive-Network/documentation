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
cast send $CALLBACK_ADDR --rpc-url $DESTINATION_CHAIN_RPC --private-key $DESTINATION_CHAIN_PRIVATE_KEY --value 0.1ether
```

After that, run the `coverDebts` method, which checks if the contract has debts and sufficient funds to pay them. If both conditions are met, the contract will automatically settle its debts using its own funds.

```bash
cast send --rpc-url $DESTINATION_CHAIN_RPC --private-key $DESTINATION_CHAIN_PRIVATE_KEY $CALLBACK_ADDR "coverDebt()"
```

### Depositing Funds to Callback Proxy

Alternatively, you can use the `depositTo` method to transfer funds to the callback contract via `Callback Proxy`, with the transaction fee paid by the EOA address whose private key signs the transaction. The following request sends 0.1 ether to the callback contract on the destination chain.

```bash
cast send --rpc-url $DESTINATION_CHAIN_RPC --private-key $DESTINATION_CHAIN_PRIVATE_KEY $CALLBACK_PROXY_ADDR "depositTo(address)" $CALLBACK_ADDR --value 0.1ether
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
cast call --trace --rpc-url $DESTINATION_CHAIN_RPC --private-key $DESTINATION_CHAIN_PRIVATE_KEY $CALLBACK_PROXY_ADDR "debts(address)" $CONTRACT_ADDR
```

:::info[On Debt Settlement]
You might catch the `Callback target currently in debt` error. Remember that the funds to cover the debt might be held in the user's callback contract account instead of `Callback Proxy`. When the callback contract transfers these funds to the proxy, it triggers the `receive()` function, closing the debt.
:::

### Callback Pricing

The current pricing formula, subject to change, is simplified for testing. It is set at 1 wei per gas unit but will later incorporate dynamic block base fees. The callback price $$p_{callback}$$ is calculated as follows:

$$
p_{callback} = (p_{orig} + 1)(C + c_{fail})(g_{callback} + K)
$$

Where:

- $$p_{orig}$$ is the base gas price, considering `tx.gasprice` and `block.basefee`.
- $$C$$ is a pricing coefficient for the destination network.
- $$c_{fail}$$ is 1 if the callback reverted; otherwise, 0.
- $$g_{callback}$$ is the gas used for the callback.
- $$K$$ is a fixed gas surcharge for the destination network.

This formula is intended for the testnet stage and may evolve.

:::info[Reactive Transaction Payments]
Reactive Transactions will share the same payment mechanism as RNK's callback payments, with a common balance. Separate contracts may be used for reactive and callback functionalities. This feature is not yet implemented, as it is not critical for the hackathon phase.
:::

### Gas / Tokenomics

1. Gas usage and gas limits are tracked for all system transactions.
2. On the Reactive Network (RNK), users are charged based on the formula: Gas Used × Gas Price = Total REACT Charge. This amount is deducted from the user's REACT token balance.
3. Currently, RVM transactions don't incur gas charges (subject to change).
4. Certain transactions may involve a `value` field, such as contract deployment or fund transfers. In these cases, the specified value (in REACT) is deducted from the user's balance.
5. RVM tokenomics is still under development; for now, all transactions are free of gas charges.

## Abstract Contracts & Interfaces

Go to [Reactive Library](https://github.com/Reactive-Network/reactive-lib) to clone the project and install abstract contracts and interfaces necessary for reactive functionality.

:::info[Abstract Contracts]
Abstract contracts reduce boilerplate by incorporating common functionalities. They may change before production deployment.
:::

### [AbstractCallback](https://github.com/Reactive-Network/reactive-lib/blob/main/src/abstract-base/AbstractCallback.sol)

An abstract base for managing callback-related functions with restricted access to a designated RVM ID.

- `constructor()` – Sets the callback sender and initializes the RVM ID.
- `rvmIdOnly` modifier – Ensures that only authorized RVM IDs can interact with specific functions.

### [AbstractPausableReactive](https://github.com/Reactive-Network/reactive-lib/blob/main/src/abstract-base/AbstractPausableReactive.sol)

Manages pausable event subscriptions for reactive contracts, allowing the owner to pause and resume event monitoring.

- `pause()` – Unsubscribes from all active event subscriptions and pauses the contract.
- `resume()` – Resubscribes to all paused event subscriptions and resumes contract functionality.

### [AbstractPayer](https://github.com/Reactive-Network/reactive-lib/blob/main/src/abstract-base/AbstractPayer.sol)

Manages payment operations for contracts.

- `pay()` – Facilitates payment to the sender if authorized.
- `coverDebt()` – Pays off any outstanding debt to the vendor.

### [AbstractReactive](https://github.com/Reactive-Network/reactive-lib/blob/main/src/abstract-base/AbstractReactive.sol)

Handles the distinction between the Reactive Network, ReactVM, and System Contract contexts.

- `rnOnly` modifier – Ensures the `vm` variable is `false`; if `vm` is `true`, it reverts with 'Reactive Network only'.
- `vmOnly` modifier – Restricts access to functions for ReactVM instances based on the `vm` variable.
- `sysConOnly` modifier – Validates that `msg.sender` matches the `service` contract's address; if not, it reverts with `System contract only'.

### [AbstractSubscriptionService](https://github.com/Reactive-Network/system-smart-contracts/blob/main/src/AbstractSubscriptionService.sol)

Provides an event subscription system for reactive contracts and allows contracts to subscribe to events based on criteria such as chain ID, contract address, and topics.

- `ping()` – Determines whether the contract is in the RN or RVM context (subject to change).
- `subscribe()` – Registers a contract to receive notifications for events matching the provided criteria.
- `unsubscribe()` – Removes an active subscription based on matching criteria.

### [IPayable](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IPayable.sol)

Defines basic payment functionality for contracts, including debt checking and receiving payments.

- `receive()` – Enables the contract to receive payments directly to cover debts.
- `debt()` – Allows reactive contracts to query their outstanding debt.

### [IPayer](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IPayer.sol)

Defines the payment functionality for contracts.

- `pay()` – Facilitates payment of a specified amount, with a requirement to verify the sender.

### [IReactive](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IReactive.sol)

Defines the structure for reactive contracts, which receive notifications for events matching subscription criteria.

- `react()` – Handles incoming event notifications based on chain ID, contract address, topics, and event data.
- `receive()` – Allows the contract to receive payments.

### [ISubscriptionService](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/ISubscriptionService.sol)

Allows reactive contracts to subscribe to and receive notifications for events that match specified criteria across chains.

- `ping()` – Determines whether the contract operates in the Reactive Network or ReactVM context.
- `subscribe()` – Subscribes the contract to monitor events based on specified criteria such as chain ID, contract address, and event topics.
- `unsubscribe()` – Removes the contract's active event subscriptions, which can be resource-intensive.

### [ISystemContract](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/ISystemContract.sol)

Combines `IPayable` and `ISubscriptionService`, providing both payment handling and event subscription capabilities. Payment functionality inherited from `IPayable` to manage debts and payments. Event subscription functionality inherited from `ISubscriptionService` to manage subscriptions and notifications for reactive contracts.

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