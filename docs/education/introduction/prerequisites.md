---
title: Technical and Knowledge Prerequisites for Mastering Reactive Contracts
sidebar_position: 2
description: What you need to know before starting the Reactive Contracts course. Covers required background in Solidity, EVM, Git, and command line tools, plus wallet setup for Ethereum Sepolia testnet deployment.
slug: prerequisites
---

# Technical and Knowledge Prerequisites for Mastering Reactive Contracts

## Overview 

This course aims to cover everything you need to understand and work with Reactive contracts, including deploying and interacting with them. That said, some foundational knowledge will make the material much easier to follow. Here's what helps to know going in, along with resources to get up to speed if anything is unfamiliar.

## What You Need to Know

### Solidity and Smart Contract Development

You should be comfortable writing simple smart contracts in Solidity and familiar with its core concepts: variables, functions, modifiers, and contract structure. You don't need to be an expert, but the course assumes you've written and deployed at least a basic contract before.

Resource: [Solidity by Example](https://solidity-by-example.org/) walks you through Solidity from basics to more advanced topics with hands-on examples.

### Ethereum Virtual Machine (EVM)

A general understanding of how the EVM executes smart contracts will help. Knowing how function calls work, how transactions are signed, and what happens when a contract runs is enough. You don't need to understand bytecode-level details.

Resource: The [Ethereum EVM illustrated](https://takenobu-hs.github.io/downloads/ethereum_evm_illustrated.pdf) is a visual walkthrough of how the EVM works internally.

### Git and Command Line

The course includes code examples you'll clone and run locally, so you'll need to be comfortable with basic Git commands and working in a terminal. Familiarity with an IDE like Visual Studio Code also helps.

Resource: The [Pro Git](https://git-scm.com/book/en/v2) covers everything you need to know about Git. For terminal basics, try [Codecademy's Command Line](https://www.codecademy.com/learn/learn-the-command-line) course.

### Ethereum Wallet and Test ETH

You'll need an Ethereum wallet (like MetaMask) and some test ETH on the Ethereum Sepolia testnet to deploy and interact with contracts during the course. Test ETH is used to cover gas fees on the testnet, so you can experiment without spending real funds.

Resource: Get Sepolia ETH from the [Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia).

## What the Course Covers for You

Some topics are important for working with Reactive contracts but aren't prerequisites as the course teaches them directly. You don't need to study these in advance.

### EVM Events

Events are central to how Reactive contracts work. They act as the triggers that tell a Reactive contract something has happened on another chain. The course covers how events are emitted, logged, and consumed in detail.

Resource: [How Events and Callbacks Work](../module-1/how-events-work.md).

### Decentralized Finance (DeFi) Concepts

Some modules use DeFi protocols like Uniswap V2 as real-world examples. Concepts like liquidity pools and automated market makers come up, but the course explains them as they become relevant. No prior DeFi knowledge required.
