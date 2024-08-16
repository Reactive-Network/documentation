---
title: "Lesson 4: How Subscriptions Work"
sidebar_position: 4
description: Understand how to implement subscriptions in the constructor of reactive smart contracts and how to manage subscriptions dynamically using callbacks to destination chains 
slug: how-subscriptions-work
---

# Lesson 4: How Subscriptions Work

## Overview

In the previous lesson, we covered the basic differences between the Reactive Network and ReactVM. In this one, we will dive into subscriptions, a key feature that allows RSCs to automatically respond to events emitted by other contracts. Subscriptions in Reactive Smart Contracts enable a contract to listen for specific events emitted by other contracts. When these events occur, the subscribing contract can automatically execute predefined logic.

By the end of this article, you will learn to:

* Configure and manage subscriptions both statically and dynamically.
* Handle subscription and unsubscription events within your smart contracts.
* Recognize the limitations and best practices for using subscriptions in Reactive Smart Contracts.

## How to Implement Subscriptions

In Reactive Smart Contracts, subscriptions are set up using the `subscribe` method from the Reactive Network’s system contract. Typically, this is done in the constructor to initialize subscriptions, though they can also be managed dynamically. We’ll discuss [dynamic subscriptions](./how-subscriptions-work#dynamic-subscriptions) closer to the end of this article.

The reactive contract must also handle reverts due to deployments on both the Reactive Network, which has the system contract, and their deployer's private ReactVM, where the system contract is not present.

### ISubscriptionService Interface

The `ISubscriptionService` interface serves as an event subscription service for reactive contracts that can use this service to subscribe to specific events based on certain criteria and receive notifications when those events occur.

```solidity
interface ISubscriptionService {
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

The interface consists of two functions: `subscribe` and `unsubscribe`. The `subscribe` function allows a contract to subscribe to events emitted by other contracts when these events match the specified criteria. The `unsubscribe` function removes an active subscription of the calling contract, if one exists, based on the specified criteria.

The parameters of both functions mirror each other:
- `chain_id`: A `uint256` representing the `EIP155` source chain ID for the event.
- `_contract`: The address of the origin chain contract that emitted the event.
- `topic_0`, `topic_1`, `topic_2`, `topic_3`: The topics of the event, which are `uint256` values.

Unsubscribing is an expensive operation due to the necessity of searching and removing subscriptions. Duplicate or overlapping subscriptions are allowed, but clients must ensure idempotency.

### Subscribing in the Constructor

Here’s how the `subscribe` function works in the constructor:

```solidity
bool private vm;

constructor() {
    SubscriptionService service = SubscriptionService(service_address);
    bytes memory payload = abi.encodeWithSignature(
        "subscribe(uint256,address,uint256,uint256,uint256,uint256)",
        CHAIN_ID,
        CONTRACT_ADDRESS,
        TOPIC_0,
        REACTIVE_IGNORE,
        REACTIVE_IGNORE,
        REACTIVE_IGNORE
    );
    (bool subscription_result,) = address(service).call(payload);
    if (!subscription_result) {
        vm = true;
    }
}
```
### Subscription Criteria

When configuring subscriptions in Reactive Smart Contracts, you should adhere to the following rules:

- Wildcard Usage: Use `0` to indicate no filtering based on chain ID or contract address. Use `REACTIVE_IGNORE` for topics to subscribe to any topic.

- Concrete Values: At least one criterion must be a specific value to ensure meaningful subscriptions.

### Examples

#### Subscribing to All Events from a Specific Contract

Here’s how you can subscribe to all events from a specific contract at `0x7E0987E5b3a30e3f2828572Bb659A548460a3003`:

```solidity
subscribe(CHAIN_ID, 0x7E0987E5b3a30e3f2828572Bb659A548460a3003, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE)
```

#### Subscribing to a Specific Event Topic (Uniswap V2 Sync)

Another option is to subscribe to all Uniswap V2 Sync events with `topic_0` `0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1`:

```solidity
subscribe(CHAIN_ID, 0, 0x1c411e9a96e071241c 2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE)
```

#### Combining Parameters

You can combine these parameters to subscribe to the events of a specific contract at `0x7E0987E5b3a30e3f2828572Bb659A548460a3003` with `topic_0` `0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1`:

```solidity
subscribe(CHAIN_ID, 0x7E0987E5b3a30e3f2828572Bb659A548460a3003, 0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE)
```

#### Handling Multiple Events from Different Origins

To react to multiple events from different origins, you can use multiple `subscribe` calls in the constructor:

```solidity
bool private vm;

constructor() {
    SubscriptionService service = SubscriptionService(service_address);

    // Subscription to all events from a specific contract
    bytes memory payload1 = abi.encodeWithSignature(
        "subscribe(uint256,address,uint256,uint256,uint256,uint256)",
        CHAIN_ID,
        0x7E0987E5b3a30e3f2828572Bb659A548460a3003, // Specific contract address
        REACTIVE_IGNORE,
        REACTIVE_IGNORE,
        REACTIVE_IGNORE,
        REACTIVE_IGNORE
    );
    (bool subscription_result1,) = address(service).call(payload1);
    if (!subscription_result1) {
        vm = true;
    }

    // Subscription to a specific event topic (Uniswap V2 Sync)
    bytes memory payload2 = abi.encodeWithSignature(
        "subscribe(uint256,address,uint256,uint256,uint256,uint256)",
        CHAIN_ID,
        0,
        0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1, // Specific topic 0
        REACTIVE_IGNORE,
        REACTIVE_IGNORE,
        REACTIVE_IGNORE
    );
    (bool subscription_result2,) = address(service).call(payload2);
    if (!subscription_result2) {
        vm = true;
    }

    // Add more subscriptions as needed
}
```
### Prohibited Subscriptions

- **Non-Equality Operations**: Subscriptions can’t match event parameters using less than (\<), greater than (\>), range, or bitwise operations. Only strict equality is supported.

- **Complex Criteria Sets**: Subscriptions can’t use disjunction or sets of criteria within a single subscription. While calling the `subscribe()` method multiple times can achieve similar results, it may lead to combinatorial explosion.

- **Single Chain and All Contracts**: Subscribing to events from all chains or all contracts simultaneously is not allowed. Subscribing to all events from only one chain is also prohibited, as it is considered unnecessary.

- **Duplicate Subscriptions**: While duplicate subscriptions are technically allowed, they function as a single subscription. Users are charged for each transaction sent to the system contract. Preventing duplicates in the system contract is costly due to EVM storage limitations, so duplicate subscriptions are permitted to keep costs manageable.

## Dynamic Subscriptions

Reactive Smart Contracts can dynamically manage their subscriptions based on incoming events. Since the system contract responsible for managing subscriptions is only accessible from the Reactive Network, the ReactVM's contract copy handles these operations and communicates with the Reactive Network using callbacks. You can read more on that in [ReactVM and Reactive Network As a Dual-State Environment](./react-vm).

### Managing Subscriptions

The `react()` method in the contract plays a central role in managing subscriptions and unsubscriptions. It processes events by checking the `topic_0` value to determine the appropriate action and generates a corresponding callback to the Reactive Network.

```solidity
function react(
    uint256 /* chain_id */,
    address _contract,
    uint256 topic_0,
    uint256 topic_1,
    uint256 topic_2,
    uint256 /* topic_3 */,
    bytes calldata data,
    uint256 /* block_number */,
    uint256 /* op_code */
) external vmOnly {
    if (topic_0 == SUBSCRIBE_TOPIC_0) {
        // Handle subscription
        bytes memory payload = abi.encodeWithSignature(
            "subscribe(address,address)",
            address(0),
            address(uint160(topic_1))
        );
        emit Callback(REACTIVE_CHAIN_ID, address(this), CALLBACK_GAS_LIMIT, payload);
    } else if (topic_0 == UNSUBSCRIBE_TOPIC_0) {
        // Handle unsubscription
        bytes memory payload = abi.encodeWithSignature(
            "unsubscribe(address,address)",
            address(0),
            address(uint160(topic_1))
        );
        emit Callback(REACTIVE_CHAIN_ID, address(this), CALLBACK_GAS_LIMIT, payload);
    } else {
        // Handle approval event
        (uint256 amount) = abi.decode(data, (uint256));
        bytes memory payload = abi.encodeWithSignature(
            "onApproval(address,address,address,address,uint256)",
            address(0),
            address(uint160(topic_2)),
            address(uint160(topic_1)),
            _contract,
            amount
        );
        emit Callback(CHAIN_ID, address(service), CALLBACK_GAS_LIMIT, payload);
    }
}
```
### Subscription and Unsubscription Handling

When an event with `topic_0` matching SUBSCRIBE_TOPIC_0 is received, the contract prepares a payload to call the `subscribe()` method. This payload specifies the address to subscribe to, and a `Callback` event is emitted to update the Reactive Network.

```solidity
bytes memory payload = abi.encodeWithSignature(
    "subscribe(address,address)",
    address(0),
    address(uint160(topic_1))
);
emit Callback(REACTIVE_CHAIN_ID, address(this), CALLBACK_GAS_LIMIT, payload);
```

For events where `topic_0` matches `UNSUBSCRIBE_TOPIC_0`, the contract creates an unsubscription payload. It calls the `unsubscribe()` method with the address to be unsubscribed from, and emits a `Callback` event to notify the Reactive Network.

```solidity
bytes memory payload = abi.encodeWithSignature(
    "unsubscribe(address,address)",
    address(0),
    address(uint160(topic_1))
);
emit Callback(REACTIVE_CHAIN_ID, address(this), CALLBACK_GAS_LIMIT, payload);
```
### Approval Event Handling

For events with `topic_0` values not related to subscription changes, the contract processes approval events. It decodes the event data to retrieve the necessary parameters and invokes the `onApproval()` method. A `Callback` event is then emitted to notify the relevant chain of the approval details.

```solidity
(uint256 amount) = abi.decode(data, (uint256));
bytes memory payload = abi.encodeWithSignature(
    "onApproval(address,address,address,address,uint256)",
    address(0),
    address(uint160(topic_2)),
    address(uint160(topic_1)),
    _contract,
    amount
);
emit Callback(CHAIN_ID, address(service), CALLBACK_GAS_LIMIT, payload);
```

That’s how Reactive Smart Contracts can handle real-time subscription and unsubscription events. By processing specific topics and emitting appropriate callbacks, contracts ensure they stay updated with changes and maintain constant communication with the Reactive Network.

## Conclusion

In this article, we’ve explored the use of subscriptions in Reactive Smart Contracts, focusing on their implementation and management. We've also examined how to configure subscriptions, handle subscription events, and manage unsubscriptions, both in static and dynamic contexts. Understanding these concepts is crucial for building advanced and responsive Reactive Smart Contracts.