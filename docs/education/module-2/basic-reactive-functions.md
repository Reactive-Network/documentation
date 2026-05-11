---
title: "Lesson 7: Basic Reactive Functions"
sidebar_position: 2
description: Walkthrough of a Reactive Contract that implements a Uniswap V2 stop order. Covers the contract structure, event subscriptions, the react() function, threshold logic, and the full execution flow from initialization to trade completion.
slug: basic-reactive-functions
---

# Lesson 7: Basic Reactive Functions

## Overview

This lesson walks through a complete Reactive сontract, one that monitors a Uniswap V2 pool and executes a stop order when the price drops below a threshold. It's a practical example that ties together the concepts from the previous lessons: subscriptions, event processing, the dual-state environment, and callbacks.

If you've worked with Solidity before, most of this will look familiar. Reactive contracts follow the same patterns as standard Ethereum smart contracts, with the addition of the `react()` function and the subscription/callback mechanics covered earlier in the course.

By the end of this lesson, you'll understand:

- How a real Reactive contract is structured from imports to execution logic
- What each part of the stop-order contract does
- How the contract moves from initialization to monitoring to trade execution

## Contract

The [UniswapDemoStopOrderReactive](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/uniswap-v2-stop-order/UniswapDemoStopOrderReactive.sol) contract monitors `Sync` events from a Uniswap V2 pair. When the reserve ratio drops below a predefined threshold, it sends a callback to execute a stop order on the destination chain.

### Imports and Events

The contract imports the `IReactive` interface and `AbstractReactive` base contract, then defines a `Reserves` struct to decode Uniswap's `Sync` event data. The events are used for logging at each stage of the contract's lifecycle:

```solidity
// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity >=0.8.0;

import '../../../lib/reactive-lib/src/interfaces/IReactive.sol';
import '../../../lib/reactive-lib/src/abstract-base/AbstractReactive.sol';

    struct Reserves {
        uint112 reserve0;
        uint112 reserve1;
    }

contract UniswapDemoStopOrderReactive is IReactive, AbstractReactive {
    event Subscribed(
        address indexed service_address,
        address indexed _contract,
        uint256 indexed topic_0
    );

    event VM();
    event AboveThreshold(
        uint112 indexed reserve0,
        uint112 indexed reserve1,
        uint256 coefficient,
        uint256 threshold
    );

    event CallbackSent();
    event Done();
```

`Subscribed` logs when the contract registers for events. `AboveThreshold` logs when the reserve ratio is checked but doesn't trigger. `CallbackSent` and `Done` mark the two key state transitions: when the stop order is sent and when it's confirmed.

### Constants and State Variables

```solidity
    uint256 private constant SEPOLIA_CHAIN_ID = 11155111;
    uint256 private constant UNISWAP_V2_SYNC_TOPIC_0 = 0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1;
    uint256 private constant STOP_ORDER_STOP_TOPIC_0 = 0x9996f0dd09556ca972123b22cf9f75c3765bc699a1336a85286c7cb8b9889c6b;
    uint64 private constant CALLBACK_GAS_LIMIT = 1000000;

    // State specific to ReactVM instance of the contract.

    bool private triggered;
    bool private done;
    address private pair;
    address private stop_order;
    address private client;
    bool private token0;
    uint256 private coefficient;
    uint256 private threshold;
```

The constants define the chain ID, the topic hashes for the two events the contract cares about (`Sync` from Uniswap and `Stop` from the stop-order contract), and the gas limit for callbacks.

The state variables track the contract's progress: `triggered` prevents duplicate callbacks once the threshold is hit, `done` signals that the stop order has been confirmed. The remaining variables (`pair`, `stop_order`, `client`, `token0`, `coefficient`, and `threshold`) configure which pool to watch, which contract to call, and what price condition to act on.

## Contract Logic

### Constructor

The constructor stores the configuration and sets up event subscriptions on Reactive Network:

