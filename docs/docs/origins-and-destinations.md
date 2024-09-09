---
title: Origins & Destinations
sidebar_position: 2
description: Discover how Reactive Network manages event streams and transactions across different ecosystems and learn about network compatibility.
slug: /origins-and-destinations
hide_title: true
---

![Origins & Destinations Image](./img/origins-and-destinations.jpg)

# Overview

Reactive Network can read event streams and propagate transactions within various ecosystems. Origin serves as an event log provider facilitating the processing and delivery of events to Reactive Smart Contracts. Destination represents the designated ecosystem where the state transition (transaction) occurs.

Origins and destinations are not necessarily identical. A Reactive Smart Contract has the flexibility to specify multiple origins, and the system can have multiple destinations, including the conditional selection of the destination ecosystem.

| Chain             | Origin | Destination | Chain ID |
|-------------------|--------|-------------|----------|
| Ethereum Sepolia  | ✅      | ✅           | 11155111 |
| Ethereum Mainnet  | ✅      | TBA         | 1        |
| Avalanche C-Chain | ✅      | TBA         | 43114    |
| Arbitrum One      | ✅      | TBA         | 42161    |
| Manta Network     | ✅      | TBA         | 169      |
| BNB Smart Chain   | ✅      | TBA         | 56       |
| Polygon PoS       | ✅      | TBA         | 137      |
| Polygon zkEVM     | TBA    | TBA         | TBA      |
| Arbitrum Nova     | TBA    | TBA         | TBA      |
| opBNB             | TBA    | TBA         | TBA      |
| Solana            | TBA    | TBA         | TBA      |
| Sui               | TBA    | TBA         | TBA      |
