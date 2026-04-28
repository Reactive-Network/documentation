---
title: "Module 1: Beginner — Foundations of Reactive Contracts"
sidebar_position: 1
description: Introduction to Reactive Contracts covering how they respond to on-chain events, EVM event handling and callbacks, the ReactVM dual-state environment, subscriptions, and how oracles connect blockchain with off-chain data.
slug: /education/module-1
---

# Module 1: Beginner — Foundations of Reactive Contracts

# Overview

Module 1 covers the core concepts behind Reactive contracts: how they work, what makes them different from regular smart contracts, and the infrastructure that supports them. By the end of this module, you'll understand how Reactive contracts detect events, execute responses, and interact with off-chain data.

[Lesson 1: Reactive Contracts](./reactive-contracts.md)

How Reactive contracts work in practice, focusing on their reactive nature. Walks through real use cases like data collection with oracles and executing stop orders on decentralized exchanges.

[Lesson 2: How Events and Callbacks Work](./how-events-work.md)

How EVM events and callbacks enable communication between smart contracts and external systems. Includes a practical example using Chainlink's price oracle integration.

[Lesson 3: ReactVM and Reactive Network As a Dual-State Environment](./react-vm.md)

Reactive Network runs on a dual-state environment: ReactVM for Reactive logic and Reactive Network (RNK) for on-chain execution. This lesson explains how state management and transactions work across both.

[Lesson 4: How Subscriptions Work](./subscriptions.md)

Subscriptions are how Reactive contracts listen for specific on-chain events. This lesson covers setting them up, managing them, and using them to automate contract execution.

[Lesson 5: How Oracles Work](./how-oracles-work.md)

Oracles bridge the gap between blockchain and real-world data. This lesson explains how they work, covers multisig protocols for securing oracle data, and walks through applications in DeFi, insurance, and prediction markets.