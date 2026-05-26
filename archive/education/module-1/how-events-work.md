---
title: "Lesson 2: How Events and Callbacks Work"
sidebar_position: 2
description: Learn how EVM events and callbacks work in Reactive Contracts. Covers event creation and emission, the IReactive interface and react() method, and how callbacks trigger cross-chain transactions on destination chains.
slug: how-events-work
unlisted: true
---

# Lesson 2: How Events and Callbacks Work

## Overview

Events are how smart contracts communicate with the outside world. When something happens on-chain (a transfer, a price update, a contract state change), a smart contract can emit an event that gets recorded in the transaction's logs. External applications can listen for these events and respond to them.

This is the foundation that Reactive contracts are built on. Instead of an external application listening for events and manually submitting transactions in response, a Reactive contract handles that entire loop on-chain: it detects events through the `react()` method, processes them, and can trigger actions on other chains through callbacks.

By the end of this lesson, you'll understand:

- How events are defined, emitted, and listened for in Ethereum
- How Reactive Contracts process events through the `IReactive` interface
- How callbacks let a Reactive contract trigger transactions on destination chains

## How EVM Events Work

When a smart contract emits an event, the data is stored in the transaction's logs. These logs are attached to blocks on the blockchain but don't directly affect the blockchain state. They're a way to record and retrieve information without writing to contract storage.

To define an event, you use the `event` keyword in Solidity, followed by the event name and the data types you want to log. To fire it, you use the `emit` keyword:

```solidity
// Define
event PriceUpdated(string symbol, uint256 newPrice);

// Emit
emit PriceUpdated("ETH", newEthPrice);
```

External applications (dApps, backend services, or in our case Reactive contracts) can subscribe to these events by specifying the event signature and optional filtering parameters. Whenever a matching event is emitted, the subscriber gets notified. This is what makes responsive, real-time blockchain applications possible.

## Example: Chainlink Price Oracle

To make this concrete, consider a DeFi lending platform that adjusts collateral requirements based on market prices. It uses Chainlink's decentralized oracle network to get real-time price data.

The contract defines a `PriceUpdated` event and emits it whenever Chainlink's oracle delivers a new price. A portfolio management tool, a liquidation bot, or a Reactive contract can listen for that event and act on it immediately, rebalancing a portfolio, issuing a loan, or triggering a cross-chain transaction.

In later lessons, you'll see how to set up a Reactive Contract to catch exactly these kinds of events.

## Event Processing in Reactive Contracts

To receive and process events, a Reactive contract must implement the [`IReactive`](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IReactive.sol) interface:

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

This interface has three key parts:

**LogRecord** is the data structure that describes an incoming event. It contains everything a Reactive contract needs to understand what happened and where: the chain ID, the contract address that emitted the event, indexed topics, raw event data, and identifiers like block number, transaction hash, and log index.

**Callback** is the event a Reactive contract emits when it wants to trigger an action on another chain. It specifies the destination chain ID, the target contract address, a gas limit, and an encoded payload containing the transaction details.

**react()** is the function Reactive Network calls when a matching event is detected. It receives a `LogRecord` as input, and your implementation decides what to do with it (update state, run calculations, emit a callback, or all of the above).

Reactive Network continuously monitors event logs and matches them against the subscription criteria defined in your contract. When a match is found, it triggers `react()` with the relevant event details.

One important constraint: Reactive Contracts run within a private ReactVM instance, which restricts them to interacting with contracts deployed by the same deployer. This isolation keeps the execution environment secure while the contract processes events from across the network.

## Callbacks to Destination Chains

Callbacks are how a Reactive contract reaches beyond Reactive Network and triggers actions on other blockchains. When your `react()` logic determines that something needs to happen on a destination chain, it emits a `Callback` event. Reactive picks that up and submits the corresponding transaction.

### Emitting a Callback

The `Callback` event takes four parameters:

- `chain_id` — the EIP155 chain ID of the destination network
- `_contract` — the address of the target contract on that chain
- `gas_limit` — the gas limit for the destination transaction
- `payload` — ABI-encoded data specifying the function call to execute

### How the Callback Is Processed

When Reactive Network detects a `Callback` event, it decodes the `payload`, constructs a transaction targeting the specified contract on the destination chain, and submits it with the provided gas limit.

### Callback Identity

When a Reactive contract constructs a callback payload, the first argument must be reserved for the RVM ID. Developers pass `address(0)` as a placeholder in this slot, and Reactive Network automatically overwrites the first 160 bits with the deployer's address before the callback reaches the destination chain. This means callbacks always carry an authenticated origin that can't be forged by the contract itself.

The callback must include at least one argument, omitting the first slot entirely will cause the call to fail, since the system has no location to inject the RVM ID. Destination contracts can rely on this first argument to identify which ReactVM originated the callback.

Example from [Uniswap V2 Stop Order Demo](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/f1f85ab2a0a8f917b9b37a57c00be2ffc8ad5ad4/src/demos/uniswap-v2-stop-order/UniswapDemoStopOrderReactive.sol#L107):

 ```solidity
bytes memory payload = abi.encodeWithSignature(
    "stop(address,address,address,bool,uint256,uint256)",
    address(0),  // The ReactVM address
    pair,        // The Uniswap pair address involved in the transaction
    client,      // The address of the client initiating the stop order
    token0,      // The address of the first token in the pair
    coefficient, // A coefficient determining the sale price
    threshold    // The price threshold at which the sale should occur
);
emit Callback(chain_id, stop_order, CALLBACK_GAS_LIMIT, payload);
```

## About This Course

This course is designed to give you both the theory and the hands-on experience to start building with Reactive contracts. It includes detailed lectures, code examples on GitHub, and video workshops covering everything from basic concepts to real-world deployments.

Whether you want to understand how Reactive contracts work under the hood or jump straight into building, the course adapts to either path. Explore the [use cases](../use-cases/index.md) if you want to see what's possible, or start from Module 1 to build up from the fundamentals.

Join the [Telegram](https://t.me/reactivedevs) community if you have questions or want to connect with other developers working with Reactive contracts.