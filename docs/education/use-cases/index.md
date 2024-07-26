---
title: "Use Cases"
sidebar_position: 1
description: Discover practical uses of Reactive Smart Contracts with demos on low-latency log monitoring and Uniswap V2 stop orders. Deploy and test these examples to boost your expertise.
slug: /education/use-cases
custom_edit_url: null
---

# Use Cases

## Overview

The Use Cases section primarily focuses on analyzing scenarios where Reactive Smart Contracts might be a game changer.

The [Basic Demo Smart Contract](use-case-1.md) is a basic use case of the Reactive Network with low-latency monitoring of logs emitted by arbitrary contracts on any chain (Sepolia testnet in this case) and enabling calls from the Reactive Network to these arbitrary chain contracts.

The [Deploying Reactive Smart Contracts with Remix](remix-ide-demo.md) article is a guide walking you through deploying Reactive Smart Contracts using the Remix Development Environment.

The [Uniswap V2 Stop Order Demo](use-case-3.md) is a demo of a simple reactive smart contract that implements a stop order upon a Uniswap V2 liquidity pool. Study its setup and try deploying and testing it yourself.

## GitHub Repository

Visit our [GitHub repository](https://github.com/Reactive-Network/reactive-smart-contract-demos) for all the important information on use cases and more. Clone the project and start exploring!

## Get Kopli Testnet REACT

Acquire Kopli REACT tokens by simply interacting with the Reactive faucet contract on Sepolia. Follow the link below for the details.

[More information on Kopli Testnet →](../../docs/kopli-testnet.md)

## Environment Setup

To set up the foundry environment, run:

```
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

Install dependencies:

```
forge install
```

## Development & Testing

To compile artifacts:

```
forge compile
```

To run the test suite:

```
forge test -vv
```

To inspect the call tree:

```
forge test -vvvv
```

## Environment Variable Configuration

The following environment variables are used in the instructions for running the demos and should be configured beforehand.

`SEPOLIA_RPC`

RPC address for Sepolia testnet, `https://rpc2.sepolia.org` unless you want to use your own.

`SEPOLIA_PRIVATE_KEY`

Private key to your Sepolia wallet.

`REACTIVE_RPC`

RPC address for Reactive testnet, which should be set to `https://kopli-rpc.reactive.network/`.

`REACTIVE_PRIVATE_KEY`

The private key to your Reactive wallet.

`DEPLOYER_ADDR`

The address of your Reactive wallet.

`SYSTEM_CONTRACT_ADDR`

System contract address for Reactive testnet, which should be set to `0x0000000000000000000000000000000000FFFFFF`.

`CALLBACK_SENDER_ADDR`

Refer to the documentation for addresses used by Reactive testnet for callbacks on supported networks.
