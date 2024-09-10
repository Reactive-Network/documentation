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

| Chain             | Origin | Destination | Chain ID   | Callback Proxy Address                       |
|-------------------|--------|-------------|------------|----------------------------------------------| 
| Ethereum Sepolia  | ✅      | ✅           | `11155111` | `0x33Bbb7D0a2F1029550B0e91f653c4055DC9F4Dd8` |
| Ethereum Mainnet  | ✅      | TBA         | `1`        | TBA                                          |
| Avalanche C-Chain | ✅      | ✅           | `43114`    | `0x76DdEc79A96e5bf05565dA4016C6B027a87Dd8F0` |
| Arbitrum One      | ✅      | TBA         | `42161`    | TBA                                          |
| Manta Network     | ✅      | ✅           | `169`      | `0x9299472A6399Fd1027ebF067571Eb3e3D7837FC4` |
| BNB Smart Chain   | ✅      | TBA         | `56`       | TBA                                          |
| Polygon PoS       | ✅      | TBA         | `137`      | TBA                                          |
| Polygon zkEVM     | TBA    | TBA         | TBA        | TBA                                          |
| Arbitrum Nova     | TBA    | TBA         | TBA        | TBA                                          |
| opBNB             | TBA    | TBA         | TBA        | TBA                                          |
| Solana            | TBA    | TBA         | TBA        | TBA                                          |
| Sui               | TBA    | TBA         | TBA        | TBA                                          |
