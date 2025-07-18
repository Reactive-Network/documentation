---
title: Subscriptions
sidebar_position: 10
description: Explore how to subscribe to events via Reactive Smart Contracts, allowing for event-driven interactions and transaction creation.
slug: /subscriptions
hide_title: true
---

![Subscriptions Image](./img/subscriptions.jpg)

## Overview

This section explains how to configure and manage subscriptions in a reactive contract within the Reactive Network. It covers the basics of setting up subscriptions in the contract's constructor, handling dynamic subscriptions through callbacks, and applying filtering criteria like chain ID, contract address, and event topics.

## Subscription Basics

In a reactive contract, subscriptions are established by invoking the `subscribe()` method of the Reactive Network's [system contract](./economy). This method is typically called in the contract's `constructor()` or dynamically via a callback (see [Dynamic Subscriptions](./subscriptions.md#dynamic-subscriptions)).

Since deployments occur both on the Reactive Network and in the deployer's private ReactVM, where the system contract is not present, the reactive contract must handle potential reverts. [IReactive](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IReactive.sol), [AbstractReactive](https://github.com/Reactive-Network/reactive-lib/blob/main/src/abstract-base/AbstractReactive.sol), and [ISystemContract](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/ISystemContract.sol) should be implemented. Here's a subscription example in the constructor, taken from the [Basic Demo reactive contract](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/basic/BasicDemoReactiveContract.sol).

```solidity
uint256 public originChainId;
uint256 public destinationChainId;
uint64 private constant GAS_LIMIT = 1000000;

address private callback;

constructor(
    address _service,
    uint256 _originChainId,
    uint256 _destinationChainId,
    address _contract,
    uint256 _topic_0,
    address _callback
) payable {
    service = ISystemContract(payable(_service));
    originChainId = _originChainId;
    destinationChainId = _destinationChainId;
    callback = _callback;

    if (!vm) {
        service.subscribe(
            originChainId,
            _contract,
            _topic_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
    }
}
```

The Reactive Network uses the subscription system to link various `uint256` fields to specific events. Subscribers can then filter events based on exact matches of these fields.

:::info[Filtering Criteria]
The Reactive Network provides filtering criteria based on the originating contract's chain ID, address, and all four topics.
:::

### Using 'REACTIVE_IGNORE' and '0'

`REACTIVE_IGNORE` is an arbitrary predefined value `0xa65f96fc951c35ead38878e0f0b7a3c744a6f5ccc1476b313353ce31712313ad` that allows you to subscribe to any topic.

`address(0)` can be used for contract address and `uint256(0)` for chain ID to match any value. Ensure at least one criterion is specific to create a meaningful subscription.

### Subscription Examples

**All Events from a Specific Contract**: Subscribe to all events from `0x7E0987E5b3a30e3f2828572Bb659A548460a3003`.

```solidity
service.subscribe(CHAIN_ID, 0x7E0987E5b3a30e3f2828572Bb659A548460a3003, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE)
```

**Specific Topic 0**: Subscribe to all Uniswap V2 Sync events.

```solidity
service.subscribe(CHAIN_ID, 0, 0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE)
```

**Specific Contract with Specific Topic 0**: Subscribe to events from `0x7E0987E5b3a30e3f2828572Bb659A548460a3003` with topic 0 `0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1`.

```solidity
service.subscribe(CHAIN_ID, 0x7E0987E5b3a30e3f2828572Bb659A548460a3003, 0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1, REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE)
```

**Multiple Independent Subscriptions**: Call the `subscribe()` method multiple times in the constructor to create multiple independent subscriptions.

```solidity
uint256 public originChainId;
uint256 public destinationChainId;
uint64 private constant GAS_LIMIT = 1000000;

address private callback;

constructor(
    address _service,
    uint256 _originChainId,
    uint256 _destinationChainId,
    address _contract1,
    uint256 _topic0,
    address _contract2,
    uint256 _topic1,
    address _callback
) payable {
    service = ISystemContract(payable(_service));
    originChainId = _originChainId;
    destinationChainId = _destinationChainId;
    callback = _callback;

    if (!vm) {
        // First subscription
        service.subscribe(
            originChainId,
            _contract1,
            _topic0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );

        // Second subscription
        service.subscribe(
            originChainId,
            _contract2,
            REACTIVE_IGNORE,
            _topic1,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
    }
}
```

### Unsubscribing via System Contract

There may be situations where a reactive contract needs to stop listening to a particular topic — such as for revoking automation, optimizing gas usage, or replacing an outdated listener. To do this, you need to invoke the `unsubscribeContract()` function on the system contract by executing the command given below.

First, export the `REACTIVE_IGNORE` constant, which is used as a wildcard value when you want to ignore certain topic parameters:

```bash
export REACTIVE_IGNORE=0xa65f96fc951c35ead38878e0f0b7a3c744a6f5ccc1476b313353ce31712313ad
```

If you're only interested in unsubscribing from a contract with a specific `topic0` and don't care about the values of `topic1`, `topic2`, or `topic3`, use `REACTIVE_IGNORE` in those positions:

```bash
cast send --legacy \
  --rpc-url $REACTIVE_RPC \
  --private-key $REACTIVE_PRIVATE_KEY \
  $SYSTEM_CONTRACT_ADDR \
  "unsubscribeContract(address,uint256,address,uint256,uint256,uint256,uint256)" \
  $REACTIVE_CONTRACT_ADDR \
  $ORIGIN_CHAIN_ID \
  $ORIGIN_CONTRACT \
  $TOPIC_0 \
  $REACTIVE_IGNORE \
  $REACTIVE_IGNORE \
  $REACTIVE_IGNORE
```

### Prohibited Subscriptions

**Non-Equality Operations**: Subscriptions can’t match event parameters using less than (\<), greater than (\>), range, or bitwise operations. Only strict equality is supported.

**Complex Criteria Sets**: Subscriptions can’t use disjunction or sets of criteria within a single subscription. While calling the `subscribe()` method multiple times can achieve similar results, it may lead to combinatorial explosion.

**Single Chain and All Contracts**: Subscribing to events from all chains or all contracts simultaneously is not allowed. Subscribing to all events from only one chain is also prohibited, as it is considered unnecessary.

**Duplicate Subscriptions**: While duplicate subscriptions are technically allowed, they function as a single subscription. Users are charged for each transaction sent to the system contract. Preventing duplicates in the system contract is costly due to EVM storage limitations, so duplicate subscriptions are permitted to keep costs manageable.

## Dynamic Subscriptions

Subscriptions in the Reactive Network are managed through the system contract, which is accessible only from the network. Events are sent to the ReactVM's contract copy, which has no direct access to the system contract. Therefore, dynamic subscriptions and unsubscriptions based on incoming events must be handled via callbacks.

The `react()` method from the [reactive contract](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalListener.sol) of the [Approval Magic demo](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/approval-magic) processes incoming events and checks if `topic_0` indicates a `subscribe` or `unsubscribe` event. If so, it generates a callback to the Reactive Network to manage the subscription.

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

**Callback Emission**: The function uses the `emit Callback` statement to send the appropriate payload and trigger the corresponding action on the Reactive chain.

[More on Subscriptions →](../education/module-1/subscriptions.md)