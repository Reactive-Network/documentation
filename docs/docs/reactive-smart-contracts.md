---
title: Reactive Smart Contracts
sidebar_position: 3
description: Explore Reactive Smart Contracts, which enable event-driven interactions and transaction creation. Learn their setup, processing, and applications through clear examples.
slug: /reactive-smart-contracts
hide_title: true
---

![Reactive Smart Contracts Image](./img/reactive-smart-contracts.jpg)

## Overview

Reactive smart contracts (RSCs) operate on a standard Ethereum Virtual Machine (EVM) and can be written in any EVM-compatible language, with Application Binary Interfaces (ABIs) particularly customized for Solidity. Their unique capabilities stem from reactive nodes and a specialized pre-deployed system contract.

## Distinctive Features

RSCs autonomously monitor blockchains for specific events and execute predefined actions. This reactivity sets them apart from traditional smart contracts, which are passive and require direct transactions initiated by Externally Owned Accounts (EOAs). Another key feature is the Inversion of Control (IoC), where RSCs autonomously decide when to execute based on predefined events, contrasting with the direct control model of traditional smart contracts.

RSCs first specify the blockchains, contracts, and events they will monitor. Upon detecting an event of interest, they execute predefined logic, update their state, and run transactions trustlessly within the Reactive Network.

## Deployment Nuances

Reactive contracts are deployed simultaneously to the main reactive network and a private [ReactVM](./reactvm.md). The main network copy is accessible by EOAs and can interact with the system contract to manage subscriptions. The ReactVM copy processes incoming events from origin chain contracts but can't be interacted with by the EOA's copy.

## State and Interaction

These two contract copies don't share state and can't interact directly. Since both copies use the same bytecode, it is recommended to identify the deployment target in the constructor and guard methods accordingly. You can determine if the contract is being deployed to ReactVM by interacting with the system contract; calls will revert if it is not present in ReactVMs. Refer to [reactive demos](./demos.md) for examples.

## Capabilities within ReactVM

Reactive contracts running in the [ReactVM](./reactvm.md) have limited capabilities for interaction with anything outside their VM. They can only passively receive log records from the reactive network and initiate calls to destination chain contracts.

[More on Reactive Smart Contracts →](../education/module-1/reactive-smart-contracts.md)
