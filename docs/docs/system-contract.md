---
title: System Contract
sidebar_position: 5
description: Explore the core functionality of the System Contract and its affiliates.
slug: /system-contract
hide_title: true
---

![System Contract](./img/system-contract.jpg)

## Overview

The system contract is a core contract responsible for managing subscriptions and acting as a callback proxy within the Reactive Network (RNK). It is embedded into the genesis block, meaning it contains only code with no mutable state.

## Callback Proxy

Callback Proxy operates as a standalone contract on destination chains and as an integrated component within the System Contract on the Reactive Network. Its primary role is to manage the authorization of callback senders and to handle the processing of callbacks.

## Callback Payments

The system is designed to ensure that callback execution is closely tied to payment. Contracts must either have sufficient funds in their balance or pay immediately upon receiving a callback to avoid being blacklisted.

If the contract fails to pay (either through balance or direct payment), it is blacklisted. This means that future callbacks and reactive transactions to this contract will be blocked. The blacklisted contract or another contract can cover the debt by making a payment using the `requestPayment` method in the system contract. Once the debt is covered, the contract is automatically whitelisted, and all its callback and transaction functionalities are restored.

### Prepayment

- **Direct Transfers**: Proxies, including the system contract, can accept direct transfers for prepayment.
- **Third-Party Payments**: The `depositTo` method allows third parties to contribute funds on behalf of a contract.

### On-the-spot Payment

Implement the `pay()` method within callback and reactive contracts or inherit from `AbstractCallback` or `AbstractReactive` to facilitate on-the-spot payments.

### Callback Pricing

The current pricing formula is a preliminary model intended for testing and subject to change. It is simplified with a placeholder value of 1 wei per gas unit but will evolve to integrate dynamic block base fees in future updates. The callback price $$p_{callback}$$ is computed using the following formula:

$$
p_{callback} = (p_{orig} + 1)(C + c_{fail})(g_{callback} + K)
$$

Where:

- $$p_{orig}$$ is the base gas price for the callback, computed as the maximum of `tx.gasprice` and `block.basefee`;
- $$C$$ is the destination network-dependent pricing coefficient;
- $$c_{fail}$$ is 1 if the callback reverted, and 0 otherwise;
- $$g_{callback}$$ is the total amount of gas spent on the callback;
- $$K$$ is the destination network-dependent fixed gas surcharge.

This formula is intended for the testnet stage and may be revised in future phases.

## Reactive Transaction Payments

Paying for Reactive Transactions will use the same mechanism as RNK's callback payments, sharing a common balance. However, separate contracts can be used for reactive and callback functionalities if needed. Not yet implemented, as it is not critical for the hackathon phase.

## Contracts

### ISystemContract

Defines the interface that the system contract implements, combining the functionality of `IPayable` and `ISubscriptionService`. Includes methods for debt management (`IPayable`) and event subscription management (`ISubscriptionService`).

### ISubscriptionService

Manages event subscriptions for reactive contracts, allowing them to receive notifications for specific events. Includes the following methods:

- `subscribe()`: Allows a reactive contract to subscribe to events based on specific criteria (chain ID, contract, topics).
- `unsubscribe()`: Removes subscriptions based on the provided criteria.
  
### IReactive

Defines the interface for reactive contracts that interact with the system contract. Includes the following methods:

- `react()`: The entry point for handling new event notifications.
- Defines the `Callback` event for callbacks from the system contract.
  
### IPayer

Provides a basic interface for contracts that can handle payments. Includes the following method:

- `pay()`: A function that reactive contracts must implement to pay debts when charged.

### IPayable

Defines methods for debt management in contracts. Includes the following method:

- `debt()`: Allows querying the outstanding debt of a contract. 

## Abstract Contracts

These base contracts are designed to reduce boilerplate by incorporating common functionality. They are not necessarily production-grade and may undergo changes.

### AbstractReactive

Serves as a base contract for reactive contracts, providing standard modifiers and functions that ensure proper interaction with the Reactive Network. Includes the following key features:

- **Modifiers**: Includes modifiers like `onlyReactive` and `onlySystem` to check that certain functions can only be called within the Reactive Network or by the system contract.
- **System Address Handling**: Ensures the correct address of the system contract is used for secure operations.

### AbstractPayer

It implements the logic required for managing payments and debts within the callback system. Includes the following key features:

- **Payment Handling**: Provides foundational payment and debt management logic that other contracts, like `CallbackProxy`, can extend.
- **Debt Management**: Includes functions to manage the outstanding debts of reactive contracts, ensuring they are charged appropriately.

### AbstractPausableReactive

Extends `AbstractReactive` to add functionality that allows reactive contracts to be paused, which is particularly useful for managing subscriptions or other time-sensitive operations. Includes the following key features:

- **Pausing Mechanism**: Adds functions to pause and unpause contract operations, which can be critical in emergency situations or when maintenance is required.
  
### AbstractCallback

Inherits from `AbstractPayer` and provides the base logic for processing callbacks within the Reactive Network. Includes the following key features:

- **Callback Management**: Implements standard functionality for handling callbacks, including checks for the Reactive Virtual Machine (RVM) ID and ensuring that callbacks are processed securely.
- **Extensibility**: This abstract contract is designed to be extended by other contracts that need to handle callbacks in a standardized manner.
