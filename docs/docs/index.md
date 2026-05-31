---
sidebar_position: 1
title: Getting Started
description: Explore Reactive Network, an EVM automation layer with CometBFT consensus and instant finality. Build reactive contracts, event-driven smart contracts for cross-chain, on-chain automation.
slug: /
hide_title: true
unlisted: true
---

![Reactive Docs Image](./img/reactive-docs.jpg)

## Overview

Reactive Network is an EVM automation layer built around reactive contracts, event-driven smart contracts for cross-chain, on-chain automation. It runs on CometBFT consensus, providing instant finality and roughly 1-second block times while maintaining full EVM compatibility.

Reactive contracts subscribe to event logs across EVM chains and execute Solidity logic automatically when matching events occur. Instead of relying on users or off-chain bots to trigger transactions, they decide autonomously when to send cross-chain callback transactions, providing on-chain if-this-then-that automation for smart contracts.

This makes it possible to build workflows such as automated stop-loss and take-profit orders, liquidation protection, portfolio rebalancing, and yield optimization across chains.

## Step 1 — Reactive Basics

[//]: # ([Origins & Destinations →]&#40;./origins-and-destinations.mdx&#41; Understand origin and destination chains and their callback proxy addresses.)

[Hyperlane →](./hyperlane.mdx) Learn how cross-chain callbacks are transported using Hyperlane.

[Reactive Contracts →](./reactive-contracts.md) Learn how reactive contracts subscribe to events and trigger actions.

[//]: # ([Economy →]&#40;./economy&#41; Understand callback payments and Reactive's economy.)

## Step 2 — Reactive Essentials

[Reactive Mainnet & Lasna Testnet →](./reactive-mainnet.mdx) Connect to Reactive Mainnet or Lasna Testnet.

[Reactive Library →](./reactive-lib.mdx) Use Reactive's abstract contracts and interfaces.

[Events & Callbacks →](./events-and-callbacks.md) Learn how event subscriptions trigger cross-chain callbacks. 

[Subscriptions →](./subscriptions.md) Configure event subscriptions.

[RNK RPC Methods →](./rnk-rpc-methods.md) Reference RPC methods for Reactive's nodes.

[//]: # (## Step 3 — Reactive Building)

[//]: # ()
[//]: # ([Reactive Demos →]&#40;./demos.md&#41; Explore working examples. )

[//]: # ()
[//]: # ([Reactive Demos on GitHub →]&#40;https://github.com/Reactive-Network/reactive-smart-contract-demos&#41; Clone demo projects and start building.)

[//]: # ()
[//]: # (## Extra)

[//]: # ()
[//]: # ([Reactscan →]&#40;./reactscan.md&#41; Explore reactive transactions and contracts.)

[//]: # ()
[//]: # ([Debugging →]&#40;./debugging.md&#41; Troubleshoot common issues.)

[//]: # ()
[//]: # ([Contacts →]&#40;../contacts/index.md&#41; Get support and connect with the community.)

