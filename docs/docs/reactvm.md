---
title: ReactVM
sidebar_position: 5
description: Explore ReactVM, a dedicated EVM within the Reactive Network for executing Reactive Contracts. It enables random transactions while maintaining order, serving as a sandbox for contract deployment.
slug: /reactvm
hide_title: true
---

![ReactVM Image](./img/rvm.jpg)

## Overview

The ReactVM is a specialized Ethereum Virtual Machine (EVM) within the Reactive Network, designed to execute [Reactive Contracts](./reactive-contracts) (RCs). It allows transactions to occur in random order across multiple threads while maintaining order within each ReactVM.

Technically, ReactVM is an isolated execution environment that activates when an event matches an RC's subscription. Although this approach introduces some overhead, we've optimized the process by separating the EVM from Geth, reducing ReactVm's boot time to approximately 100 microseconds. This overhead is insignificant relative to the network's processing capabilities.

## My ReactVM

When you deploy a Reactive Contract, it is assigned to a ReactVM. The ReactVM's address will match the Externally Owned Account (EOA) address used for the deployment. All smart contracts deployed to the Reactive Network will ultimately reside within your personal ReactVM, enabling shared state and interaction among contracts. Although multiple RCs can be deployed within a single ReactVM, this practice is generally discouraged.

### Calling subscribe()

Invoking `subscribe()` or `unsubscribe()` within an RVM will not have any tangible effect. For interactions, use callbacks instead of directly calling these functions within RVMs.

## State

The Reactive Network's state is determined by the collective states of individual ReactVMs and their connections to external blockchains. Each ReactVM's state is tied to specific block numbers and hashes from these chains, embedded within ReactVM blocks. This linkage is necessary for tracking and managing reorgs in the originating chains, enabling the network to respond to changes.

### Dual-State Environment

The Reactive Network operates within a dual-state environment that supports parallel transaction execution. While the EVM processes commands sequentially in a single-threaded manner, ReactVMs can operate independently and in parallel across different cores or threads. This architecture facilitates the management of various operations, including fund flows and token management, with each contract copy having its own state and execution context.

Each [Reactive Contract](./reactive-contracts) has two instances with different states, both initialized in the constructor:

&nbsp;&nbsp;&nbsp;&nbsp; **ReactVM State**: Updates when an event occurs.

&nbsp;&nbsp;&nbsp;&nbsp; **Reactive Network State**: Updates when you manually call its functions.

For example, in a governance contract, vote counts are maintained in the ReactVM state, whereas operational commands like `pause()` are part of the Reactive Network state. The primary logic resides within the ReactVM state.

## Reactive Network Processing Flow

The following diagram illustrates a process involving the interaction between an Origin Chain, the Reactive Network along with ReactVM, and a Destination Chain.

![Reactive Network Lifecycle](./img/global-processing-flow.png)

[More on ReactVM →](../education/module-1/react-vm.md)
