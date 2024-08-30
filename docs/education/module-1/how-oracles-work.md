---
title: "Lesson 5: How Oracles Work"
sidebar_position: 5
description: Discover the power of oracles in Reactive Smart Contracts (RSCs) and explore their role in integrating real-world data with blockchain applications.
slug: how-oracles-work
---

# Lesson 5: How Oracles Work

## Overview 

Reactive Smart Contracts are adept at monitoring on-chain events and executing subsequent on-chain actions in response. Yet within the smart contract ecosystem, a distinct category exists specifically for importing off-chain data onto the blockchain. These are known as oracles. Among the myriad events to which Reactive Smart Contracts can respond, those emitted by oracles hold significant importance. This article delves deeper into the concept of oracles, setting the stage for a clearer comprehension of the upcoming use case we'll explore. By unpacking the mechanisms and implications of oracles within the blockchain framework, we aim to equip you with the knowledge needed to fully grasp the potential and utility of Reactive Smart Contracts in interacting with real-world data.

By the end of this lesson, you will learn to:

* Understand the role of oracles in bridging the gap between blockchain and real-world data.
* Address the oracle problem by exploring how oracles bring off-chain data onto the blockchain.
* Implement and integrate oracles within smart contracts, using examples like Chainlink to fetch external data.
* Recognize the advantages of combining Reactive Smart Contracts with oracles for real-time interaction with on-chain and off-chain events.

## What Oracles Do

In the realm of blockchain and smart contracts, the necessity to interact with the real world presents a unique challenge. Smart contracts operate in a deterministic environment, where every operation must be verifiable and repeatable. However, to unlock the full potential of smart contracts, there's often a need to access data from the outside world — be it price feeds, weather reports, or other off-chain information. This requirement introduces the oracle problem: how to fetch off-chain data onto the blockchain without sacrificing the core principles of decentralization and trustlessness.

## Addressing the Oracle Problem

The oracle problem is tackled through entities known as oracles, which serve as bridges between the blockchain (on-chain) and the external world (off-chain). Oracles fetch data from a plethora of external sources to feed into the blockchain. This data could stem from APIs of financial marketplaces for price feeds, government databases for public records, or IoT devices for real-world physical data. The crux of an oracle's utility lies in its ability to validate and relay this data to smart contracts in a trust-minimized way.

The question of who signs the transactions for oracles to input data onto the blockchain brings us to the mechanism ensuring the data's integrity and trustworthiness. Typically, transactions are signed using the private keys of the oracle service provider.

To bolster security and mitigate the risks of failure or malicious manipulation, many decentralized oracle networks employ multisig protocols. Multisig requires a predefined number of signatures out of a set of participants to authorize a transaction, ensuring that no single entity can unilaterally submit data to the blockchain. This method adds a layer of decentralization and security to the process, aligning with the trustless nature of blockchain systems.

Some of the popular oracle providers are Chainlink and Band Protocol. These platforms aggregate data from multiple sources, ensuring data integrity and reducing the risk of manipulation.

## Practical Applications and Examples

Oracles unlock a myriad of use cases for smart contracts, allowing them to react to real-world events and data. Some notable applications include:

* DeFi Platforms: Utilizing price feed oracles to manage lending rates, liquidations, and asset swaps.

* Insurance: Triggering payouts based on verifiable events, like natural disasters, reported by trusted oracles.

* Online Betting: Smart contracts provide great tech solutions for trustless online betting, and oracles feed the data about the outcomes of sporting events to such systems.

## Code Example: Using Chainlink Oracles

Here's a simple example of how a smart contract can use Chainlink to fetch a USD/ETH price feed:

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

This contract demonstrates fetching the latest ETH/USD price using Chainlink's decentralized oracle network. It illustrates how smart contracts can securely and reliably access off-chain data.

However, as you may have observed, the smart contract can only request data through the getLatestPrice() function when it's explicitly called. To ensure your contract's data remains current, you should periodically invoke the function that queries the oracle. This challenge isn't insurmountable; one could simply update the price each time someone interacts with the contract, basing this interaction on the most recent price data. Yet this approach falls short of enabling your system to respond to price changes — or other oracle-generated events — in real time.

In the Ethereum ecosystem, while one smart contract can indeed call another, such calls must initially be triggered by an Externally Owned Account (EOA) address. An EOA is an Ethereum address controlled directly by the private key's owner, unlike smart contract addresses, which are governed by contract code. Consequently, each transaction is initiated and signed by a specific EOA, restricting the capacity for smart contracts to operate in real time. This limitation underscores the distinctive advantage of Reactive Smart Contracts.

## Why We Need Reactive Smart Contracts

Our exploration has previously touched upon the Inversion of Control principle, a defining characteristic of Reactive Smart Contracts. Here, it's worth emphasizing again: Reactive Smart Contracts stand out because they react not just to direct user transactions but to events across various EVM chains. Following these events, they execute on-chain actions, potentially on the same or different chains.

This brings us to the significance of oracles in our discussion: by integrating oracles with Reactive Smart Contracts, we unlock the potential to respond to off-chain events — once brought on-chain by oracles — with predefined on-chain actions as articulated in our Reactive Smart Contracts. This synergy between oracles and Reactive Smart Contracts enables a dynamic, responsive system capable of real-time interaction with both the digital and physical worlds. This broadens the scope and utility of blockchain technology beyond its current constraints.

## Conclusion

In this article, we’ve talked about the role of oracles within the context of Reactive Smart Contracts (RSCs), highlighting their significance in bridging the gap between on-chain and off-chain data. Key takeaways include:

- **Oracle Functionality:** Oracles are essential for importing real-world data onto the blockchain, enabling smart contracts to interact with external information such as price feeds, weather reports, and more.

- **Addressing the Oracle Problem:** The oracle problem is mitigated through decentralized oracle networks that ensure data integrity and minimize trust issues. Multisig protocols and reputable providers like Chainlink and Band Protocol enhance security and reliability.

- **Practical Applications:** Oracles facilitate various use cases, including decentralized finance (DeFi), insurance, and online betting, by providing real-time data to smart contracts and enabling automated, trustless interactions.

- **Integration with Reactive Smart Contracts:** The synergy between oracles and RSCs allows for dynamic, real-time responses to off-chain events. This integration leverages the strengths of both technologies to enhance the functionality and reach of blockchain applications.

For practical applications and further insights, explore our [use cases](../use-cases/index.md) and join our [Telegram](https://t.me/reactivedevs) group to engage with the community.