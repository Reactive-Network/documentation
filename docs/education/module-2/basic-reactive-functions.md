---
title: "Lesson 6: Implementing Basic Reactive Functions"
sidebar_position: 2
description: Learn to implement Reactive Smart Contracts for Uniswap V2, automate stop orders, and understand their execution based on Sync events.
slug: basic-reactive-functions
custom_edit_url: null
---

# Lesson 6: Implementing Basic Reactive Functions

## Overview

In this lesson, we’ll go through the Reactive Smart Contract (RSC) specifically designed for the Uniswap V2 platform, aimed
at executing stop orders based on predefined conditions. By the end of this lesson, you’ll know:

* That RSCs are pretty similar to Ethereum smart contracts and thus easy to understand.
* What each part of the stop-order reactive smart contract means.
* How this reactive smart contract is executed and what it does.

## Contract

The contract `UniswapDemoStopOrderReactive.sol` is set up to monitor liquidity pool events on Uniswap V2, namely tracking the
`Sync` events to determine when the conditions for a stop order are met. When these conditions are triggered, it executes a
callback transaction on the Ethereum blockchain to perform the stop order.

## Key Components

### Event Declarations

Event Declarations: Events like `Callback`, `Subscribed`, `AboveThreshold`, `CallbackSent`, and `Done` are used for logging
and tracking the contract's operations on the blockchain.

```solidity
// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity >=0.8.0;

import '../../IReactive.sol';
import '../../SubscriptionService.sol';

struct Reserves {
uint112 reserve0;
uint112 reserve1;
}

// Reactive: 0x0c189A26E0AD06f8E12179280d9e8fB0EE1648C2

contract UniswapDemoStopOrderReactive {
event Callback(
uint256 indexed chain_id,
address indexed _contract,
uint64 indexed gas_limit,
bytes payload
);

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

`UNISWAP_V2_SYNC_TOPIC_0` and `STOP_ORDER_STOP_TOPIC_0` are constants representing the topics for Uniswap's `Sync` events
and the contract's `Stop` events, respectively. `CALLBACK_GAS_LIMIT` is the gas limit set for the callback transaction.
Variables like `triggered`, `done`, `pair`, `stop_order`, `client`, `token0`, `coefficient`, and `threshold` store the state
and configuration of the stop order.

```solidity
    uint256 private constant UNISWAP_V2_SYNC_TOPIC_0 = 0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1;
    uint256 private constant STOP_ORDER_STOP_TOPIC_0 = 0x9996f0dd09556ca972123b22cf9f75c3765bc699a1336a85286c7cb8b9889c6b;

    uint64 private constant CALLBACK_GAS_LIMIT = 1000000;

    /**
     * Indicates whether this is the instance of the contract deployed to ReactVM.
     */
    bool private vm;

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

The constructor sets up the initial state of the contract and subscribes to the necessary events from the Uniswap V2 pair
`_pair` and the stop-order contract `_stop_order` using the `SubscriptionService.sol`.

```solidity
    constructor(
        address service_address,
        address _pair,
        address _stop_order,
        address _client,
        bool _token0,
        uint256 _coefficient,
        uint256 _threshold
    ) {
        triggered = false;
        done = false;
        SubscriptionService service = SubscriptionService(service_address);
        pair = _pair;
        bytes memory payload = abi.encodeWithSignature("subscribe(address,uint256)", pair, UNISWAP_V2_SYNC_TOPIC_0);
        (bool subscription_result,) = address(service).call(payload);
        if (!subscription_result) {
            vm = true;
            emit VM();
        } else {
            emit Subscribed(service_address, pair, UNISWAP_V2_SYNC_TOPIC_0);
        }
        stop_order = _stop_order;
        bytes memory payload_2 = abi.encodeWithSignature("subscribe(address,uint256)", stop_order, STOP_ORDER_STOP_TOPIC_0);
        (bool subscription_result_2,) = address(service).call(payload_2);
        if (!subscription_result_2) {
            vm = true;
            emit VM();
        } else {
            emit Subscribed(service_address, stop_order, STOP_ORDER_STOP_TOPIC_0);
        }
        client = _client;
        token0 = _token0;
        coefficient = _coefficient;
        threshold = _threshold;
    }
```

