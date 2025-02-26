---
title: Events & Callbacks
sidebar_position: 8
description: Explore how EVM events and callbacks operate within the Reactive Network.
slug: /events-&-callbacks
hide_title: true
---

![Events and Callbacks Image](./img/events-and-callbacks.jpg)

## Overview

In the Reactive Network, reactive contracts operate within isolated environments known as [ReactVMs](./reactvm.md). These contracts can process incoming events, create transactions on destination chains, and use callbacks to communicate between networks.

## Event Processing

To handle incoming events, a reactive contract must implement the [IReactive](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IReactive.sol) interface.

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

The Reactive Network feeds events matching a contract's subscriptions by triggering this method. Reactive contracts can access all EVM capabilities but are limited to executing within a private ReactVM tied to the deployer's address, preventing interaction with contracts deployed by others. Below is the `react()` function of the [Basic Reactive Demo](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/basic):

```solidity
// State specific to reactive network instance of the contract
address private _callback;

// State specific to ReactVM instance of the contract
uint256 public counter;

function react(LogRecord calldata log) external vmOnly {
    emit Event(
        log.chain_id,
        log._contract,
        log.topic_0,
        log.topic_1,
        log.topic_2,
        log.topic_3,
        log.data,
        ++counter
    );

    if (log.topic_3 >= 0.01 ether) {
        bytes memory payload = abi.encodeWithSignature("callback(address)", address(0));
        emit Callback(log.chain_id, _callback, GAS_LIMIT, payload);
    }
}
```

[More on Events →](../education/module-1/how-events-work)

## Callbacks to Destination Chains

Reactive contracts can initiate transactions on destination chains by emitting structured log records. The format of the log event is as follows:

```solidity
event Callback(
    uint256 indexed chain_id,
    address indexed _contract,
    uint64 indexed gas_limit,
    bytes payload
);
```

When the Reactive Network detects this event in the transaction trace, it submits a new transaction to the specified destination network, using the `chain_id`.

:::info[Authorization]
The Reactive Network automatically replaces the first 160 bits of the call arguments in the `payload` with the ReactVM ID (equivalent to the contract deployer's address). As a result, the first argument in your callback will always be the ReactVM address (of type `address`), regardless of the variable name you use in your Solidity code. This ensures that the transaction is authorized and tied to the correct contract within the network.
:::

### Example: Uniswap Stop Order Demo

Here’s how the Uniswap Stop Order Demo uses this feature:

```solidity
bytes memory payload = abi.encodeWithSignature(
    "stop(address,address,address,bool,uint256,uint256)",
    address(0),
    pair,
    client,
    token0,
    coefficient,
    threshold
);
emit Callback(chain_id, stop_order, CALLBACK_GAS_LIMIT, payload);
```

The payload encodes the function signature and parameters needed for the stop order. The `Callback` event is emitted with the destination chain ID, target contract, gas limit, and the constructed payload.

[More on Callback Payment →](./economy#callback-payment)

[More on Callbacks →](../education/module-1/how-events-work#callbacks-to-destination-chains)