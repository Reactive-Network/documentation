---
title: "Lesson 3: How EVM Events Work"
sidebar_position: 3
description: Discover how EVM events enable smart contracts to communicate with the outside world on the Ethereum blockchain. Learn about event creation, emission, and listening, with a Chainlink's price oracle integration example.
slug: how-events-work
custom_edit_url: null
---

# Lesson 3: How EVM Events Work

## Overview

In the Ethereum blockchain, events serve as a means for smart contracts to communicate with the external world. When certain
conditions within a smart contract are met, it can emit events to log specific information on the blockchain. These events
are crucial for decentralized applications (dApps) because they provide a gas-efficient way to trigger and listen for
specific occurrences without constantly polling the blockchain.

Events in Ethereum are indexed by the EVM, making them searchable. This feature is especially useful for dApps that need to
monitor blockchain activities, like transfers, contract updates, or, as we'll see, price updates from oracles.

## How Do EVM Events Work?

When a smart contract emits an event, the event data is stored in the transaction's logs. These logs are attached to the
blocks of the blockchain but do not affect the blockchain state directly. Instead, they offer a way to record and retrieve
information, based on the event's parameters.

Developers define events in smart contracts using the event keyword, followed by the event name and the data types of the
information they want to log. To emit an event, the smart contract uses the emit keyword followed by the event name and the
data to be logged.

## Listening for Events

External applications, like dApps or backend services, can listen for these events. By specifying the event signature and,
optionally, filtering parameters, these applications can subscribe to real-time updates whenever the event is emitted. This
mechanism is pivotal for creating responsive and interactive blockchain applications.

## Example: Chainlink Price Oracle Integration

Chainlink's decentralized oracle network provides real-time data feeds for various cryptocurrencies, commodities, and other
off-chain data, directly into smart contracts. Let's see how an EVM event can be used in conjunction with Chainlink's price
oracle.

### Defining the Price Update Event

Imagine a smart contract that needs real-time price information to execute its logic, such as a DeFi lending platform that
adjusts collateral requirements based on the latest market prices. The contract might define an event like this:

```solidity
event PriceUpdated(string symbol, uint256 newPrice);
```

This event is designed to log the symbol of the asset and its new price whenever the price is updated.

### Emitting the Event

When the smart contract receives a new price update from Chainlink's oracle, it emits the `PriceUpdated` event:

```solidity
emit PriceUpdated("ETH", newEthPrice);
```

In this line, `newEthPrice` is the updated price of Ethereum fetched from Chainlink whose oracle is updated periodically.

### Listening for the Price Update

A dApp or an investor's portfolio management tool can listen for the `PriceUpdated` event to trigger specific actions, like
rebalancing a portfolio or issuing a loan. We will use a Reactive Smart Contract to catch these events, see the next lessons.

## Conclusion

EVM events are a powerful feature for smart contracts on the Ethereum blockchain, enabling efficient communication and
interaction with the external world. By integrating with services like Chainlink's price oracle, smart contracts can leverage
real-time data to make informed decisions, automate actions, and enhance the functionality of dApps. Through events, Ethereum
not only records transactions but also bridges the gap between the blockchain and the dynamic data of the real world, opening
a myriad of possibilities for developers and users alike.

The concepts from this lesson are illustrated in the [Basic Demo Smart Contract](../use-cases/use-case-1.md) use case,
feel free to try it yourself.
