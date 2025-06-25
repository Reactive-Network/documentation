---
title: ReactVM
sidebar_position: 5
description: Explore ReactVM, a dedicated EVM within the Reactive Network for executing Reactive Smart Contracts. It enables random transactions while maintaining order, serving as a sandbox for contract deployment.
slug: /reactvm
hide_title: true
---

![ReactVM Image](./img/rvm.jpg)

## Overview

The ReactVM is a specialized Ethereum Virtual Machine (EVM) within the Reactive Network, designed to execute [Reactive Smart Contracts](./reactive-smart-contracts.md) (RSCs). It allows transactions to occur in random order across multiple threads while maintaining order within each ReactVM.

Technically, ReactVM is an isolated execution environment that activates when an event matches an RSC's subscription. Although this approach introduces some overhead, we've optimized the process by separating the EVM from Geth, reducing ReactVm's boot time to approximately 100 microseconds. This overhead is insignificant relative to the network's processing capabilities.

## My ReactVM

When you deploy a Reactive Smart Contract, it is assigned to a ReactVM. The ReactVM's address will match the Externally Owned Account (EOA) address used for the deployment. All smart contracts deployed to the Reactive Network will ultimately reside within your personal ReactVM, enabling shared state and interaction among contracts. Although multiple RSCs can be deployed within a single ReactVM, this practice is generally discouraged.

### Calling subscribe()

Invoking `subscribe()` or `unsubscribe()` within an RVM will not have any tangible effect. For interactions, use callbacks instead of directly calling these functions within RVMs.

## State

The Reactive Network's state is determined by the collective states of individual ReactVMs and their connections to external blockchains. Each ReactVM's state is tied to specific block numbers and hashes from these chains, embedded within ReactVM blocks. This linkage is necessary for tracking and managing reorgs in the originating chains, enabling the network to respond to changes.

### Dual-State Environment

The Reactive Network operates within a dual-state environment that supports parallel transaction execution. While the EVM processes commands sequentially in a single-threaded manner, ReactVMs can operate independently and in parallel across different cores or threads. This architecture facilitates the management of various operations, including fund flows and token management, with each contract copy having its own state and execution context.

Each [Reactive Smart Contract](./reactive-smart-contracts.md) has two instances with different states, both initialized in the constructor:

&nbsp;&nbsp;&nbsp;&nbsp; **ReactVM State**: Updates when an event occurs.

&nbsp;&nbsp;&nbsp;&nbsp; **Reactive Network State**: Updates when you manually call its functions.

For example, in a governance contract, vote counts are maintained in the ReactVM state, whereas operational commands like `pause()` are part of the Reactive Network state. The primary logic resides within the ReactVM state.

## Reactive Network Processing Flow

The following diagram illustrates a process involving the interaction between an Origin Chain, the Reactive Network along with ReactVM, and a Destination Chain.

![Reactive Network Lifecycle](./img/global-processing-flow.png)

### Step-by-step Description

**New Block in Origin Chain**: The process starts when a new block is created on the Origin Chain. This block contains multiple transactions.

**Catch Block in Reactive Network**: The Reactive Network catches the newly created block from the Origin Chain.

**Iterate Transactions**: The system iterates through all the transactions in the newly caught block.

**Extract Transaction Logs**: Transaction logs are extracted from each transaction.

**Find Transactions at System SC**: The system identifies specific transactions that need to be processed by the System Smart Contract (System SC).

**Prepare Transaction and Publish to RVM**: The identified transactions are prepared and published to the ReactVM for further processing.

**ReactVM Processing**:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **ReactVM Exists?**: The system checks if a ReactVM already exists.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **No**: If no ReactVM exists, the system sets up a new ReactVM.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Run ReactVM**: The ReactVM is run to process the transaction.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Execute Transaction**: The transaction is executed within the ReactVM.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Stop ReactVM**: After executing the transaction, the ReactVM is stopped.

**Transaction Receipt**: After the ReactVM completes processing the transaction, a transaction receipt is generated.

**Prepare Transaction for Destination Chain**: Based on the transaction receipt, a new transaction is prepared for the Destination Chain.

**Transaction at Mem. Pool in Destination Chain**: The prepared transaction is placed in the memory pool of the Destination Chain, ready to be included in a new block on that chain.

[More on ReactVM →](../education/module-1/react-vm.md)
