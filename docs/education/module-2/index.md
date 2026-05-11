---
title: "Module 2: Intermediate - Building Blocks for Reactivity"
sidebar_position: 1
description: Practical introduction to DeFi and Reactive Contracts. Covers how Uniswap V2 liquidity pools and smart contracts work, then shows how Reactive Contracts can autonomously execute trades based on real-time on-chain conditions.
slug: /education/module-2
---

# Module 2: Intermediate - Building Blocks for Reactivity

# Overview

Module 1 covered the core concepts: how Reactive contracts work, how they process events, and how subscriptions and callbacks fit together. This module puts that foundation to use with a real DeFi protocol.

You'll start by learning how Uniswap V2 works under the hood: its liquidity pools, smart contracts, and trading mechanics. Then you'll see how a Reactive contract can plug into that system and autonomously execute trades when specific conditions are met. This is where the theory from Module 1 starts turning into practical applications.

[Lesson 6: How Uniswap V2 Works](./how-uniswap-works.md)

How Uniswap V2's liquidity pools and smart contracts enable decentralized trading. Covers the constant product formula, how swaps work, and what events Uniswap emits, which is what a Reactive contract will subscribe to in the next lesson.

[Lesson 7: Basic Reactive Functions](./basic-reactive-functions.md)

How Reactive contracts operate in a DeFi context. Walks through how a Reactive contract can monitor Uniswap events and autonomously execute trades when on-chain conditions match predefined criteria.