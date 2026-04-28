---
title: "Lesson 4: How Subscriptions Work"
sidebar_position: 4
description: Learn how to set up and manage event subscriptions in Reactive Contracts. Covers static subscriptions in the constructor, subscription criteria and wildcards, prohibited patterns, and dynamic subscription management through callbacks.
slug: how-subscriptions-work
---

# Lesson 4: How Subscriptions Work

## Overview

Subscriptions are how a Reactive contract tells Reactive Network which events it cares about. When a matching event is emitted on an origin chain, the subscribing contract's `react()` function is called automatically.

The previous lesson covered the dual-state environment and how to detect which context your code is running in. This lesson builds on that by showing how subscriptions are configured and what rules govern how they work.

By the end of this lesson, you'll understand:

- How to set up subscriptions using the `ISubscriptionService` interface
- How wildcards and filtering criteria work
- What subscription patterns are prohibited
- How to manage subscriptions dynamically through callbacks

## Setting Up Subscriptions

Subscriptions are created using the `subscribe` method from Reactive Network's system contract. Most commonly this happens in the constructor, but subscriptions can also be added or removed at runtime. We'll cover [dynamic subscriptions](#dynamic-subscriptions) later in this lesson.

Since every Reactive contract is deployed to both Reactive Network and a private ReactVM (and the system contract only exists on Reactive Network), your subscription logic needs to be wrapped in the `if (!vm)` check covered in the previous lesson.

### ISubscriptionService Interface

The [ISubscriptionService](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/ISubscriptionService.sol) interface provides two methods (`subscribe` and `unsubscribe`) that mirror each other:

```solidity
pragma solidity >=0.8.0;

import './IPayable.sol';

interface ISubscriptionService is IPayable {
    function subscribe(
        uint256 chain_id,
        address _contract,
        uint256 topic_0,
        uint256 topic_1,
        uint256 topic_2,
        uint256 topic_3
    ) external;
    
    function unsubscribe(
        uint256 chain_id,
        address _contract,
        uint256 topic_0,
        uint256 topic_1,
        uint256 topic_2,
        uint256 topic_3
    ) external;
}
```

Both functions take the same parameters: `chain_id` (the `EIP-155` origin chain ID), `_contract` (the address of the contract that emits the event), and `topic_0` through `topic_3` (the indexed event topics to filter on).

Note that unsubscribing is an expensive operation because it requires searching for and removing the subscription. Duplicate subscriptions are allowed, but managing idempotency is your responsibility.

### IReactive Interface

The [IReactive](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IReactive.sol) interface defines a standard for Reactive contracts that can receive and handle notifications about events matching their subscriptions. It extends the [IPayer](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IPayer.sol) interface, indicating that it includes payment-related functionalities.

```solidity
pragma solidity >=0.8.0;

import './IPayer.sol';

interface IReactive is IPayer {
    struct LogRecord {
        uint256 chain_id;
        address _contract;
        uint256 topic_0;
        uint256 topic_1;
        uint256 topic_2;
        uint256 topic_3;
        bytes data;
        uint256 block_number;
        uint256 op_code;
        uint256 block_hash;
        uint256 tx_hash;
        uint256 log_index;
    }

    event Callback(
        uint256 indexed chain_id,
        address indexed _contract,
        uint64 indexed gas_limit,
        bytes payload
    );
    
    function react(LogRecord calldata log) external;
}
```

**LogRecord Struct**: A data structure representing a detailed log of an event, including:
- `chain_id`: The ID of the originating blockchain.
- `_contract`: The contract address where the event occurred.
- `topic_0` to `topic_3`: Indexed topics of the event log.
- `data`: Additional unindexed event data.
- `block_number`: The block number when the event was logged.
- `op_code`: An operation code for event categorization.
- `block_hash`: The hash of the block containing the event.
- `tx_hash`: The transaction hash that triggered the event.
- `log_index`: The index of the log within the transaction.

**Callback Event**: An event emitted to signal that a reactive contract has been triggered. It includes:
- `chain_id`: The ID of the originating blockchain.
- `_contract`: The address of the contract emitting the event.
- `gas_limit`: The maximum gas allocated for the callback.
- `payload`: The data payload sent during the callback.

**react Function**: The main entry point for processing event notifications.
- `log` (of type `LogRecord`): Contains event details.

### Subscribing in the Constructor

Here's a basic example of setting up a subscription when the contract is deployed:

```solidity
// State specific to reactive network instance of the contract
address private _callback;

// State specific to ReactVM instance of the contract
uint256 public counter;

constructor(
        address _service,
        address _contract,
        uint256 topic_0,
        address callback
    ) payable {
        service = ISystemContract(payable(_service));
        if (!vm) {
            service.subscribe(
                CHAIN_ID,
                _contract,
                topic_0,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );
        }
        _callback = callback;
    }
```

### Subscription Criteria

When configuring subscriptions, two rules apply:

**Wildcards.** Use `address(0)` to match any contract address, `uint256(0)` for any chain ID, and `REACTIVE_IGNORE` for any topic value. This lets you cast a wider net when you need to monitor a broad category of events.

**At least one concrete value.** Every subscription must include at least one specific (non-wildcard) criterion. You can't subscribe to "everything."

### Examples

#### Subscribing to All Events from a Specific Contract

Here’s how you can subscribe to all events from a specific contract at `0x7E0987E5b3a30e3f2828572Bb659A548460a3003`:

```solidity
service.subscribe(CHAIN_ID, 0x7E0987E5b3a30e3f2828572Bb659A548460a3003, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE)
```

#### Subscribing to a Specific Event Topic (Uniswap V2 Sync)

Another option is to subscribe to all Uniswap V2 Sync events with `topic_0` `0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1`:

```solidity
service.subscribe(CHAIN_ID, 0, 0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE)
```

#### Combining Parameters

You can combine these parameters to subscribe to the events of a specific contract at `0x7E0987E5b3a30e3f2828572Bb659A548460a3003` with `topic_0` `0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1`:

```solidity
service.subscribe(CHAIN_ID, 0x7E0987E5b3a30e3f2828572Bb659A548460a3003, 0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE)
```

#### Handling Multiple Events from Different Origins

To react to multiple events from different origins, you can use multiple `subscribe` calls in the constructor:

```solidity
constructor(
    address _service,
    address _contract1,
    address _contract2,
    uint256 topic_0,
    address callback
) payable {
    // Initialize the subscription service
    SubscriptionService service = SubscriptionService(payable(_service));

    if (!vm) {
        // First subscription
        service.subscribe(
            CHAIN_ID,
            _contract1,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );

        // Second subscription
        service.subscribe(
            CHAIN_ID,
            address(0),
            topic_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );

        // Add more subscriptions here as needed
    }

    // Assign the callback
    _callback = callback;
}
```

### Prohibited Subscriptions

Not everything is supported. Keep these restrictions in mind:

**No inequality matching.** Subscriptions only support strict equality. You can't filter by less than, greater than, ranges, or bitwise operations.

**No disjunction within a single subscription.** You can't say "match topic A or topic B" in one call. You can achieve similar results with multiple `subscribe()` calls, but be careful as this can lead to combinatorial explosion.

**No blanket subscriptions.** Subscribing to all events from all chains, all contracts, or an entire chain is not allowed.

**Duplicates are allowed but redundant.** Duplicate subscriptions function as a single subscription, but you're still charged for each transaction to the system contract. Preventing duplicates on-chain would be prohibitively expensive, so this is left to the developer to manage.

## Dynamic Subscriptions

Sometimes you need to add or remove subscriptions at runtime based on what's happening on-chain. Since the system contract is only accessible from Reactive Network, and event processing happens in the ReactVM, dynamic subscriptions work through callbacks: the ReactVM sends a callback to Reactive Network instance of the same contract, which then calls `subscribe()` or `unsubscribe()`.

For more on why this roundtrip is necessary, see [Lesson 3: ReactVM and the Dual-State Environment](./react-vm). The example below is based on the [Approval Magic Demo](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/approval-magic).

### Contract Setup

The contract declares its constants and state variables, then subscribes to the events that will trigger dynamic subscription changes:

```solidity
pragma solidity >=0.8.0;

import '../../../lib/reactive-lib/src/abstract-base/AbstractReactive.sol';
import './ApprovalService.sol';

contract ApprovalListener is AbstractReactive {
    uint256 private constant REACTIVE_CHAIN_ID = 0x512578;
    uint256 private constant SEPOLIA_CHAIN_ID = 11155111;
    uint256 private constant SUBSCRIBE_TOPIC_0 = 0x1aec2cf998e5b9daa15739cf56ce9bb0f29355de099191a2118402e5ac0805c8;
    uint256 private constant UNSUBSCRIBE_TOPIC_0 = 0xeed050308c603899d7397c26bdccda0810c3ccc6e9730a8a10c452b522f8edf4;
    uint256 private constant APPROVAL_TOPIC_0 = 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925;
    uint64 private constant CALLBACK_GAS_LIMIT = 1000000;

    address private owner;
    ApprovalService private approval_service;

    constructor(
        ApprovalService service_
    ) payable {
        owner = msg.sender;
        approval_service = service_;

        if (!vm) {
            service.subscribe(
                SEPOLIA_CHAIN_ID,
                address(approval_service),
                SUBSCRIBE_TOPIC_0,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );
            service.subscribe(
                SEPOLIA_CHAIN_ID,
                address(approval_service),
                UNSUBSCRIBE_TOPIC_0,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );
        }
    }
```

The constructor subscribes to two event types from the `ApprovalService` contract: subscribe requests and unsubscribe requests. When either event is detected, the contract's `react()` function handles it.

### Authorization

A modifier ensures that only authorized callers (specifically the service contract, verified against the owner's address) can trigger subscription changes on Reactive Network:

```solidity
modifier callbackOnly(address evm_id) {
        require(msg.sender == address(service), 'Callback only');
        require(evm_id == owner, 'Wrong EVM ID');
        _;
    }
```

**Conditions**:
- The `msg.sender` must be the service contract.
- The `evm_id` passed to the function must match the owner address.

**Functionality**: This ensures that only the service contract or the owner can trigger certain actions, preventing unauthorized access.

### Subscribe and Unsubscribe

These functions run on Reactive Network (`rnOnly`) and are called via callbacks from the ReactVM. They add or remove subscriptions to `APPROVAL_TOPIC_0` for a given subscriber address:

```solidity
    // Methods specific to reactive network contract instance
    function subscribe(address rvm_id, address subscriber) external rnOnly callbackOnly(rvm_id) {
        service.subscribe(
            SEPOLIA_CHAIN_ID,
            address(0),
            APPROVAL_TOPIC_0,
            REACTIVE_IGNORE,
            uint256(uint160(subscriber)),
            REACTIVE_IGNORE
        );
    }

    function unsubscribe(address rvm_id, address subscriber) external rnOnly callbackOnly(rvm_id) {
        service.unsubscribe(
            SEPOLIA_CHAIN_ID,
            address(0),
            APPROVAL_TOPIC_0,
            REACTIVE_IGNORE,
            uint256(uint160(subscriber)),
            REACTIVE_IGNORE
        );
    }
```

### Processing Events in the ReactVM

The `react()` function handles three types of incoming events and routes each one to the appropriate action via a callback:

```solidity
// Methods specific to ReactVM contract instance
    function react(LogRecord calldata log) external vmOnly {
        if (log.topic_0 == SUBSCRIBE_TOPIC_0) {
            bytes memory payload = abi.encodeWithSignature(
                "subscribe(address,address)",
                address(0),
                address(uint160(log.topic_1))
            );
            emit Callback(REACTIVE_CHAIN_ID, address(this), CALLBACK_GAS_LIMIT, payload);
        } else if (log.topic_0 == UNSUBSCRIBE_TOPIC_0) {
            bytes memory payload = abi.encodeWithSignature(
                "unsubscribe(address,address)",
                address(0),
                address(uint160(log.topic_1))
            );
            emit Callback(REACTIVE_CHAIN_ID, address(this), CALLBACK_GAS_LIMIT, payload);
        } else {
            (uint256 amount) = abi.decode(log.data, (uint256));
            bytes memory payload = abi.encodeWithSignature(
                "onApproval(address,address,address,address,uint256)",
                address(0),
                address(uint160(log.topic_2)),
                address(uint160(log.topic_1)),
                log._contract,
                amount
            );
            emit Callback(DESTINATION_CHAIN_ID, address(approval_service), CALLBACK_GAS_LIMIT, payload);
        }
    }
}
```

When a subscribe or unsubscribe event arrives, the ReactVM encodes the appropriate payload and sends a callback to itself on Reactive Network, where the `subscribe()` or `unsubscribe()` function executes with the system contract. When an approval event arrives, it encodes the approval details and sends a callback to the `ApprovalService` on the destination chain.

This pattern when ReactVM detects an event, sends a callback to Reactive Network instance, which then modifies subscriptions, is how you manage subscriptions dynamically while respecting the dual-state architecture.

## About This Course

This course is designed to give you both the theory and the hands-on experience to start building with Reactive contracts. It includes detailed lectures, code examples on GitHub, and video workshops covering everything from basic concepts to real-world deployments.

Whether you want to understand how Reactive contracts work under the hood or jump straight into building, the course adapts to either path. Explore the [use cases](../use-cases/index.md) if you want to see what's possible, or start from Module 1 to build up from the fundamentals.

Join the [Telegram](https://t.me/reactivedevs) community if you have questions or want to connect with other developers working with Reactive contracts.