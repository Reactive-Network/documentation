---
title: Subscriptions
sidebar_position: 10
description: Learn how reactive contracts subscribe to events and configure event-driven automation.
slug: /subscriptions
hide_title: true
---

![Subscriptions Image](./img/subscriptions.jpg)

## Overview

Subscriptions define which events reactive contracts listen to. They subscribe to events through the system contract by specifying:

- Origin chain ID
- Contract address
- Event topics

When a matching event is detected, the system contract calls the contract's `react()` function.

Subscriptions can be configured:

- During deployment (constructor)
- Dynamically at any point during execution

## Subscription Basics

Subscriptions are created by calling `SYSTEM.subscribe()`. This is typically done inside the constructor. Reactive contracts extend [AbstractReactive](https://github.com/Reactive-Network/reactive-lib-omni/blob/main/src/abstract-base/AbstractReactive.sol), which provides access to the `SYSTEM` constant and the `REACTIVE_IGNORE` wildcard.

Here's a subscription example from a [demo contract](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/omni/src/micro-demos/PingPong.sol):

```solidity
contract PingPong is AbstractReactive {
    uint256 public constant PING_TOPIC_0 = 0xca6e822df923f741dfe968d15d80a18abd25bd1e748bcb9ad81fea5bbb7386af;

    constructor() payable {
        SYSTEM.subscribe(
            block.chainid,
            address(this),
            PING_TOPIC_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
    }

    function react(LogRecord memory log_) external onlySystem {
        // Handle the event
    }
}
```

Subscriptions filter events using:

- Chain ID
- Contract address
- Topics 0-3

:::info[Filtering Criteria]
Reactive Network provides filtering criteria based on the origin contract's chain ID, address, and all four topics.
:::

## Wildcards and Matching

### REACTIVE_IGNORE

`REACTIVE_IGNORE` is a predefined wildcard value that matches any topic value:

```
0xa65f96fc951c35ead38878e0f0b7a3c744a6f5ccc1476b313353ce31712313ad
```

### Zero Values

Wildcards can also be specified with:

- `uint256(0)` for any chain ID
- `address(0)` for any contract

At least one parameter must be specific.

### Subscription Examples

#### All Events From One Contract

```solidity
SYSTEM.subscribe(
    CHAIN_ID,
    0x7E0987E5b3a30e3f2828572Bb659A548460a3003,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE
);
```

#### Specific Event Type

Example: Uniswap V2 Sync events across all contracts.

```solidity
SYSTEM.subscribe(
    CHAIN_ID,
    address(0),
    0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE
);
```

#### Specific Contract and Event

```solidity
SYSTEM.subscribe(
    CHAIN_ID,
    0x7E0987E5b3a30e3f2828572Bb659A548460a3003,
    0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE
);
```

#### Multiple Subscriptions

Call `subscribe()` multiple times:

```solidity
SYSTEM.subscribe(
    originChainId,
    _contract1,
    _topic0,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE
);

SYSTEM.subscribe(
    originChainId,
    _contract2,
    REACTIVE_IGNORE,
    _topic1,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE
);
```

### Unsubscribing

Subscriptions can be removed by calling `SYSTEM.unsubscribe()` with the same parameters used to create the subscription. This is called from the reactive contract itself.

```solidity
SYSTEM.unsubscribe(
    CHAIN_ID,
    contractAddress,
    topic0,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE
);
```

### Subscription Limitations

#### Equality Matching Only

Subscriptions support exact matches only. Range comparisons (`<`, `>`), ranges, and bitwise filters are not supported.

#### Complex Criteria Sets

Each subscription defines one set of matching criteria. Disjunctions (OR conditions) and multiple criteria sets within one subscription are not supported. Use multiple `subscribe()` calls as a workaround.

#### No Global Subscriptions

Subscribing to all chains, all contracts, or all events on a chain is not allowed.

#### Duplicate Subscriptions

Duplicate subscriptions are allowed but behave as one subscription. Each `subscribe()` call still costs gas.

## Dynamic Subscriptions

Subscriptions can be created or removed dynamically at any point during execution. Since the contract lives directly on Reactive Network, it can call `SYSTEM.subscribe()` and `SYSTEM.unsubscribe()` from any function.

The following example from a [demo contract](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/omni/src/micro-demos/Xfers.sol) subscribes to Sepolia ERC-20 Transfer events and automatically unsubscribes after a configurable number of events:

```solidity
contract Xfers is AbstractReactive {
    uint256 private constant SEPOLIA_CHAIN_ID = 11155111;
    uint256 private constant ERC20_TRANSFER_TOPIC_0 = 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef;

    uint256 public _limit;

    constructor(uint256 limit_) payable {
        _limit = limit_;
        _sub();
    }

    function react(LogRecord memory log_) external onlySystem {
        if (log_.opCode == 3) {
            // Process the transfer event...

            if (--_limit == 0) {
                _unsub();
            }
        }
    }

    function _sub() internal {
        SYSTEM.subscribe(
            SEPOLIA_CHAIN_ID,
            address(0),
            ERC20_TRANSFER_TOPIC_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
    }

    function _unsub() internal {
        SYSTEM.unsubscribe(
            SEPOLIA_CHAIN_ID,
            address(0),
            ERC20_TRANSFER_TOPIC_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
    }
}
```

The contract also supports resubscribing by calling `_coverDebt()` to settle any outstanding balance before reactivating the subscription:

```solidity
function updateLimit(uint256 limit_) external payable {
    _limit = limit_;

    if (limit_ == 0) {
        _unsub();
    } else {
        _coverDebt();
        _sub();
    }
}
```
