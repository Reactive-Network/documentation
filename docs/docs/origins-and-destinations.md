---
title: Origins & Destinations
sidebar_position: 2
description: Discover how Reactive Network manages event streams and transactions across different ecosystems and learn about network compatibility.
slug: /origins-and-destinations
hide_title: true
---

![Origins & Destinations Image](./img/origins-and-destinations.jpg)

# Overview

The Reactive Network reads event streams and enables transactions across different ecosystems. An Origin acts as an event log provider, delivering events to reactive contracts within the Reactive Network. A Destination is the ecosystem where the actual state transition (transaction) takes place.

Origins and destinations don't have to be the same. Reactive contracts can be configured to work with multiple origins, and the system allows for multiple destinations, enabling conditional selection of which destination ecosystem will be used.

:::warning
Currently, callbacks are supported only on the Ethereum Sepolia and Kopli Testnet. We strongly recommend using one of these as your destination chain.
:::


| Chain             | Origin | Destination | Chain ID   | Callback Proxy Address                       |
|-------------------|--------|-------------|------------|----------------------------------------------| 
| Ethereum Sepolia  | ✅      | ✅           | `11155111` | `0x33Bbb7D0a2F1029550B0e91f653c4055DC9F4Dd8` |
| Ethereum Mainnet  | ✅      | ➖           | `1`        | ➖                                            |
| Avalanche C-Chain | ✅      | ⌛           | `43114`    | `0x76DdEc79A96e5bf05565dA4016C6B027a87Dd8F0` |
| Arbitrum One      | ✅      | ⌛           | `42161`    | ⌛                                            |
| Manta Network     | ✅      | ⌛           | `169`      | `0x9299472A6399Fd1027ebF067571Eb3e3D7837FC4` |
| BNB Smart Chain   | ✅      | ➖           | `56`       | ➖                                            |
| Polygon PoS       | ✅      | ➖           | `137`      | ➖                                            |
| Polygon zkEVM     | ➖      | ➖           | `1101`     | ➖                                            |
| opBNB             | ➖      | ➖           | `204`      | ➖                                            |
| Kopli Testnet     | ✅      | ✅           | `5318008`  | `0x0000000000000000000000000000000000FFFFFF` |
