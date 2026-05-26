---
title: Events & Callbacks
sidebar_position: 9
description: Learn how reactive contracts process events and trigger cross-chain callback transactions.
slug: /events-&-callbacks
hide_title: true
---

![Events and Callbacks Image](./img/events-and-callbacks.jpg)

## Overview

Reactive contracts process on-chain events and trigger transactions on destination chains through callbacks. The system contract delivers event logs to the contract's `react()` function, and callback transactions are generated when conditions are met.

## Event Processing

To process events, a reactive contract must implement the `react()` function defined in the [IReactive](https://github.com/Reactive-Network/reactive-lib-omni/blob/main/src/interfaces/IReactive.sol) interface:

```solidity
struct LogRecord {
    uint256 chainId;
    address contractAddress;
    uint256 topic0;
    uint256 topic1;
    uint256 topic2;
    uint256 topic3;
    bytes data;
    uint256 blockNumber;
    uint256 opCode;
    uint256 blockHash;
    uint256 txHash;
    uint256 logIndex;
}

function react(LogRecord calldata log_) external;
```

The system contract calls `react()` whenever a subscribed event is detected. The `LogRecord` structure contains the event metadata, including chain ID, contract address, topics, and event data.

Since `react()` is always called by the system contract, contracts should use the `onlySystem` modifier provided by `AbstractReactive` to restrict access.

## Callbacks to Destination Chains

Reactive contracts initiate transactions on destination chains by calling `requestCallback()` or `requestCallbackV_1_0()` on the system contract:

```solidity
function requestCallback(CallbackVersion version_, bytes memory config_) external;

function requestCallbackV_1_0(CallbackConfiguration_V_1_0 memory config_) external;
```

When either method is called during `react()` execution, Reactive Network submits a transaction to the specified destination chain.

The `V_1_0` callback configuration uses the following struct:

```solidity
struct CallbackConfiguration_V_1_0 {
    uint256 chainId;
    address recipient;
    uint64 gasLimit;
    bytes payload;
}
```

Where:

* `chainId` -- destination network
* `recipient` -- target contract on the destination chain
* `gasLimit` -- execution gas limit
* `payload` -- ABI-encoded function call

The `requestCallbackV_1_0()` method is a typed convenience wrapper that avoids manual ABI encoding. Both methods produce the same result.

:::info[Callback Authorization]
Reactive Network replaces the first 160 bits of the callback payload with the address of the reactive contract that initiated the callback. The first callback argument is therefore always an `address`, regardless of how it is named in Solidity. On the destination side, contracts extending `AbstractCallback` can use the `onlyCallbackSender` modifier to verify this address matches the expected reactive contract.
:::

[More on callback payment →](./economy#callback-payment)
