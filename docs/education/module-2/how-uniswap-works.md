---
title: "Lesson 6: How Uniswap Works / Understanding Uniswap V2 Pools and Smart Contracts"
sidebar_position: 1
description: Discover how Uniswap V2 pools and smart contracts work, including the constant product formula and key events like Swap and Sync. Learn about token swaps, liquidity provisioning, and see a smart contract example.
slug: how-uniswap-works
custom_edit_url: null
---

# Lesson 6: How Uniswap Works / Understanding Uniswap V2 Pools and Smart Contracts

## Overview

Uniswap V2, a decentralized finance protocol, operates on the Ethereum blockchain, facilitating automated trading of
decentralized tokens. At its core are liquidity pools and smart contracts that enable seamless token swaps. Understanding
Uniswap-like DEXes is crucial for understanding DeFi, smart contract applications, and Reactive use cases. By the end of
this lesson, you'll be equipped with knowledge on:

* The structure and function of Uniswap V2 pools, including how they facilitate token swaps and liquidity provisioning.

* The constant product formula (x * y = k) that governs the pricing mechanism within Uniswap V2.

* The execution and significance of Swap and Sync events in maintaining pool dynamics and providing transparency.

* A practical understanding through a code example that demonstrates the swap function within Uniswap V2's smart contracts.

## Uniswap V2 Pools

Liquidity pools in Uniswap V2 are essentially reserves of two tokens, forming a trading pair. These pools are the backbone
of the Uniswap ecosystem, allowing users to trade tokens without the need for traditional market makers.

In Uniswap V2, each trade or liquidity provision is executed through transactions on the Ethereum blockchain. These
transactions are public and can be [viewed on Etherscan](https://etherscan.io/tx/0x7b969e8a74ae9891e322311ca5fe6e5d7bcb53ac3412b4189d84683961043503) or similar block explorers.

Smart contracts in Uniswap V2 manage the liquidity pools, dictate the rules for token swapping, and ensure that trades are
executed according to the protocol's algorithm, often referred to as the Constant Product Market Maker model.

### The Constant Product Formula

The Uniswap V2 smart contract uses this formula: x * y = k, where x and y represent the quantity of the two tokens in the
liquidity pool, and k is a constant. This formula maintains the pool's total liquidity while allowing the token prices to
fluctuate based on trading activity.

Code Example: Here's a simplified snippet of what a Uniswap V2 swap() function might look like (see the explanation below
the code):

```solidity
function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external {
require(amount0Out > 0 || amount1Out > 0, "UniswapV2: INSUFFICIENT_OUTPUT_AMOUNT");
(uint112 reserve0, uint112 reserve1,) = getReserves(); // fetches reserves of the pool
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

        // Emit the Swap event
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

In this function:

* `amount0Out` and `amount1Out` are the amounts of each token that the caller wants to receive from the pool.

* The function first checks that the output amounts are positive and that the swap doesn't deplete the pool's reserves.

* It then calculates the input amounts (`amount0In` and `amount1In`) as the difference between the initial reserves and
the new balances after the swap.

* The contract ensures that the trade maintains the constant product invariant (k) after accounting for a 0.3% fee
(`balanceAdjusted0` and `balanceAdjusted1` calculations).

* The `_update` function is called to update the pool's reserves with the new balances.

* Tokens are transferred to the recipient's address `to`.

* If there is callback data (`data`), it calls the `uniswapV2Call` function on the recipient address, which can be used
for more complex interactions like flash swaps.

* The `Swap` event is emitted right after calculating the input and output amounts and before updating the reserves.
The `Swap` event logs the sender, the amounts of tokens coming in and going out of the pool, and the recipient of the
tokens.

This logic encapsulates the essence of a swap transaction in Uniswap V2, balancing the pool's reserves to maintain the
constant product while facilitating token exchanges.

We will be mostly interested in `Swap` events to monitor the blockchain activity and run Reactive smart contracts based on it.
Since the code of the pool smart contract does not change, most of the information that is different for every transaction is
being logged in the event. So let’s talk a bit more about the two types of events we’ll be most interested in: `Swap` and `Sync`.

## Events in Uniswap V2

### Swap

The `Swap` event is emitted every time a trade occurs in a Uniswap V2 pool. It provides vital information about the
transaction, such as the number of tokens involved in the swap and the addresses of the trader and recipient.

Event structure example:

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

In this event:

* `sender` is the address that initiated the swap.
* `amount0In` and `amount1In` are the amounts of the respective tokens that were sent to the pool.
* `amount0Out` and `amount1Out` are the amounts of the respective tokens that were sent from the pool.
* `to` is the address that receives the output tokens.

You can see this event in [the list of the events](https://etherscan.io/tx/0x7b969e8a74ae9891e322311ca5fe6e5d7bcb53ac3412b4189d84683961043503#eventlog) in this transaction on Etherscan.

### Sync

The `Sync` event is emitted whenever the reserves of a Uniswap V2 pool are updated. This event occurs after a swap when
liquidity is added or removed, or when there's a direct token transfer into or out of the pool. The `Sync` event helps
keep track of the pool's reserves current state.

Event Structure Example:

```
event Sync(uint112 reserve0, uint112 reserve1);
```

In this event:

* `reserve0` and `reserve1` represent the updated reserves of the pool's two tokens.

The `Sync` event is critical for maintaining up-to-date information on the pool's liquidity, which in turn affects trading
price and slippage. You can see this event in [the list of the events](https://etherscan.io/tx/0x7b969e8a74ae9891e322311ca5fe6e5d7bcb53ac3412b4189d84683961043503#eventlog) in this transaction on Etherscan.

## Conclusion

Uniswap V2 exemplifies the innovative spirit of decentralized finance, showcasing how automated market makers (AMM) can
create efficient and dynamic trading platforms. We've unraveled the constant product formula that underpins its operation,
navigated through the critical Swap and Sync events, and dissected a code snippet to understand the on-chain mechanics of
token swapping. Through this exploration, we've gained a deeper appreciation for the robust and flexible framework that
Uniswap provides to the DeFi ecosystem.

