---
sidebar_position: 1
title: Getting Started
description: Explore Reactive Network, an EVM-compatible layer for advanced dApps. Learn about Reactive Smart Contracts that use data flows from multiple blockchains. Get started with setup, development and testing, and our unique architecture.
slug: /
hide_title: true
---

![Reactive Network Docs Image](./img/reactive-docs.jpg)

## Overview

The Reactive Network is an EVM-compatible execution layer that allows developers to create dApps using reactive contracts. These contracts differ from traditional smart contracts by using inversion-of-control for the transaction lifecycle, driven by data flows across blockchains rather than user input.

Reactive contracts receive event logs from various chains, executing Solidity logic based on these events instead of user transactions. They can independently determine the need to transmit data to destination chains, enabling conditional state changes. The Reactive Network offers fast and cost-effective computation through a proprietary parallelized EVM implementation.

## Step 1 — Reactive Basics

[Origins & Destinations →](./origins-and-destinations.mdx) Check on Reactive's origins and destinations, along with their Callback Proxy addresses.

[Hyperlane →](./hyperlane.mdx) Explore an alternative transport system for callbacks like Hyperlane.

[Reactive Contracts →](./reactive-smart-contracts.md) Understand the core concept of reactive contracts.

[ReactVM →](./reactvm.md) Learn about ReactVM and its purpose.

[Economy →](./economy) Explore the Reactive Network's economy and callback payment mechanism.

## Step 2 — Reactive Essentials

[Reactive Mainnet & Lasna Testnet →](./reactive-mainnet.mdx) Connect to Reactive Mainnet or Lasna Testnet.

[Reactive Library →](./reactive-lib.mdx) Implement abstract contracts and interfaces in your project.

[Events & Callbacks →](./events-and-callbacks.md#callbacks-to-destination-chains) Read up on how to work with events and callbacks in reactive contracts. 

[Subscriptions →](./subscriptions.md) Set up and manage subscriptions.

[RNK RPC Methods →](./rnk-rpc-methods.md) Key RPC methods for the Reactive Network's Geth version.

## Step 3 — Reactive Building

[Reactive Demos →](./demos.md) Hands-on demonstrations for the Reactive Network. 

[Reactive Demos on GitHub →](https://github.com/Reactive-Network/reactive-smart-contract-demos) Clone the GitHub project and start building.

## Extra

[Reactscan →](./reactscan.md) Learn to navigate the Reactive block explorer.

[Reactive Education →](../education/introduction/index.md) Begin a Reactive Tech education course.

[FAQ →](./faq.md) Find answers to common questions.

[Contacts →](../contacts/index.md) Reach out via socials for technical or trading inquiries.

