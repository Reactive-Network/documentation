---
title: Events & Callbacks
sidebar_position: 6
description: Explore how EVM events and callbacks operate within the Reactive Network.
slug: /events-&-callbacks
hide_title: true
---

![Events and Callbacks Image](./img/events-and-callbacks.jpg)

## Overview

Reactive Smart Contracts in the Reactive Network operate within isolated environments known as ReactVMs. These contracts can process incoming events, create transactions on destination chains, and use callbacks to communicate between networks.

## Event Processing

To handle incoming events, a Reactive Smart Contract must implement the `IReactive` interface. The primary method to be implemented is:

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

- **Event Feeding**: The Reactive Network triggers this method whenever an event matches the contract’s subscriptions.

- **EVM Capabilities**: Reactive Smart Contracts can use all EVM functionalities within the context of their private ReactVM.

- **Execution Context**: Contracts are executed within a ReactVM linked to the deployer's address and can't interact with contracts deployed by others.

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
    0,
    pair,
    client,
    token0,
    coefficient,
    threshold
);
emit Callback(chain_id, stop_order, CALLBACK_GAS_LIMIT, payload);
```

- **Payload Construction**: The payload encodes the function signature and parameters needed for the stop order.

- **Callback Emission**: The Callback event is emitted with the destination chain ID, target contract, gas limit, and the constructed payload.

### Callback Payments

Contracts must pay for callbacks either via pre-existing balances or immediate payments upon callback receipt to avoid blacklisting, which blocks future callbacks and transactions. Blacklisted contracts can be whitelisted by covering their debt using the `requestPayment` method.

#### Prepayment Options

- **Direct Transfers**: Proxies can accept direct prepayments.
- **Third-Party Payments**: The `depositTo` method allows others to add funds on behalf of a contract.

#### Immediate Payment

Contracts can handle immediate payments by implementing the `pay()` method or inheriting from `AbstractCallback` or `AbstractReactive`.

[More on Callback Payments →](./system-contract.md#callback-payments)

[More on Callbacks →](../education/module-1/how-events-work#callbacks-to-destination-chains)


