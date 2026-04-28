---
title: "Lesson 5: How Oracles Work"
sidebar_position: 5
description: How oracles bring off-chain data onto the blockchain and why they matter for Reactive Contracts. Covers the oracle problem, multisig security, Chainlink integration, and how Reactive Contracts can respond to oracle events in real time.
slug: how-oracles-work
---

# Lesson 5: How Oracles Work

## Overview 

Smart contracts can only work with data that already exists on the blockchain. They can't reach out to an API, check a price feed, or read a weather report on their own. Oracles solve this by bringing off-chain data on-chain, where smart contracts can use it.

This matters for Reactive contracts because oracles emit events when they deliver new data. A Reactive contract can subscribe to those events and act on them automatically, responding to price changes, real-world outcomes, or any other external data the moment it arrives on-chain.

By the end of this lesson, you'll understand:

- What oracles do and why smart contracts need them
- How the oracle problem is addressed through decentralization and multisig protocols
- How to integrate oracle data into a smart contract using Chainlink
- Why combining oracles with Reactive contracts enables real-time responses to off-chain events

## What Oracles Do

Smart contracts run in a deterministic environment where every operation must be verifiable and repeatable. But many useful applications need data from outside the blockchain: price feeds, sports results, IoT sensor readings, public records. The challenge is getting that data on-chain without breaking the decentralization and trustlessness that make smart contracts valuable in the first place. This is known as the oracle problem.

## How Oracles Address This

Oracles act as bridges between the blockchain and the external world. They pull data from outside sources (financial APIs, government databases, IoT devices) validate it, and submit it to smart contracts on-chain.

The natural question is: who signs these transactions? Typically, the oracle service provider holds the private keys used to submit data. To prevent any single entity from manipulating the data or becoming a point of failure, many decentralized oracle networks use multisig protocols. Multisig requires a set number of participants to sign off on each data submission before it's accepted on-chain. This adds a layer of decentralization to the process and aligns with the trustless design of blockchain systems.

Chainlink and Band Protocol are two of the most widely used oracle providers. Both aggregate data from multiple independent sources to reduce the risk of manipulation and improve data integrity.

## Practical Applications

Oracles open up use cases that wouldn't be possible with on-chain data alone:

**DeFi platforms** use price feed oracles to manage lending rates, trigger liquidations, and calculate asset swaps. Without reliable, up-to-date pricing, most DeFi protocols couldn't function.

**Insurance** contracts can trigger payouts based on verifiable real-world events (natural disasters or flight delays) reported by trusted oracle networks.

**Prediction markets and betting** platforms use oracles to feed the outcomes of sporting events, elections, or other real-world results into smart contracts that handle trustless payouts.

## Code Example: Chainlink Price Feed

Here's a basic contract that fetches the latest ETH/USD price from Chainlink's oracle network:

```solidity
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Ethereum Mainnet
     * Aggregator: ETH/USD
     * Address: 0x... (Chainlink ETH/USD Price Feed Contract Address)
     */
    constructor() public {
        priceFeed = AggregatorV3Interface(0x...);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            /* uint80 roundID */,
            int price,
            /* uint startedAt */,
            /* uint timeStamp */,
            /* uint80 answeredInRound */
        ) = priceFeed.latestRoundData();
        return price;
    }
}
```

This works, but notice the limitation: `getLatestPrice()` only runs when someone calls it. The contract can't watch for price changes on its own. You could work around this by updating the price every time someone interacts with the contract, but that still doesn't let the system respond to changes in real time.

This is a fundamental constraint of traditional smart contracts. One contract can call another, but every chain of calls must originate from an externally owned account (EOA), an address controlled by someone's private key. Nothing happens unless a person or bot initiates a transaction.

## Where Reactive Contracts Change This

This is where the Inversion of Control principle from earlier lessons becomes directly relevant. Reactive contracts don't wait for someone to call them. They subscribe to events, including events emitted by oracles, and execute automatically when those events occur.

By combining oracles with Reactive contracts, you get a system that can respond to off-chain events the moment they're recorded on-chain. An oracle delivers a new price, a game result, or a sensor reading. It emits an event. A Reactive contract picks it up and executes whatever logic you've defined (on the same chain or across different chains) without any manual trigger.

Oracles solve the data problem (getting real-world information on-chain) whereas Reactive Contracts solve the execution problem (acting on that information automatically). Together they enable applications that respond to the real world in real time, fully on-chain.

## About This Course

This course is designed to give you both the theory and the hands-on experience to start building with Reactive contracts. It includes detailed lectures, code examples on GitHub, and video workshops covering everything from basic concepts to real-world deployments.

Whether you want to understand how Reactive contracts work under the hood or jump straight into building, the course adapts to either path. Explore the [use cases](../use-cases/index.md) if you want to see what's possible, or start from Module 1 to build up from the fundamentals.

Join the [Telegram](https://t.me/reactivedevs) community if you have questions or want to connect with other developers working with Reactive contracts.