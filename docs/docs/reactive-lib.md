---
title: Reactive Library
sidebar_position: 6
description: Explore the core functionality of Reactive library.
slug: /reactive-library
hide_title: true
---

![Reactive Library](./img/reactive-lib.jpg)

## Overview

[Reactive Library](https://github.com/Reactive-Network/reactive-lib) is a set of abstract contracts and interfaces that reduce boilerplate by integrating common functionalities. Run the following command in your project to install the library: 

```bash
forge install Reactive-Network/reactive-lib
```

## [Abstract Contracts](https://github.com/Reactive-Network/reactive-lib/tree/main/src/abstract-base)

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

## [Interfaces](https://github.com/Reactive-Network/reactive-lib/tree/main/src/interfaces)

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