```solidity
    constructor(
        address _pair,
        address _stop_order,
        address _client,
        bool _token0,
        uint256 _coefficient,
        uint256 _threshold
    ) payable {
        triggered = false;
        done = false;
        pair = _pair;
        stop_order = _stop_order;
        client = _client;
        token0 = _token0;
        coefficient = _coefficient;
        threshold = _threshold;

        if (!vm) {
            service.subscribe(
                SEPOLIA_CHAIN_ID,
                pair,
                UNISWAP_V2_SYNC_TOPIC_0,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );
            service.subscribe(
                SEPOLIA_CHAIN_ID,
                stop_order,
                STOP_ORDER_STOP_TOPIC_0,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );
        }
    }
```

The `if (!vm)` block only runs on Reactive Network (as covered in [Lesson 3](../module-1/react-vm.md)). It subscribes to two event types: `Sync` events from the Uniswap pair to track reserve changes, and `Stop` events from the stop-order contract to know when execution is confirmed. The ReactVM instance skips this block and uses the same variables for event processing.

### react() Function

This is where the contract's logic lives. It handles two types of incoming events:

```solidity
    function react(LogRecord calldata log) external vmOnly {
        assert(!done);

        if (log._contract == stop_order) {
            if (
                triggered &&
                log.topic_0 == STOP_ORDER_STOP_TOPIC_0 &&
                log.topic_1 == uint256(uint160(pair)) &&
                log.topic_2 == uint256(uint160(client))
            ) {
                done = true;
                emit Done();
            }
        } else {
            Reserves memory sync = abi.decode(log.data, ( Reserves ));
            if (below_threshold(sync) && !triggered) {
                emit CallbackSent();
                bytes memory payload = abi.encodeWithSignature(
                    "stop(address,address,address,bool,uint256,uint256)",
                    address(0),
                    pair,
                    client,
                    token0,
                    coefficient,
                    threshold
                );
                triggered = true;
                emit Callback(log.chain_id, stop_order, CALLBACK_GAS_LIMIT, payload);
            }
        }
    }
```

**When a `Sync` event arrives** from the Uniswap pair, the function decodes the reserve data and checks if the price has dropped below the threshold. If it has and the stop order hasn't been triggered yet, it encodes a callback payload targeting the stop-order contract and emits a `Callback` event. Reactive Network picks that up and submits the transaction on the destination chain.

**When a `Stop` event arrives** from the stop-order contract, the function verifies that it matches the expected pair and client, then marks the operation as complete. After `done` is set to `true`, the contract won't process any more events.

### Threshold Check

The `below_threshold()` function determines whether the current reserve ratio warrants triggering the stop order:

```solidity
    function below_threshold(Reserves memory sync) internal view returns (bool) {
        if (token0) {
            return (sync.reserve1 * coefficient) / sync.reserve0 <= threshold;
        } else {
            return (sync.reserve0 * coefficient) / sync.reserve1 <= threshold;
        }
    }
```

The `token0` flag determines which direction to calculate the ratio. If you're watching token 0, it checks whether the price of token 0 (expressed as the ratio of `reserve1` to `reserve0`, scaled by the coefficient) has fallen to or below the threshold. The reverse applies when watching token 1. The `coefficient` is a scaling factor that lets you set precise price targets without running into integer division issues.

## Execution Flow

The full lifecycle of this contract follows four stages:

**Initialization.** On deployment, the Reactive Network instance subscribes to `Sync` events from the Uniswap pair and `Stop` events from the stop-order contract.

**Monitoring.** Every time the Uniswap pair's reserves change, a `Sync` event is emitted. The ReactVM instance receives it through `react()` and checks the reserve ratio against the threshold.

**Triggering.** When the ratio drops below the threshold, the contract encodes a callback payload and emits a `Callback` event. Reactive Network submits the corresponding transaction to the stop-order contract on the destination chain, executing the trade.

**Completion.** The stop-order contract emits a `Stop` event after execution. The Reactive contract receives it, verifies the details, and marks the operation as done. No further events are processed.

## About This Course

This course is designed to give you both the theory and the hands-on experience to start building with Reactive contracts. It includes detailed lectures, code examples on GitHub, and video workshops covering everything from basic concepts to real-world deployments.

Whether you want to understand how Reactive contracts work under the hood or jump straight into building, the course adapts to either path. Explore the [use cases](../use-cases/index.md) if you want to see what's possible, or start from Module 1 to build up from the fundamentals.

Join the [Telegram](https://t.me/reactivedevs) community if you have questions or want to connect with other developers working with Reactive contracts.