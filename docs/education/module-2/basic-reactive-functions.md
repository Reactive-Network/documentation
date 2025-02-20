---
title: "Lesson 7: Implementing Basic Reactive Functions"
sidebar_position: 2
description: Learn to implement Reactive Smart Contracts for Uniswap V2, automate stop orders, and understand their execution based on Sync events.
slug: basic-reactive-functions
---

# Lesson 7: Implementing Basic Reactive Functions

## Overview

In this lesson, we’ll go through the Reactive Smart Contract (RSC) specifically designed for the Uniswap V2 platform, aimed at executing stop orders based on predefined conditions. By the end of this lesson, you’ll know:

* That RSCs are pretty similar to Ethereum smart contracts and thus easy to understand.
* What each part of the stop-order reactive smart contract means.
* How this reactive smart contract is executed and what it does.

## Contract

The [UniswapDemoStopOrderReactive](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/uniswap-v2-stop-order/UniswapDemoStopOrderReactive.sol) contract is set up to monitor liquidity pool events on Uniswap V2, namely tracking the `Sync` events to determine when the conditions for a stop order are met. When these conditions are triggered, it executes a callback transaction on the Ethereum blockchain to perform the stop order.

## Key Components

### Event Declarations

Event Declarations: Events like `Subscribed`, `VM`, `AboveThreshold`, `CallbackSent`, and `Done` are used for logging and tracking the contract's operations on the blockchain.

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

### Contract Variables

`UNISWAP_V2_SYNC_TOPIC_0` and `STOP_ORDER_STOP_TOPIC_0` are constants representing the topics for Uniswap's `Sync` events and the contract's `Stop` events, respectively. `CALLBACK_GAS_LIMIT` is the gas limit set for the callback transaction. Variables like `triggered`, `done`, `pair`, `stop_order`, `client`, `token0`, `coefficient`, and `threshold` store the state and configuration of the stop order.

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

## Contract Logic

### Constructor

The constructor initializes the contract by storing references to the Uniswap V2 pair (`_pair`), the stop-order contract (`_stop_order`), and the client (`_client`). It also records a boolean flag (`_token0`), which indicates whether this contract is managing `token0` or `token1`, and sets the `coefficient` and `threshold` parameters that handle its behavior.

After these values are stored, the contract subscribes to the Uniswap V2 pair and stop-order contract events, but only if it is not operating in a reactVM instance. Subscribing to these events ensures the contract will be notified of any relevant updates, specifically `UNISWAP_V2_SYNC_TOPIC_0` from the Uniswap pair and `STOP_ORDER_STOP_TOPIC_0` from the stop-order contract.

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

### react() Function

The `react()` function processes incoming blockchain events and determines if actions need to be triggered based on the event type:

**Stop-Order Events**: If the event originates from the stop-order contract, the function verifies that the event matches the expected topics and addresses (`pair` and `client`). Once confirmed and if the stop order has already been triggered (`triggered = true`), the contract marks the operation as completed (`done = true`) and emits the `Done` event.

**Uniswap Pair Sync Events**: For events originating from the Uniswap pair contract (specifically `Sync` events), the function decodes the reserves data to check if the conditions for triggering the stop-order are met. This check is performed using the `below_threshold` function, which calculates whether the reserve ratio falls below the defined threshold. If the condition is satisfied, the contract emits a `CallbackSent` event, prepares the callback payload, sets `triggered = true`, and emits a `Callback` event to execute the stop order.

```solidity
    // Methods specific to ReactVM instance of the contract.
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

### below_threshold() Function

The `below_threshold()` function checks whether the current reserves in the Uniswap pool satisfy the conditions for executing a stop order. It compares the reserve ratio to a predefined threshold based on the selected token (either `token0` or `token1`).

If `token0` is selected, the function checks if the ratio of `reserve1` to `reserve0`, multiplied by a coefficient, is less than or equal to the threshold. If `token0` is not selected, the function checks if the ratio of `reserve0` to `reserve1`, multiplied by the coefficient, is less than or equal to the threshold.

```solidity
    function below_threshold(Reserves memory sync) internal view returns (bool) {
        if (token0) {
            return (sync.reserve1 * coefficient) / sync.reserve0 <= threshold;
        } else {
            return (sync.reserve0 * coefficient) / sync.reserve1 <= threshold;
        }
    }
```

## Execution Flow

**Initialization**: Upon deployment, the contract subscribes to the necessary events from the Uniswap V2 pair and the stop order callback contract.

**Event Monitoring**: The contract listens for Sync events from the Uniswap pair to monitor the pool's reserve changes and`Stop` events from the stop-order contract to track the execution of orders.

**Stop Order Activation**: When the `Sync` event indicates that the pool's price hits the threshold, the contract initiates the stop order through the callback function, executing a trade on Uniswap V2.

**Completion**: After the stop order is executed, the contract captures the Stop event from the stop-order contract, marking the process as complete.


## Conclusion

In this article, we’ve examined the implementation of a Reactive Smart Contract (RSC) for managing stop orders on the Uniswap V2 platform. Key takeaways include:

- **Similarity to Ethereum Smart Contracts:** RSCs are conceptually similar to Ethereum smart contracts, making them accessible for those familiar with Ethereum's architecture.

- **Contract Components:** We reviewed the key elements of the stop-order reactive smart contract, including event declarations, contract variables, and the logic behind the `react()` and `below_threshold()` functions.

- **Execution Flow:** The contract’s lifecycle involves subscribing to relevant events, monitoring Uniswap V2 pool reserves, triggering stop orders when conditions are met, and capturing completion events to finalize the process.

For a deeper look into practical applications, explore the [Uniswap Stop Order](../use-cases/use-case-3) use case and consider experimenting with these concepts in your own projects. Join our [Telegram](https://t.me/reactivedevs) group to engage with the community.