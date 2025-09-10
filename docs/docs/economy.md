---
title: Economy
sidebar_position: 6
description: Explore the Reactive Network's economy and callback payment mechanisms.
slug: /economy
hide_title: true
---

![Economy](./img/economy.jpg)

## Overview

This section covers RVM transaction payments, including direct transfers and system contract deposits. It also explains callback payments, on-the-spot settlements, and the pricing model for callbacks.

## RVM Transactions

RVM transactions have no gas price or any monetary value. Payments occur post-factum in a later block (ideally the next one, but not guaranteed). The fee appears only then, determined by the base fee of that block. Reactscan can't directly link this fee to specific RVM transactions.

:::info[Max Gas Limit]
The maximum gas limit for RVM transactions is 900,000 units.
:::

An RVM transaction happens in block *n*, while accounting occurs in block *n+1* (or later) using that block’s base fee. However, it’s impossible to trace which specific RVM transaction was accounted for, as the block aggregates all transactions without distinction. 

The Reactive Transaction Fee is determined by the formula:

$$
fee = BaseFee ⋅ GasUsed
$$

Where:

- `BaseFee`: Base fee per unit of gas in the block header, ensuring alignment with the network's current pricing conditions.
- `GasUsed`: Actual gas consumed by the reactive transaction during execution.

:::info[Reactive Network Transactions]
RNK transactions operate the same way as standard EVM transactions.
:::

### Direct Transfers

All RVM transactions must be paid in REACT by transferring funds to a specific reactive contract. A direct payment can be made as follows:

```bash
cast send $CONTRACT_ADDR --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY --value 0.1ether
```

After funding the contract, you must settle any outstanding debt using the `coverDebt()` method:

```bash
cast send --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY $CONTRACT_ADDR "coverDebt()"
```

:::info[Contract Status]
The contract's status is available on [Reactive Scan](https://reactscan.net/) under its dedicated RVM. If `active`, it will execute transactions normally. If `inactive`, outstanding debt must be settled.
:::

### Depositing via System Contract

The `depositTo()` method allows funding through the system contract. The transaction fee is covered by the sender (EOA), and the system contract automatically settles any debt, eliminating the need to call coverDebt().

```bash
cast send --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY $SYSTEM_CONTRACT_ADDR "depositTo(address)" $CONTRACT_ADDR --value 0.1ether
```

:::info[System Contract]
On the Reactive Network, the system contract and callback proxy share the same address: `0x0000000000000000000000000000000000fffFfF`.
:::

## Callback Pricing

Callback pricing dynamically adjusts based on block base fees. The cost, $$p_{callback}$$, is calculated as follows:

$$
p_{callback} = p_{base} ⋅ C ⋅ (g_{callback} + K)
$$

Where:

- $$p_{base}$$: Base gas price, determined by `tx.gasprice` and `block.basefee`.
- $$C$$: Pricing coefficient specific to the destination network.
- $$g_{callback}$$: Gas consumed during callback execution.
- $$K$$: Fixed gas surcharge for the destination network.

## Callback Payment

Callbacks require the same payment mechanism as reactive transactions. If a contract fails to pay, it is blocklisted, preventing future callbacks and transactions.

:::warning[Callback Gas Limit]
The Reactive Network enforces a minimum callback gas limit of 100,000 gas. Callback requests below this threshold are ignored, as this minimum ensures sufficient gas for internal audits and computations required to process the callback.
:::

### Direct Transfers

To directly fund your callback contract:

```bash
cast send $CALLBACK_ADDR --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY --value 0.1ether
```

Then, settle any outstanding debt with `coverDebt()`:

```bash
cast send --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY $CALLBACK_ADDR "coverDebt()"
```

### Depositing via Callback Proxy

The `depositTo()` method allows callback contracts to be funded via the callback proxy. The fee is covered by the sender (EOA), and the proxy automatically settles any debt.

```bash
cast send --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY $CALLBACK_PROXY_ADDR "depositTo(address)" $CALLBACK_ADDR --value 0.1ether
```

:::tip[On-The-Spot Payment]
Implementing the `pay()` method or inheriting from `AbstractPayer` enables automatic settlement. The callback proxy triggers `pay()` when a callback results in contract debt. The standard implementation verifies the caller is the proxy, checks for sufficient funds, and then settles the debt.
:::

## Callback Contract Balance

### Contract Balance

To retrieve the balance of a callback contract, run:

```bash
cast balance $CONTRACT_ADDR --rpc-url $DESTINATION_RPC
```

### Contract Debt

To query the debt of a callback contract as recorded by the callback proxy, run:

```bash
cast call $CALLBACK_PROXY_ADDR "debts(address)" $CONTRACT_ADDR --rpc-url $DESTINATION_RPC | cast to-dec
```

### Contract Reserves

To retrieve the reserve amount of a callback contract held by the callback proxy, run:

```bash
cast call $CALLBACK_PROXY_ADDR "reserves(address)" $CONTRACT_ADDR --rpc-url $DESTINATION_RPC | cast to-dec
```

## Reactive Balance

### Contract Balance

To retrieve the balance of a reactive contract in REACT, run:

```bash
cast balance $CONTRACT_ADDR --rpc-url $REACTIVE_RPC
```

### Contract Debt

To query the debt of a reactive contract as recorded by the system contract, run:

```bash
cast call $SYSTEM_CONTRACT_ADDR "debts(address)" $CONTRACT_ADDR --rpc-url $REACTIVE_RPC | cast to-dec
```

### Contract Reserves

To retrieve the reserve amount of a reactive contract held by the system contract, run:

```bash
cast call $SYSTEM_CONTRACT_ADDR "reserves(address)" $CONTRACT_ADDR --rpc-url $REACTIVE_RPC | cast to-dec
```