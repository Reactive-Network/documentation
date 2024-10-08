---
title: "Deploying Reactive Smart Contracts with Remix"
sidebar_position: 2
description: Learn how to deploy a Basic Reactive Smart Contract using Remix IDE. Ideal for mastering Reactive Network fundamentals.
slug: remix-ide-demo
---

import KopliButton from '../../../src/components/kopli-button';

# Deploying Reactive Smart Contracts with Remix

## Overview

This guide will walk you through deploying Reactive Smart Contracts using the [Remix Development Environment](https://remix.ethereum.org/). We will use the [Basic Demo](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/basic) that involves three smart contracts: the Origin chain contract [BasicDemoL1Contract.sol](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/basic/BasicDemoL1Contract.sol), the Destination chain contract [BasicDemoL1Callback.sol](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/basic/BasicDemoL1Callback.sol), and the Reactive contract [BasicDemoReactiveContract.sol](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/basic/BasicDemoReactiveContract.sol).

## Prerequisites

* [Solidity](https://soliditylang.org/) 
* [MetaMask](https://metamask.io/) 
* [Remix](https://remix.ethereum.org/) 

## Acquire Testnet Funds

You will need SepETH for Ethereum Sepolia and REACT tokens for Kopli Testnet. To receive REACT tokens, send SepETH to the Reactive faucet on Ethereum Sepolia (`0x9b9BB25f1A81078C544C829c5EB7822d747Cf434`). An equivalent amount of REACT will be sent to your address. To connect your MetaMask account to Kopli Testnet, use the button below:

<KopliButton />

## Origin Chain Contract

1. Open [BasicDemoL1Contract.sol](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/basic/BasicDemoL1Contract.sol) in [Remix](https://remix.ethereum.org/).

2. Compile the contract.

![Origin](img/1.png)

3. Deploy the Origin chain contract to Ethereum Sepolia.

* Open MetaMask and select Ethereum Sepolia.

* In Remix, in the **Deploy & Run Transactions** tab, select "Injected Provider — MetaMask" as your environment.

* Click the **Deploy** button. MetaMask will prompt you to confirm the transaction. Check the transaction details to ensure you are deploying the contract to Ethereum Sepolia.

* After you confirm the transaction, the contract address will appear in the **Deployed Contracts** list. Copy this contract address.

4. Check the transaction details using the contract address on [Sepolia Testnet Explorer](https://sepolia.etherscan.io/).

## Destination Chain Contract

1. Open [BasicDemoL1Callback.sol](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/basic/BasicDemoL1Callback.sol) in [Remix](https://remix.ethereum.org/). Properly import abstract contracts and interfaces: [AbstractCallback](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/AbstractCallback.sol), [AbstractPayer](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/AbstractPayer.sol), [IPayable](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/IPayable.sol), and [IPayer](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/IPayer.sol).

2. Compile the contract.

![Destination](img/2.png)

3. Deploy the Destination chain contract to Ethereum Sepolia the same way we do with the Origin chain contract.

4.Copy the contract address that will appear in the **Deployed Contracts** list.

## Reactive Smart Contract

1. Open [BasicDemoReactiveContract.sol](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/basic/BasicDemoReactiveContract.sol) in [Remix](https://remix.ethereum.org/). Properly import abstract contracts and interfaces: [AbstractReactive](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/AbstractReactive.sol), [IReactive](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/IReactive.sol), [ISystemContract](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/ISystemContract.sol), [IPayer](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/IPayer.sol), [IPayable](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/IPayable.sol), [ISubscriptionService](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/ISubscriptionService.sol),

2. Compile the contract.

![Reactive](img/3.png)

3. Deploy the reactive contract to Kopli Testnet.

* Open MetaMask and select Kopli Testnet.

* In Remix, in the **Deploy & Run Transactions** tab, select "Injected Provider — MetaMask" as your Environment.

* In the **Deploy** section, fill out the following fields:

    `service address`: Reactive callback proxy address `0x0000000000000000000000000000000000FFFFFF`.
    
    `_contract`: Origin chain contract address.
    
    `topic_0`: The `Received` event on the origin chain contract `0x8cabf31d2b1b11ba52dbb302817a3c9c83e4b2a5194d35121ab1354d69f6a4cb`.
    
    `callback`: Destination chain contract address.

* Click the **transact** button. MetaMask will prompt you to confirm the transaction. Check the transaction details to ensure you are deploying the contract to the Kopli Testnet.

* After you confirm the transaction, the contract address will appear in the **Deployed Contracts** list. Copy this contract address.

4. Once the reactive сontract is successfully deployed, check the transaction details using the contract address on [Reactive Scan](https://kopli.reactscan.net/).

To receive a callback on the destination chain contract, you should send 0.1 SepETH to your Origin contract address via Metamask. Check the contract's events for a callback. 
