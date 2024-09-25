---
title: System Contract
sidebar_position: 5
description: Explore the core functionality of the System Contract and its affiliates.
slug: /system-contract
hide_title: true
---

![System Contract](./img/system-contract.jpg)

## Overview

The system contract is a core part of the Reactive Network (RNK), responsible for managing subscriptions and acting as a callback proxy. Integrated into the genesis block, it operates with immutable code, handling essential network functions without a mutable state. Extending `CallbackProxy` and `AbstractSubscriptionService`, the system contract also manages payments and whitelisting and blacklisting of contracts.

The callback proxy operates independently on destination chains and as an integrated component within the system contract on RNK. It primarily authorizes callback senders, processes callbacks, and manages contract balances and debt with methods like `withdraw()`, `addCallbackSenders()`, `callback()`, along with internal functions for deposit and charge management.

## Callback Payments

Callback execution is tied to payment, ensuring contracts either have sufficient balance or pay immediately upon receiving a callback. Failure to pay results in the contract being blacklisted, blocking future callbacks and transactions. Debt can be cleared using the `requestPayment` method, which restores the contract’s functionalities.

### Prepayment

**Direct Transfers**: The system contract and proxies accept direct transfers for prepayment.

**Third-Party Payments**: Third parties can fund contracts using the `depositTo` method.

To fund the callback contract:

```bash
cast send $CALLBACK_ADDR --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY --value 0.1ether
```

To deposit funds into the callback proxy:

```bash
cast send --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY $CALLBACK_PROXY_ADDR "depositTo(address)" $CALLBACK_ADDR --value 0.1ether
```

:::tip[On-The-Spot Payment]
Implement the `pay()` method or inherit from `AbstractCallback` or `AbstractReactive` for on-the-spot payments.
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

## Interfaces & Abstract Contracts

### ISystemContract

Combines `IPayable` and `ISubscriptionService`, providing both payment handling and event subscription capabilities. Methods include:

- **Payment functionality** inherited from `IPayable` to manage debts and payments.
- **Event subscription functionality** inherited from `ISubscriptionService` to manage subscriptions and notifications for reactive contracts.

### ISubscriptionService

Allows reactive contracts to subscribe to and receive notifications for events that match specified criteria across chains. Methods include:

- `ping` – Determines whether the contract operates in the Reactive Network or ReactVM context.
- `subscribe` – Subscribes the contract to monitor events based on specified criteria such as chain ID, contract address, and event topics.
- `unsubscribe` – Removes the contract's active event subscriptions, which can be resource-intensive.

### IReactive

Defines the structure for reactive contracts, which receive notifications for events matching subscription criteria. Methods include:

- `react` – Handles incoming event notifications based on chain ID, contract address, topics, and event data.
- `receive` – Allows the contract to receive payments.
  
### IPayer

Defines the payment functionality for contracts, ensuring that only authorized entities can initiate payments. Methods include:

- `pay` – Facilitates payment of a specified amount, with a requirement to verify the sender.

### IPayable

Defines basic payment functionality for contracts, including debt checking and receiving payments. Methods include:

- `receive` – Enables the contract to receive payments directly to cover debts.
- `debt` – Allows reactive contracts to query their outstanding debt.

:::info[Abstract Contracts]
Abstract contracts reduce boilerplate by incorporating common functionalities. They may change before production deployment.
:::

### AbstractReactive

Handles the distinction between the Reactive Network and ReactVM environments, enforcing conditions based on the environment and integrating with system contracts. Methods include:

- `rnOnly` – Restricts access to reactive network environments.
- `vmOnly` – Placeholder modifier for VM-specific access.
- `sysConOnly` – Ensures that only system contracts can invoke certain functions.
- `detectVm` – Detects whether the contract is running in a VM or Reactive Network context.

### AbstractPayer

Manages payment operations for contracts, ensuring that only authorized senders can trigger payments. Methods include:

- `pay` – Facilitates payment to the sender if authorized.
- `coverDebt` – Pays off any outstanding debt to the vendor.
- `_pay` – Handles internal payment logic and ensures sufficient balance for transactions.

### AbstractPausableReactive

Manages pausable event subscriptions for reactive contracts, allowing the owner to pause and resume event monitoring. Methods include:

- `pause` – Unsubscribes from all active event subscriptions and pauses the contract.
- `resume` – Resubscribes to all paused event subscriptions and resumes contract functionality.
- `onlyOwner` – Restricts access to functions only to the contract owner.
  
### AbstractCallback

An abstract base for managing callback-related functions with restricted access to a designated RVM ID. Methods include:

- `rvmIdOnly` – Ensures that only authorized RVM IDs can interact with specific functions.
- `constructor` – Sets the callback sender and initializes the RVM ID.

### AbstractSubscriptionService

Provides an event subscription system for reactive contracts and allows contracts to subscribe to events based on criteria such as chain ID, contract address, and topics. Methods include:

- `subscribe` – Registers a contract to receive notifications for events matching the provided criteria.
- `unsubscribe` – Removes an active subscription based on matching criteria.
- `ping` – Verifies whether the contract is running in a specific reactive context.

## Most Common Errors Across Contracts

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