### react() Function

The `react()` function is the core of the contract's logic. It is triggered by events on the Ethereum smart contract it is
subscribed to. The function processes these events to check if the conditions for executing the stop order are met.
If the event is from the stop-order contract and matches the predefined topics and addresses, the contract concludes its operation
(`done` = `true`). If the event is a `Sync` event from the Uniswap pair, the contract checks if the current reserves meet the stop-order
condition (`below_threshold` function). If so, it triggers the callback transaction on Ethereum to execute the stop order.

```solidity
    // Methods specific to ReactVM instance of the contract.

    function react(
        uint256 chain_id,
        address _contract,
        uint256 topic_0,
        uint256 topic_1,
        uint256 topic_2,
        uint256 /* topic_3 */,
        bytes calldata data
    ) external {
        // TODO: Support for multiple dynamic orders? Not viable until we have dynamic subscriptions.
        // TODO: fix the assertions after debugging.
        //require(vm, 'ReactVM only');
        assert(!done);
        if (_contract == stop_order) {
            // TODO: Practically speaking, it's broken, because we also need to check the transfer direction.
            //       For the purposes of the demo, I'm just going to ignore that complication.
            if (
                triggered &&
                topic_0 == STOP_ORDER_STOP_TOPIC_0 &&
                topic_1 == uint256(uint160(pair)) &&
                topic_2 == uint256(uint160(client))
            ) {
                done = true;
                emit Done();
            }
        } else {
            Reserves memory sync = abi.decode(data, ( Reserves ));
            if (below_threshold(sync) && !triggered) {
                emit CallbackSent();
                bytes memory payload = abi.encodeWithSignature(
                    "stop(address,address,bool,uint256,uint256)",
                    pair,
                    client,
                    token0,
                    coefficient,
                    threshold
                );
                triggered = true;
                emit Callback(chain_id, stop_order, CALLBACK_GAS_LIMIT, payload);
            }
        }
    }
```

### below_threshold() Function

The `below_threshold()` function determines whether the current token reserves in the Uniswap pool meet the threshold
conditions for executing the stop order.

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

* Initialization: Upon deployment, the contract subscribes to the necessary events from the Uniswap V2 pair and the stop
order callback contract.

* Event Monitoring: The contract listens for Sync events from the Uniswap pair to monitor the pool's reserve changes and
`Stop` events from the stop-order contract to track the execution of orders.

* Stop Order Activation: When the `Sync` event indicates that the pool's price hits the threshold, the contract initiates
the stop order through the callback function, executing a trade on Uniswap V2.

* Completion: After the stop order is executed, the contract captures the Stop event from the stop-order contract, marking
the process as complete.

In essence, this Reactive Smart Contract leverages the event-driven capabilities of the ReactVM to autonomously monitor and
respond to on-chain conditions, executing predefined trading strategies on Uniswap V2 efficiently and in a decentralized manner.

## Conclusion

RSCs share a strong resemblance with Ethereum smart contracts, making them relatively straightforward to comprehend for those
familiar with Ethereum's smart contract architecture. We've dissected every component of the stop-order reactive smart contract,
understanding the role and purpose of each part, from event handling to state management. We've delved into the execution
process of this reactive smart contract, detailing how it listens for and reacts to specific Uniswap V2 pool events to
autonomously execute stop orders based on predefined conditions, illustrating the dynamic and responsive nature of RSCs in
the decentralized finance ecosystem.

This lesson explains the concepts used in the [P03 Uniswap Stop Order](../use-cases/use-case-3) use case, feel free to
try it yourself.