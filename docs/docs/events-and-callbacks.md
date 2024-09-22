---
title: Events & Callbacks
sidebar_position: 6
description: Explore how EVM events and callbacks operate within the Reactive Network.
slug: /events-&-callbacks
hide_title: true
---

![Events and Callbacks Image](./img/events-and-callbacks.jpg)

## Overview

In the Reactive Network, reactive contracts operate within isolated environments known as [ReactVMs](./reactvm.md). These contracts can process incoming events, create transactions on destination chains, and use callbacks to communicate between networks.

## Event Processing

To handle incoming events, a reactive contract must implement the [IReactive](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/IReactive.sol) interface. Below is the primary method to implement.

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

The Reactive Network feeds events matching a contract's subscriptions by triggering this method. Reactive contracts can access all EVM capabilities but are limited to executing within a private ReactVM tied to the deployer's address, preventing interaction with contracts deployed by others.

[More on Events →](../education/module-1/how-events-work)

## Callbacks to Destination Chains

Reactive Smart Contracts can initiate transactions in destination networks by emitting structured log records. The format of the log event is as follows:

```solidity
event Callback(
    uint256 indexed chain_id,
    address indexed _contract,
    uint64 indexed gas_limit,
    bytes payload
);
```

- **Transaction Creation**: When the Reactive Network detects this event in the transaction trace, it submits a new transaction to the specified destination network, using the `chain_id`.

- **Authorization**: The Reactive Network automatically replaces the first 160 bits of the call arguments in the `payload` with the ReactVM ID (equivalent to the contract deployer's address). As a result, the first argument in your callback will always be the ReactVM address (of type `address`), regardless of the variable name you use in your Solidity code. This ensures that the transaction is authorized and tied to the correct contract within the network.

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
triggered = true;
emit Callback(chain_id, stop_order, CALLBACK_GAS_LIMIT, payload);
```

- **Payload Construction**: The payload encodes the function signature and parameters needed for the stop order.

- **Callback Emission**: The Callback event is emitted with the destination chain ID, target contract, gas limit, and the constructed payload.

[More on Callback Payments →](./system-contract.md#callback-payments)

[More on Callbacks →](../education/module-1/how-events-work#callbacks-to-destination-chains)