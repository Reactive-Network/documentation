---
title: Subscriptions
sidebar_position: 5
description: Explore how to subscribe to events via Reactive Smart Contracts, allowing for event-driven interactions and transaction creation.
slug: /subscriptions
hide_title: true
custom_edit_url: null
---

![Subscriptions Image](./img/subscriptions.jpg)

## Overview

This section covers the subscription system in Reactive Contracts within the Reactive Network. It explains how to configure subscriptions in the contract's constructor using the `subscribe()` method, handle dynamic subscriptions via callbacks, and use filtering criteria such as chain ID, contract address, and topics.

## Subscription Basics

Reactive contract's subscriptions are configured by calling the `subscribe()` method of the Reactive Network's system contract. This either happens in the `constructor()` or alternatively in a callback (see [Dynamic Subscriptions](./subscriptions.md#dynamic-subscriptions)). The reactive contract must adeptly handle reverts due to deployments on both the Reactive Network and their deployer's private ReactVM where the system contract is not present.

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

The subscription system allows the Reactive Network (the event provider) to associate any number of `uint256` fields with a given event. Subscribers can then request events that match any subset of these fields exactly.

During the testnet stage, the Reactive Network provides the originating contract's chain ID, address, and all four topics as filtering criteria. These criteria may be expanded or changed in the future.

### Using REACTIVE_IGNORE and 0

`REACTIVE_IGNORE` is a random value (`0xa65f96fc951c35ead38878e0f0b7a3c744a6f5ccc1476b313353ce31712313ad`) that can be used for topics when you intend to subscribe to any topic. For the same purpose, `0` can be used for chain ID or contract address. At least one criterion must be a specific value to ensure meaningful subscriptions.

### Subscription Examples

- **All Events from a Specific Contract**: Subscribe to all events from `0x7E0987E5b3a30e3f2828572Bb659A548460a3003`.

```solidity
subscribe(CHAIN_ID, 0x7E0987E5b3a30e3f2828572Bb659A548460a3003, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE)
```

- **Specific Topic 0**: Subscribe to all Uniswap V2 Sync events.

```solidity
subscribe(CHAIN_ID, 0, 0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE)
```

- **Specific Contract with Specific Topic 0**: Subscribe to events from `0x7E0987E5b3a30e3f2828572Bb659A548460a3003` with topic 0 `0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1`.

```solidity
subscribe(CHAIN_ID, 0x7E0987E5b3a30e3f2828572Bb659A548460a3003, 0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE)
```

- **Multiple Independent Subscriptions**: Call the `subscribe()` method multiple times in the constructor to create multiple independent subscriptions.

```solidity
bool private vm;

constructor() {
    SubscriptionService service = SubscriptionService(service_address);

    // First subscription
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

    // Second subscription
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

- **Non-Equality Operations**: No matching event parameters using less than, greater than, range, or bitwise operations. Only strict equality is supported.

- **Complex Criteria Sets**: No disjunction or sets of criteria in a single subscription. Calling the `subscribe()` method multiple times to achieve similar results is possible but may lead to combinatorial explosion.

- **Single Chain and All Contracts**: Subscribing to events from all chains or all contracts simultaneously is not allowed. Subscribing to all events from only one chain is also prohibited, as it is considered unnecessary.

- **Duplicate Subscriptions**: While duplicate subscriptions are technically allowed, they function as a single subscription. Users are charged for each transaction sent to the system contract. Preventing duplicates in the system contract is costly due to EVM storage limitations, so duplicate subscriptions are permitted to keep costs manageable.

## Event Processing

To process incoming events, a reactive smart contract must implement the `IReactive` interface with the following method:

```solidity
function react(
    uint256 chain_id,
    address _contract,
    uint256 topic_0,
    uint256 topic_1,
    uint256 topic_2,
    uint256 topic_3,
    bytes calldata data,
    uint256 block_number,
    uint256 op_code
) external;
```

The Reactive Network will feed events matching the reactive contract's subscriptions by initiating calls to this method.

Reactive smart contracts can use all the EVM capabilities normally. The only limitation is that reactive contracts are executed in the context of a private ReactVM associated with a specific deployer address, so they can't interact with contracts deployed by anyone else.

## Calls to Destination Chain Contracts

Reactive smart contracts can create new transactions in destination networks by emitting log records of a predetermined format:

```solidity
event Callback(
    uint256 indexed chain_id,
    address indexed _contract,
    uint64 indexed gas_limit,
    bytes payload
);
```

Upon observing such a record in the traces, the Reactive Network will submit a new transaction with the desired payload to the destination network indicated by the chain ID (as long as it's on the supported list). Note that for authorization purposes, the first 160 bits of the call arguments will be replaced with the calling reactive contract's RVM ID, which is equal to the reactive contract's deployer address.

For example, the Uniswap Stop Order Demo uses this capability to initiate token sales through its destination chain contract:

```solidity
bytes memory payload = abi.encodeWithSignature(
    "stop(address,address,address,bool,uint256,uint256)",
    0,
    pair,
    client,
    token0,
    coefficient,
    threshold
);
emit Callback(chain_id, stop_order, CALLBACK_GAS_LIMIT, payload);
```

## Dynamic Subscriptions

Subscriptions are managed via the system contract accessible only from the Reactive Network. Events are sent to the ReactVM's contract copy, which has no system contract in it. To handle dynamic subscriptions and unsubscriptions based on incoming events, callbacks must be sent from the ReactVM to the Reactive Network.

The `react()` method handles incoming events and checks whether `topic_0` indicates a `subscribe` or `unsubscribe` event. If so, it generates a callback to the Reactive Network.

The `subscribe()` and `unsubscribe()` methods can only be invoked within the Reactive Network via a callback. They interact with the system contract to subscribe to or unsubscribe from approval events for specific addresses.

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
        bytes memory payload = abi.encodeWithSignature(
            "subscribe(address,address)",
            address(0),
            address(uint160(topic_1))
        );
        emit Callback(REACTIVE_CHAIN_ID, address(this), CALLBACK_GAS_LIMIT, payload);
    } else if (topic_0 == UNSUBSCRIBE_TOPIC_0) {
        bytes memory payload = abi.encodeWithSignature(
            "unsubscribe(address,address)",
            address(0),
            address(uint160(topic_1))
        );
        emit Callback(REACTIVE_CHAIN_ID, address(this), CALLBACK_GAS_LIMIT, payload);
    } else {
        (uint256 amount) = abi.decode(data, (uint256));
        bytes memory payload = abi.encodeWithSignature(
            "onApproval(address,address,address,address,uint256)",
            address(0),
            address(uint160(topic_2)),
            address(uint160(topic_1)),
            _contract,
            amount
        );
        emit Callback(SEPOLIA_CHAIN_ID, address(service), CALLBACK_GAS_LIMIT, payload);
    }
}
```