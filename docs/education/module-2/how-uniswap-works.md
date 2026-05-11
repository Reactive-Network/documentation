---
title: "Lesson 6: How Uniswap V2 Works"
sidebar_position: 1
description: Discover how Uniswap V2 pools and smart contracts work, including the constant product formula and key events like Swap and Sync. Learn about token swaps, liquidity provisioning, and see a smart contract example.
slug: how-uniswap-works
---

# Lesson 6: How Uniswap V2 Works

## Overview

Before building a Reactive contract that interacts with a DeFi protocol, you need to understand how that protocol works. This lesson covers Uniswap V2, one of the most widely used decentralized exchanges, and the mechanics that make it relevant for Reactive contracts.

By the end of this lesson, you'll understand:

- How Uniswap V2 liquidity pools work and how they enable token swaps without traditional market makers
- The constant product formula that governs pricing
- How the `swap()` function executes trades on-chain
- What the `Swap` and `Sync` events contain and why they matter for Reactive contracts

## Uniswap V2 Pools

A Uniswap V2 liquidity pool is a pair of two tokens held in reserve. Anyone can trade one token for the other by interacting with the pool's smart contract. No order book, no counterparty, no intermediary. These pools are the foundation of the Uniswap ecosystem and a good example of how decentralized exchanges work in general.

Every trade and liquidity provision is an on-chain transaction, publicly visible on block explorers like [Etherscan](https://etherscan.io/tx/0x7b969e8a74ae9891e322311ca5fe6e5d7bcb53ac3412b4189d84683961043503). The smart contracts managing these pools enforce the trading rules and ensure every swap follows the protocol's pricing algorithm, known as the Constant Product Market Maker model.

### Constant Product Formula

Uniswap V2 pricing is governed by a simple formula: **x * y = k**, where `x` and `y` are the quantities of the two tokens in the pool and `k` is a constant. When someone buys token A from the pool, the amount of token A decreases and the amount of token B increases, shifting the price. The formula ensures that the pool's total liquidity is preserved regardless of how the ratio changes.

### Swap() Function

Here's a simplified version of Uniswap V2's `swap()` function:

```solidity
function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external {
    require(amount0Out > 0 || amount1Out > 0, "UniswapV2: INSUFFICIENT_OUTPUT_AMOUNT");
    (uint112 reserve0, uint112 reserve1,) = getReserves();
    require(amount0Out < reserve0 && amount1Out < reserve1, "UniswapV2: INSUFFICIENT_LIQUIDITY");

    uint balance0;
    uint balance1;
    {
        uint amount0In = reserve0 - (balance0 = reserve0 - amount0Out);
        uint amount1In = reserve1 - (balance1 = reserve1 - amount1Out);
        require(amount0In > 0 || amount1In > 0, "UniswapV2: INSUFFICIENT_INPUT_AMOUNT");

        uint balanceAdjusted0 = balance0 * 1000 - amount0In * 3;
        uint balanceAdjusted1 = balance1 * 1000 - amount1In * 3;
        require(balanceAdjusted0 * balanceAdjusted1 >= uint(reserve0) * uint(reserve1) * (1000**2), "UniswapV2: K");

        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    _update(balance0, balance1, reserve0, reserve1);

    if (amount0Out > 0) _safeTransfer(token0, to, amount0Out);
    if (amount1Out > 0) _safeTransfer(token1, to, amount1Out);

    if (data.length > 0) {
        IUniswapV2Callee(to).uniswapV2Call(msg.sender, amount0Out, amount1Out, data);
    }
}
```

Here's what's happening step by step:

1. The caller specifies how many of each token they want out (`amount0Out`, `amount1Out`). The function checks that at least one is positive and that the pool has enough reserves.

2. It calculates how many tokens came in (`amount0In`, `amount1In`) based on the difference between the original reserves and the new balances.

3. The constant product invariant is enforced after accounting for Uniswap's 0.3% fee (the `balanceAdjusted` calculations). If the invariant doesn't hold, the transaction reverts.

4. The `Swap` event is emitted, logging the sender, input amounts, output amounts, and recipient.

5. `_update` records the new reserve balances. Tokens are transferred to the recipient address.

6. If callback data is provided, the function calls `uniswapV2Call` on the recipient. This is how flash swaps work.

The key takeaway for Reactive contracts: most of the transaction-specific information lives in the events, not in contract storage. Since the pool's code doesn't change between swaps, the events are where you find what actually happened in each trade.

## Events in Uniswap V2

Two events are particularly important for Reactive contracts: `Swap` and `Sync`.

### Swap

The `Swap` event is emitted every time a trade occurs. It logs everything you need to know about the transaction:

```solidity
event Swap(
    address indexed sender,
    uint amount0In,
    uint amount1In,
    uint amount0Out,
    uint amount1Out,
    address indexed to
);
```

`sender` is the address that initiated the swap. `amount0In` and `amount1In` are the tokens sent to the pool. `amount0Out` and `amount1Out` are the tokens sent from the pool. `to` is the address receiving the output tokens.

You can see a real example of this event in [the event logs of this transaction](https://etherscan.io/tx/0x7b969e8a74ae9891e322311ca5fe6e5d7bcb53ac3412b4189d84683961043503#eventlog) on Etherscan.

### Sync

The `Sync` event is emitted whenever the pool's reserves are updated: after a swap, when liquidity is added or removed, or when tokens are transferred directly into or out of the pool:

```solidity
event Sync(uint112 reserve0, uint112 reserve1);
```

`reserve0` and `reserve1` are the updated token balances in the pool. This event is what keeps external observers (including Reactive contracts) informed about the pool's current state, which directly affects pricing and slippage.

Both events are visible in [the same Etherscan transaction logs](https://etherscan.io/tx/0x7b969e8a74ae9891e322311ca5fe6e5d7bcb53ac3412b4189d84683961043503#eventlog). In the next lesson, you'll see how a Reactive contract subscribes to these events and acts on them.

## About This Course

This course is designed to give you both the theory and the hands-on experience to start building with Reactive contracts. It includes detailed lectures, code examples on GitHub, and video workshops covering everything from basic concepts to real-world deployments.

Whether you want to understand how Reactive contracts work under the hood or jump straight into building, the course adapts to either path. Explore the [use cases](../use-cases/index.md) if you want to see what's possible, or start from Module 1 to build up from the fundamentals.

Join the [Telegram](https://t.me/reactivedevs) community if you have questions or want to connect with other developers working with Reactive contracts.