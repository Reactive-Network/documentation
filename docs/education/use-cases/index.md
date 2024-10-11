---
title: "Use Cases"
sidebar_position: 1
description: Discover practical uses of Reactive Smart Contracts with demos on low-latency log monitoring and Uniswap V2 stop orders. Deploy and test these examples to boost your expertise.
slug: /education/use-cases
---

# Use Cases

## Overview

The Use Cases section primarily focuses on analyzing scenarios where Reactive Smart Contracts might be a game changer.

The [Basic Demo Smart Contract](use-case-1.md) is a basic use case of the Reactive Network with low-latency monitoring of logs emitted by arbitrary contracts on any chain (Sepolia testnet in this case) and enabling calls from the Reactive Network to these arbitrary chain contracts.

The [Deploying Reactive Smart Contracts with Remix](remix-ide-demo.md) article is a guide for deploying a Reactive Smart Contract using the Remix Development Environment.

The [Uniswap V2 Stop Order Demo](use-case-3.md) is a demo of a simple reactive smart contract that implements a stop order upon a Uniswap V2 liquidity pool. Study its setup and try deploying and testing it yourself.

If you have an idea for another use case, feel free to submit and turn it into a bounty, using our [Unicornization](https://reactive.network/unicornization) or [Hackathon](https://reactive.network/hackathon) program.

## GitHub Repository

Visit our [GitHub repository](https://github.com/Reactive-Network/reactive-smart-contract-demos) for all the important information on use cases and more. Clone the project and start exploring!

## Get Kopli Testnet REACT

To receive REACT, send SepETH to the Reactive faucet on Ethereum Sepolia (`0x9b9BB25f1A81078C544C829c5EB7822d747Cf434`). An equivalent amount will be sent to your address.

[More information on Kopli Testnet →](../../docs/kopli-testnet.mdx)

## Environment Setup

To set up `foundry` environment, run:

```bash
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

Install dependencies:

```bash
forge install
```

## Development & Testing

To compile artifacts:

```bash
forge compile
```

## Environment variable configuration for running demos

The following environment variables are used in the instructions for running the demos, and should be configured beforehand.

`SEPOLIA_RPC`

Ethereum Sepolia RPC address — `https://rpc2.sepolia.org`.

`SEPOLIA_PRIVATE_KEY`

Ethereum Sepolia private key.

`REACTIVE_RPC`

Kopli Testnet RPC address — `https://kopli-rpc.rkt.ink`.

`REACTIVE_PRIVATE_KEY`

Kopli Testnet private key.

`SYSTEM_CONTRACT_ADDR`

System contract address on [Kopli Testnet](../../docs/kopli-testnet.mdx#kopli-testnet-information).

`CALLBACK_PROXY_ADDR`

For callback proxy addresses, refer to [Origins & Destinations](../../docs/origins-and-destinations.mdx#chains).