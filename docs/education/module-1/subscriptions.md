---
title: "Lesson 4: How Subscriptions Work"
sidebar_position: 4
description: Understand how to implement subscriptions in the constructor of reactive smart contracts and how to manage subscriptions dynamically using callbacks to destination chains 
slug: how-subscriptions-work
---

# Lesson 4: How Subscriptions Work

## Overview

In the previous lesson, we covered the basic differences between the Reactive Network and ReactVM. In this one, we will dive into subscriptions, a key feature that allows RSCs to automatically respond to events emitted by other contracts. When these events occur, the subscribing contract can automatically execute predefined logic.

By the end of this article, you will learn to:

* Configure and manage subscriptions both statically and dynamically.
* Handle subscription and unsubscription events within your smart contracts.
* Recognize the limitations and best practices for using subscriptions in Reactive Smart Contracts.

## How to Implement Subscriptions

In reactive contracts, subscriptions are set up using the `subscribe` method from the Reactive Network’s system contract. Typically, this is done in the constructor to initialize subscriptions, though they can also be managed dynamically. We’ll discuss [dynamic subscriptions](./how-subscriptions-work#dynamic-subscriptions) closer to the end of this article.

The reactive contract must also handle reverts due to deployments on both the Reactive Network, which has the system contract, and their deployer's private ReactVM, where the system contract is not present.

### ISubscriptionService Interface

The [ISubscriptionService](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/ISubscriptionService.sol) interface serves as an event subscription service for reactive contracts that can use this service to subscribe to specific events based on certain criteria and receive notifications when those events occur.

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

The parameters of both functions mirror each other:
- `chain_id`: A `uint256` representing the `EIP155` source chain ID for the event.
- `_contract`: The address of the origin chain contract that emitted the event.
- `topic_0`, `topic_1`, `topic_2`, `topic_3`: The topics of the event, which are `uint256` values.

Unsubscribing is an expensive operation due to the necessity of searching and removing subscriptions. Duplicate or overlapping subscriptions are allowed, but clients must ensure idempotency.

### IReactive Interface

The [IReactive](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IReactive.sol) interface defines a standard for reactive contracts that can receive and handle notifications about events matching their subscriptions. It extends the [IPayer](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IPayer.sol) interface, indicating that it includes payment-related functionalities.

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

### Constructor Subscribtion

Here’s how you can subscribe in the constructor:

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

When configuring subscriptions in reactive contracts, you should adhere to the following rules:

- Wildcard Usage: Use `address(0)` to indicate filtering by any contract address, `uint256(0)` to indicate any chain ID, and `REACTIVE_IGNORE` for topics to filter by any topic.

- Concrete Values: At least one criterion must be a specific value to ensure meaningful subscriptions.

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

- **Non-Equality Operations**: Subscriptions can’t match event parameters using less than (\<), greater than (\>), range, or bitwise operations. Only strict equality is supported.

- **Complex Criteria Sets**: Subscriptions can’t use disjunction or sets of criteria within a single subscription. While calling the `subscribe()` method multiple times can achieve similar results, it may lead to combinatorial explosion.

- **Single Chain and All Contracts**: Subscribing to events from all chains or all contracts simultaneously is not allowed. Subscribing to all events from only one chain is also prohibited, as it is considered unnecessary.

- **Duplicate Subscriptions**: While duplicate subscriptions are technically allowed, they function as a single subscription. Users are charged for each transaction sent to the system contract. Preventing duplicates in the system contract is costly due to EVM storage limitations, so duplicate subscriptions are permitted to keep costs manageable.

## Dynamic Subscriptions

Reactive contracts can dynamically manage their subscriptions based on incoming events. Since the system contract responsible for managing subscriptions is only accessible from the Reactive Network, the ReactVM's contract copy handles these operations and communicates with the Reactive Network using callbacks. You can read more on that in [ReactVM and Reactive Network As a Dual-State Environment](./react-vm). Below is an example of how you can make a dynamic subscription, based on the [Approval Magic Demo](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/approval-magic).

### Imports and Initialization

Initialize the contract by declaring constants and variables that will be used throughout the contract:

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
```


**Constants**:
- `REACTIVE_CHAIN_ID`: Represents the ID of the Reactive network.
- `SEPOLIA_CHAIN_ID`: Represents the Sepolia test network.
- `SUBSCRIBE_TOPIC_0`, `UNSUBSCRIBE_TOPIC_0`, `APPROVAL_TOPIC_0`: Topics used to identify the different types of actions (subscription, unsubscription, and approval) in the Reactive Network.
- `CALLBACK_GAS_LIMIT`: The maximum gas allowed for callback operations.

**State Variables**:
- `owner`: The address of the contract owner, typically the one who deployed the contract.
- `approval_service`: An instance of the ApprovalService contract, used to manage subscription-related operations.

### Constructor

The constructor sets up the contract's initial state, including registering for the relevant subscription and unsubscription events.

```solidity
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

**Constructor Parameters**:
- `service_`: The address of the `ApprovalService` contract to interact with for subscription management.

**Initialization**:
- `owner` is set to the address that deploys the contract.
- `approval_service` is set to the provided `ApprovalService` contract instance.
- If the environment is not `vm` instance, the constructor subscribes to the relevant topics (subscription and unsubscription) by calling `service.subscribe` for both `SUBSCRIBE_TOPIC_0` and `UNSUBSCRIBE_TOPIC_0`.

### Authorization

This modifier restricts the execution of certain functions to only authorized callers (the service contract and the owner).

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

### Subscribing & Unsubscribing

These functions allow the contract to subscribe or unsubscribe a subscriber address to/from the `APPROVAL_TOPIC_0` in the Reactive Network.

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

**Parameters**:
- `rvm_id`: The ID of the reactive virtual machine (RVM).
- `subscriber`: The address that will be subscribed or unsubscribed.

**Operations**:
- `subscribe`: Registers a subscriber to the `APPROVAL_TOPIC_0`.
- `unsubscribe`: Removes a subscriber from the `APPROVAL_TOPIC_0`.

### react Function & Logic

The function processes incoming log records from the ReactVM and executes different actions based on the topic in the log.

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
            emit Callback(SEPOLIA_CHAIN_ID, address(approval_service), CALLBACK_GAS_LIMIT, payload);
        }
    }
}
```

**Log Processing**:
- Subscribe Logic: If the log's `topic_0` matches the `SUBSCRIBE_TOPIC_0`, the function encodes a payload for the `subscribe()` method and emits a callback.
- Unsubscribe Logic: If the log's `topic_0` matches the `UNSUBSCRIBE_TOPIC_0`, the function encodes a payload for the `unsubscribe()` method and emits a callback.
- Approval Logic: For any other log, it decodes the approval amount and creates a payload for the `onApproval` method, then emits a callback to the `approval_service` on Sepolia.

**Callback Emission**: The function uses the emit `Callback` statement to send the appropriate payload and trigger the corresponding action on the Reactive chain.

## Conclusion

In this article, we’ve explored the use of subscriptions in Reactive Smart Contracts, a fundamental feature that enables automatic responses to events from other contracts. Key takeaways include:

- **Subscription Setup:** Subscriptions are established using the `subscribe` method from the Reactive Network’s system contract. This can be done statically in the constructor or managed dynamically as needed.

- **Subscription Criteria:** Proper configuration is essential for effective subscriptions. Wildcards and specific values are used to define the scope of events to which a contract subscribes. Avoid prohibited subscription patterns to ensure efficient operation.

- **Dynamic Management:** Subscriptions can be dynamically adjusted based on incoming events, with the `react()` method playing a central role in managing these operations. This approach ensures that RSCs can respond in real-time to changes in the network.

- **Handling Events:** Contracts must handle events carefully by preparing appropriate payloads for subscription, unsubscription, and approval actions. This ensures accurate and timely updates across the network.

For practical applications and further insights, explore our [use cases](../use-cases/index.md) and join our [Telegram](https://t.me/reactivedevs) group to engage with the community.
