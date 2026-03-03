---
title: ReactVM
sidebar_position: 5
description: Learn about ReactVM, the execution environment where Reactive Contracts process event logs and execute event-driven automation across chains.
slug: /reactvm
hide_title: true
---

![ReactVM Image](./img/rvm.jpg)

## Overview

ReactVM is a private execution environment within Reactive Network where [Reactive Contracts](./reactive-contracts) process events and execute logic. Each Reactive Contract runs inside a dedicated ReactVM that activates when subscribed events occur. Event logs are delivered to the ReactVM, where the contract executes Solidity logic and determines whether callback transactions should be sent to destination chains. ReactVMs run independently and can execute in parallel, allowing Reactive Contracts to process events while maintaining deterministic execution within each ReactVM.

## My ReactVM

Each deployed Reactive Contract is assigned to a ReactVM derived from the deployer’s address. Contracts deployed from the same EOA share the same ReactVM and can interact through shared state. Although multiple Reactive Contracts can be deployed within one ReactVM, separating contracts across ReactVMs is generally recommended.

### Calling subscribe()

Calling `subscribe()` or `unsubscribe()` inside ReactVM has no effect. Subscriptions must be managed through the Reactive Network instance of the contract. ReactVM contracts should communicate through callback transactions instead of direct subscription calls.

## State

Each ReactVM maintains its own state based on processed events. ReactVM blocks include references to origin-chain block numbers and hashes, allowing Reactive Network to track and handle chain reorganizations. ReactVM states operate independently, and the overall Reactive Network state is the combination of all ReactVM states.

### Dual-State Environment

Each Reactive Contract exists in two environments with separate state:

- **ReactVM State** — updated automatically when subscribed events occur
- **Reactive Network State** — updated when EOAs call contract functions

Both instances share the same bytecode but operate independently.

For example, in a governance contract:

- Vote counts may be maintained in ReactVM state
- Administrative actions such as `pause()` may exist in the Reactive Network state

Most automation logic runs inside ReactVM.

## Reactive Network Processing Flow

The diagram below shows how events from an origin chain are processed by Reactive Network and ReactVM, and how resulting actions are delivered to destination chains.

![Reactive Network Lifecycle](./img/global-processing-flow.png)

[More on ReactVM →](../education/module-1/react-vm.md)
