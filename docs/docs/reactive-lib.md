---
title: Reactive Library
sidebar_position: 6
description: Explore the core functionality of Reactive library – abstract contracts and interfaces
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
 
In `AbstractCallback`, the constructor accepts the Callback Proxy address (`_callback_sender`), which is assigned to a variable called `vendor`.

```solidity
constructor(address _callback_sender) {
        rvm_id = msg.sender;
        vendor = IPayable(payable(_callback_sender));
    }
```

This `vendor` variable is of type `IPayable` and is used within `AbstractPayer` to interact with the payable functionality. 

```solidity
function coverDebt() external {
        uint256 amount = vendor.debt(address(this));
        _pay(payable(vendor), amount);
    }
```

In `AbstractReactive`, `vendor` is automatically assigned the address of the system contract (`SERVICE_ADDR`), as it is predefined.

```solidity
abstract contract AbstractReactive is IReactive, AbstractPayer {
    uint256 internal constant REACTIVE_IGNORE = 0xa65f96fc951c35ead38878e0f0b7a3c744a6f5ccc1476b313353ce31712313ad;
    ISystemContract internal constant SERVICE_ADDR = ISystemContract(payable(0x0000000000000000000000000000000000fffFfF));
    
    bool internal vm;

    ISystemContract internal service;

    constructor() {
        vendor = service = SERVICE_ADDR;
        addAuthorizedSender(address(SERVICE_ADDR));
        detectVm();
    }
```

### [AbstractCallback](https://github.com/Reactive-Network/reactive-lib/blob/main/src/abstract-base/AbstractCallback.sol)

- Extends `AbstractPayer`.
- Manages a callback system where a specific `rvm_id` and a `vendor` are initialized in the constructor.
- Ensures that only an authorized RVM ID can invoke certain functionality via the `rvmIdOnly` modifier.
- Includes authorization for senders by interacting with `AbstractPayer`.

### [AbstractPausableReactive](https://github.com/Reactive-Network/reactive-lib/blob/main/src/abstract-base/AbstractPausableReactive.sol)

- Combines `IReactive` and `AbstractReactive` functionalities to manage pausable subscriptions.
- Includes a `Subscription` struct representing event subscription criteria like chain ID, contract address, and topics.
- Implements a `pause` function to unsubscribe from all active subscriptions and a `resume` function to reactivate them.
- Restricts access to pausing and resuming functionality to the contract owner, using the `onlyOwner` modifier.

### [AbstractPayer](https://github.com/Reactive-Network/reactive-lib/blob/main/src/abstract-base/AbstractPayer.sol)

- Implements basic payment-related functionality for contracts.
- Manages a mapping of authorized senders and provides methods to pay an amount or cover a vendor's debt.
- Ensures that only authorized senders can initiate payments using the `authorizedSenderOnly` modifier.
- Provides methods to add and remove authorized senders.

### [AbstractReactive](https://github.com/Reactive-Network/reactive-lib/blob/main/src/abstract-base/AbstractReactive.sol)

- Extends `AbstractPayer` and implements `IReactive`.
- Includes functionality for interacting with the Reactive Network and system contracts.
- Introduces two operational modes: `vm` for reactVM and non-`vm` for then Reactive Network.
- Ensures certain functions can only be executed in specific modes using `vmOnly` and `rnOnly` modifiers.
- Provides an internal mechanism to detect the execution context (`detectVm`).

## [Interfaces](https://github.com/Reactive-Network/reactive-lib/tree/main/src/interfaces)

### [IPayable](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IPayable.sol)

Defines essential payment operations for contracts:

- Accepting Ether through the `receive` function.
- Checking outstanding debt for reactive contracts.

### [IPayer](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IPayer.sol)

Provides a minimal interface for payment functionality:

- A `pay` function that allows contracts to pay a specified amount.
- A fallback `receive` function to accept Ether.

### [IReactive](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IReactive.sol)

Specifies an interface for reactive contracts that respond to event notifications:

- `react` function as an entry point to handle new event notifications.
- `LogRecord` struct defining metadata for logged events, including chain ID, contract address, topics, and transaction details.
- `Callback` event for emitting notifications about matched subscriptions.

### [ISubscriptionService](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/ISubscriptionService.sol)

Provides an interface for managing event subscriptions:

- `subscribe` function to register interest in specific events across chains, contracts, and topics.
- `unsubscribe` function to remove active subscriptions based on matching criteria.

### [ISystemContract](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/ISystemContract.sol)

- Combines `IPayable` and `ISubscriptionService` functionalities.
- Represents the system-level contract that coordinates payment and subscription services for reactive applications.