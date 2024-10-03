---
title: "Lesson 2: How Events and Callbacks Work"
sidebar_position: 2
description: Discover how EVM events enable smart contracts to communicate with the outside world on the Ethereum blockchain. Learn about event creation, emission, and listening, with a Chainlink's price oracle integration example. Learn on callbacks to destination chains.
slug: how-events-work
---

# Lesson 2: How Events and Callbacks Work

## Overview

In Ethereum, events enable smart contracts to communicate with the external world by logging specific information when certain conditions are met. This allows decentralized applications (dApps) to trigger and respond to occurrences without constantly polling the blockchain. Events are indexed by the EVM, making them easily searchable, which is particularly useful for monitoring blockchain activities like transfers, contract updates, and price changes from oracles.

This lesson focuses on the role of events and callbacks in smart contracts. By learning how to emit, process, and listen to events, developers can create dynamic dApps that respond to blockchain changes in real-time. We will also explore how Reactive Smart Contracts use the `react()` method to handle events and initiate cross-chain transactions through callbacks, enabling improved functionality within the Reactive Network.

By the end of this lesson, you will learn to:

* Define and emit events in an Ethereum smart contract.
* Listen for and process events using decentralized applications.
* Implement event processing in Reactive Smart Contracts.
* Send callbacks to trigger actions on destination chains.

## How EVM Events Work

When a smart contract emits an event, the event data is stored in the transaction's logs. These logs are attached to the blocks of the blockchain but don't directly affect the blockchain state. Instead, they provide a way to record and retrieve information based on the event's parameters.

Developers define events in smart contracts using the `event` keyword, followed by the event name and the data types of the information they want to log. To emit an event, the smart contract uses the `emit` keyword, followed by the event name and the data to be logged.

External applications, such as dApps or backend services, can listen for these events. By specifying the event signature and, optionally, filtering parameters, these applications can subscribe to real-time updates whenever the event is emitted. This mechanism is pivotal for creating responsive and interactive blockchain applications.

## Example: Chainlink Price Oracle Integration

Chainlink's decentralized oracle network provides real-time data feeds for various cryptocurrencies, commodities, and other off-chain data, directly into smart contracts. Let's see how an EVM event can be used in conjunction with Chainlink's price oracle.

### Defining the Price Update Event

Imagine a smart contract that needs real-time price information to execute its logic, such as a DeFi lending platform that adjusts collateral requirements based on the latest market prices. The contract might define an event like this:

```solidity
event PriceUpdated(string symbol, uint256 newPrice);
```

This event is designed to log the symbol of the asset and its new price whenever the price is updated.

### Emitting the Event

When the smart contract receives a new price update from Chainlink's oracle, it emits the `PriceUpdated` event:

```solidity
emit PriceUpdated("ETH", newEthPrice);
```

In this line, `newEthPrice` is the updated price of Ethereum fetched from Chainlink, whose oracle is updated periodically.

### Listening for the Price Update

A dApp or an investor's portfolio management tool can listen for the `PriceUpdated` event to trigger specific actions such as rebalancing a portfolio or issuing a loan. We will use a Reactive Smart Contract to catch these events in later lessons.

## Event Processing in Reactive Smart Contracts

Reactive Smart Contracts must implement the [`IReactive`](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/IReactive.sol) interface to handle incoming events. This requires defining the `react()` method with the following signature:

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

The function parameters are:

- `chain_id`: A `uint256` representing the origin chain ID as per `EIP155`.
- `_contract`: The address of the contract on the origin chain emitting the event.
- `topic_0`, `topic_1`, `topic_2`, `topic_3`: `uint256` values representing the topics of the event.
- `data`: The event data encoded as a byte array.
- `block_number`: The block number in the origin chain where the event log is recorded.
- `op_code`: A `uint256` representing the opcode associated with the event.

The Reactive Network continuously monitors event logs and matches them against the subscription criteria defined in reactive contracts. When an event that meets the criteria is detected, the network triggers the `react()` method, passing in relevant details.

Reactive Smart Contracts can access all standard EVM functionalities. However, they run within a private ReactVM, which restricts them to interacting with contracts deployed by the same deployer. This isolation ensures that reactive contracts maintain a controlled and secure environment while processing events from the Reactive Network.

## Callbacks to Destination Chains

Reactive Smart Contracts can initiate transactions on destination chains by emitting log records in a specific format. These records are picked up by the Reactive Network, which then carries out the desired transactions on the relevant chain.

### Emitting Callback Events

To request actions on destination chains, the user must trigger a `Callback` event in the Reactive Contract. Once triggered, this event is emitted by the smart contract and provides critical information that the Reactive Network needs to create and submit the transaction.

The `Callback` event includes the following parameters:

- `chain_id`: The EIP155 chain ID of the destination network.
- `_contract`: The address of the destination contract.
- `gas_limit`: The gas limit for the transaction on the destination chain.
- `payload`: Encoded data that specifies a function call on the destination. This data directs the Reactive Network on how to execute the intended action on the destination contract.

Here’s the signature of the `Callback` event:

```solidity
event Callback(
    uint256 indexed chain_id,
    address indexed _contract,
    uint64 indexed gas_limit,
    bytes payload
);
```

### Processing the Callback

When the `Callback` event is emitted, the Reactive Network detects it and processes the `payload`, which encodes the transaction details in a specific format. The Reactive Network then submits a transaction to the specified contract on the destination chain, using the provided `chain_id` and  `gas_limit`.

### Important Note on Authorization

For security and authorization purposes, the Reactive Network automatically replaces the first 160 bits of the call arguments within the `payload` with the RVM ID (equivalent to the ReactVM address) of the calling reactive contract. This RVM ID is identical to the contract deployer's address. As a result, the first argument in your callback will always be the ReactVM address (of type `address`), regardless of the variable name you use in your Solidity code.

### Encoding and Emitting the Callback Event

To initiate actions on a destination chain, you can encode the transaction details into the `payload` and emit the `Callback` event. For example, in the Uniswap Stop Order Demo, this process is used to trigger token sales through the destination chain contract:

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

## Conclusion

In this lesson, we've explored the fundamentals of events and callbacks in Ethereum and their application in Reactive Smart Contracts. Key takeaways include:

- **Understanding Events:** Events allow smart contracts to log information and interact with external applications, providing a powerful way to respond to on-chain activities without directly altering the blockchain state.

- **Reactive Smart Contracts and the react() Method:** RSCs use the `react()` method to autonomously process incoming events based on specified criteria, enabling real-time, decentralized, and responsive contract behavior.

- **Callbacks for Cross-Chain Transactions:** RSCs can initiate actions on different blockchains using callbacks, broadening their functionality beyond single-chain constraints and facilitating more complex decentralized applications.

- **Secure and Controlled Execution:** The ReactVM environment ensures that RSCs operate securely by restricting interactions to contracts deployed by the same deployer, maintaining a controlled execution space.

The concepts from this lesson are shown in the [Basic Demo Smart Contract](../use-cases/use-case-1.md) use case. Feel free to explore it and join our [Telegram](https://t.me/reactivedevs) group for additional guidance.
