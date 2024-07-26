---
title: Kopli Testnet
sidebar_position: 6
description: Explore Kopli Testnet, a proof-of-stake testnet managed by PARSIQ for testing purposes. Join the pre-alpha stage of Reactive Network and contribute to its development.
slug: /kopli-testnet
hide_title: true
custom_edit_url: null
---

![Kopli Testnet Image](./img/kopli-testnet.jpg)

## Overview

Kopli Testnet is a proof-of-stake testnet, representing Reactive Network's pre-alpha / Proof-of-Concept era. This Testnet, neither trustless nor decentralized, is fully managed by Reactive Team. It is designed only for testing purposes. Further decentralization is assured and scheduled for implementation in later stages.

## Kopli Testnet Information

* Network Name — Kopli Testnet
* RPC URL — https://kopli-rpc.rkt.ink
* Chain ID — 5318008
* Currency Symbol — REACT
* Block Explorer URL — https://kopli.reactscan.net
* System Contract Address — 0x0000000000000000000000000000000000FFFFFF
* Reactive Faucet Address on Sepolia — 0x9b9BB25f1A81078C544C829c5EB7822d747Cf434
* Callback Sender Address on Sepolia — 0x356bc9241f9b004323fE0Fe75C3d75DD946cF15c
* Callback Sender Address on Reactive — 0xB7b1ee427Ff1339f5e139Adc0F3E2523fC61268f

## Callback Sender Address

`CALLBACK_SENDER_ADDR` serves as a validity check for the EOA address, identified by the correct RVM ID (or deployer address), to ensure the callback originates from the correct source. This parameter can be omitted for a Uniswap stop order, as the contract executing the stop order already verifies its correctness. To skip this check, use the address `0x0000000000000000000000000000000000000000`.

The `CALLBACK_SENDER_ADDR` variable has different values on the Sepolia Testnet and the Reactive Faucet because the Uniswap stop order sends callbacks to Sepolia, while the Reactive Faucet sends callbacks to the Reactive Network. The reactive node uses different addresses for these two networks, but the functional purpose of these addresses remains the same.

If an external caller initiates the function, they will either:

- Waste gas on a reverted transaction if the stop order conditions are not met, or
- Waste gas on executing someone else's stop order without a personal benefit if the stop order conditions are fulfilled.

## Get Kopli Testnet REACT

The first method is ideal for cases where the address initiating the transfer is also the recipient. Users can acquire REACT tokens on the Reactive Network (RN) by interacting with the Reactive faucet contract. Transfer SepETH directly to the faucet contract on the Sepolia Network. Upon completion, an equivalent number of REACT tokens will be transferred to the sender's address on the Reactive Network. This transfer is subject to a predefined limit (0.1 ETH by default) and assumes the faucet has available funds. The process can be executed using MetaMask or any other wallet.  

Alternatively, users can call the payable method `request(address)` on the Reactive Faucet Contract on Sepolia to transfer REACT tokens directly to a specified RN address. In that case, users must provide the corresponding amount of SepETH when invoking this method. This approach is suitable for situations where the address initiating the transfer is not necessarily the recipient on the Reactive Network, allowing for flexible token transfers across different addresses.

```bash
cast send $REACTIVE_FAUCET_L1_ADDR "request(address)" $REACTIVE_TARGET_ADDR --value $WEI_AMOUNT --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY
```