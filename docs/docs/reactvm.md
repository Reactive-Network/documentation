---
title: Reactive Authentication
sidebar_position: 5
description: 
slug: /reactvm
hide_title: true
---

## Overview


### Reactive Authentication

When a Reactive contract constructs a callback payload, the first argument must be reserved for the RVM ID. Developers pass `address(0)` as a placeholder in this slot, and Reactive Network automatically overwrites the first 160 bits with the deployer's address before the callback reaches the destination chain. This means callbacks always carry an authenticated origin that can't be forged by the contract itself.

The callback must include at least one argument, omitting the first slot entirely will cause the call to fail, since the system has no location to inject the RVM ID. Destination contracts can rely on this first argument to identify which ReactVM originated the callback.

Example from [Uniswap V2 Stop Order Demo](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/f1f85ab2a0a8f917b9b37a57c00be2ffc8ad5ad4/src/demos/uniswap-v2-stop-order/UniswapDemoStopOrderReactive.sol#L107):
  
```solidity
bytes memory payload = abi.encodeWithSignature(
    "stop(address,address,address,bool,uint256,uint256)",
    address(0), // Overwritten with the deployer's RVM ID
    pair,
    client,
    token0,
    coefficient,
    threshold
);
emit Callback(chain_id, stop_order, CALLBACK_GAS_LIMIT, payload);
```

