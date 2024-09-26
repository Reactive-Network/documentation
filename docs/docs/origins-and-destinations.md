---
title: Origins & Destinations
sidebar_position: 2
description: Discover how Reactive Network manages event streams and transactions across different ecosystems and learn about network compatibility.
slug: /origins-and-destinations
hide_title: true
---

import ChainTable from '../../src/components/origins-destinations;
import KopliButton from '../../src/components/kopli-button';

![Origins & Destinations Image](./img/origins-and-destinations.jpg)

## Overview

The Reactive Network reads event streams and enables transactions across different ecosystems. An Origin acts as an event log provider, delivering events to reactive contracts within the Reactive Network. A Destination is the ecosystem where the actual state transition (transaction) takes place.

Origins and destinations don't have to be the same. Reactive contracts can be configured to work with multiple origins, and the system allows for multiple destinations, enabling conditional selection of which destination ecosystem will be used.

## Chains

:::warning
Currently, callbacks are supported only on the Ethereum Sepolia and Kopli Testnet. We strongly recommend using one of these as your destination chain.
:::

<KopliButton />






| Chain                                                    | Origin | Destination | Chain ID   | Callback Proxy Address                       | RPC URL                                |
|----------------------------------------------------------|--------|-------------|------------|----------------------------------------------|----------------------------------------| 
| [Ethereum Sepolia](https://sepolia.etherscan.io/)        | ✅      | ✅           | `11155111` | `0x33Bbb7D0a2F1029550B0e91f653c4055DC9F4Dd8` | https://rpc.sepolia.org                |
| [Ethereum Mainnet](https://etherscan.io/)                | ✅      | ➖           | `1`        | ➖                                            | https://ethereum-rpc.publicnode.com    |
| [Avalanche C-Chain](https://avascan.info/)               | ✅      | ⌛           | `43114`    | `0x76DdEc79A96e5bf05565dA4016C6B027a87Dd8F0` | https://api.avax.network/ext/bc/C/rpc  |
| [Arbitrum One](https://arbiscan.io/)                     | ✅      | ⌛           | `42161`    | ⌛                                            | https://arb1.arbitrum.io/rpc           |
| [Manta Pacific](https://pacific-explorer.manta.network/) | ✅      | ⌛           | `169`      | `0x9299472A6399Fd1027ebF067571Eb3e3D7837FC4` | https://pacific-rpc.manta.network/http |
| [Binance Smart Chain](https://bscscan.com/)              | ✅      | ➖           | `56`       | ➖                                            | https://bsc.drpc.org                   |
| [Polygon PoS ](https://polygonscan.com/)                 | ✅      | ➖           | `137`      | ➖                                            | https://polygon-mainnet.infura.io      |
| [Polygon zkEVM](https://zkevm.polygonscan.com/)          | ➖      | ➖           | `1101`     | ➖                                            | https://zkevm-rpc.com                  |
| [opBNB Mainnet](https://opbnbscan.com/)                  | ➖      | ➖           | `204`      | ➖                                            | https://opbnb-rpc.publicnode.com       |
| [Kopli Testnet](https://kopli.reactscan.net)             | ✅      | ✅           | `5318008`  | `0x0000000000000000000000000000000000FFFFFF` | https://kopli-rpc.rkt.ink              |
