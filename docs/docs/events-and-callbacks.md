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

To process events, a reactive contract must implement the `react()` function defined in the [IReactive](https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/interfaces/IReactive.sol) interface:

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

`onlySystem` checks that `msg.sender` is the configured service provider; for a reactive contract that's the system contract at the address `0x8888888888888888888888888888888888888888`. If anyone else calls `react()`, the call reverts with `NotAuthorized`.

## Requesting Callbacks to Destination Chains

:::info[Callback Authorization]
Reactive Network replaces the first 160 bits of the callback payload with the address of the reactive contract that initiates the callback. The first callback argument is therefore always an `address`, regardless of how it is named in Solidity. On the destination side, contracts extending `AbstractCallback` can use the `onlyCallbackSender` modifier to verify this address matches the expected reactive contract. A mismatch will revert with `CallbackNotAuthorized`.
:::

Reactive contracts initiate transactions on destination chains by calling methods on the system contract, rather than emitting raw events directly. The system contract handles event emission and validation under the hood.

Two methods are available today:

```solidity
function requestCallback(CallbackVersion version_, bytes memory config_) external;

function requestCallbackV_1_0(CallbackConfiguration_V_1_0 memory config_) external;
```

`requestCallbackV_1_0()` is a typed convenience wrapper, meaning you pass a configuration struct directly with no manual ABI encoding or version flag. This is what most developers should reach for.

`requestCallback()` is the generic entry point. You specify a `CallbackVersion` and pass ABI-encoded configuration matching that version. As new callback types are introduced, each will get its own version and a corresponding typed convenience method like `V_1_0`. Supplying a version the contract doesn't recognize will revert with `InvalidCallbackVersion`.

Internally, both methods are the same code path: `requestCallbackV_1_0()` simply ABI-encodes your struct and calls the generic request with `CallbackVersion.V_1_0`.

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

* `chainId` -> destination network
* `recipient` -> target contract on the destination chain
* `gasLimit` -> execution gas limit
* `payload` -> ABI-encoded function call

### CallbackRequest Event

When either method is called during `react()` execution, the system contract emits a `CallbackRequest` event, and Reactive Network picks it up to submit a transaction on the specified destination chain. It's worth knowing the event's shape, because it's what off-chain infrastructure and explorers index:

```solidity
event CallbackRequest(
    uint256 indexed chainId,
    address indexed sender,
    address indexed recipient,
    CallbackVersion version,
    bytes configuration
);
```

The three indexed fields make it cheap to filter for callbacks involving a specific contract:

* destination's `chainId`
* sender -> the reactive contract that requested the callback (`msg.sender`)
* the recipient on the destination chain.

The `version` flag and the full ABI-encoded configuration follow as data.

[//]: # ([More on callback payment →]&#40;./economy#callback-payment&#41;)
