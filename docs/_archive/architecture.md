---
title: Architecture
sidebar_position: 1
description: "Discover the Reactive Network's architecture: Execution Layer, Reactive Smart Contracts, React VM, and Relayer Network. Explore event-based interactions and interoperability services for seamless blockchain communication."
slug: /architecture
hide_title: true
custom_edit_url: null
---

![Architecture Image](img/architecture.jpg)

## Overview

This section focuses on the structure of the Reactive Network. It includes several elements, each with its own specific role:

- [Execution Layer (EVM-compatible transaction network)](https://www.gocrypto.com/blog/what-are-evm-compatible-blockchains)
- [ReactVM](../docs/architecture/react-vm.md)
- [Reactive Smart Contracts](../reactive-smart-contracts.mdd)
- [Relayer Network](./relayer-network.md)

The following flowchart illustrates the architecture of the Reactive Network, consisting of multiple ReactVM instances hosting the corresponding Reactive Smart Contracts. These contracts interact with the Relayer Network, which includes components like Event Consensus and the Interoperability Service. External ecosystems, represented by Origin Chain Contracts and Destination Chain Contracts, emit logs that are processed by the Event Consensus and subsequently influence the Reactive Network.

```mermaid
%%{ init: { 'flowchart': { 'curve': 'basis' } } }%%
graph TB
subgraph RN["Reactive Network"]
        direction LR
        subgraph RV0["ReactVM(0)"]
            RC0(Reactive Smart Contract)
        end
        subgraph RV1["ReactVM(1)"]
            RC1(Reactive Smart Contract)
        end
        subgraph RVn["ReactVM(n)"]
            RCn(Reactive Smart Contract)
        end
    end
    subgraph Relayer Network
        EC("Event Consensus")
        LZ("Interoperability Service")
    end
    subgraph External Ecosystems
        SCC(Origin Chain Contract)
        DCC(Destination Chain Contract)
    end
RN -.-> LZ
LZ -. callback .-> DCC
RN -.-> C("Celestia") & AAT("Arbitrum Nova")
SCC -. emitted log .-> EC
EC -.-> RN

style RV0 stroke:transparent
style RV1 stroke:transparent
style RVn stroke:transparent
```

## Execution Layer

The Reactive Network is a fully EVM-compatible execution layer that supports Reactive Smart Contracts and facilitates event-based blockchain interactions. Unlike traditional Smart Contracts, a Reactive Smart Contract takes external events as input, rather than user transactions, and enables developers to execute arbitrary logic written in Solidity. Additionally, it allows posting callbacks (state changes) to the same or different destination network.

Developers can use their favorite Web3 tools when developing for the Reactive Network, including web3.js, ethers.js, truffle, hardhat, etc.

Reactive Network is built on the Arbitrum AnyTrust tech stack. Arbitrum provides the security guarantees of Ethereum while handling other inherent tasks of a modular blockchain, such as Consensus and Settlement. Data availability is assured by Celestia.

![Arbitrum](img/arbitrum.png) ![Celestia](img/celestia.png)
