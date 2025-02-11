---
title: Economy
sidebar_position: 5
description: Explore the Reactive Network's economy and callback payment mechanisms.
slug: /economy
hide_title: true
---

![Economy](./img/economy.jpg)

## Overview

This section covers RVM transaction payments, including direct transfers and system contract deposits. It also explains callback payments, on-the-spot settlements, and the pricing model for callbacks.

## RVM Transactions

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
The contract's status is available on [Reactive Scan](https://kopli.reactscan.net/) under its dedicated RVM. If `active`, it will execute transactions normally. If `inactive`, outstanding debt must be settled.
:::

### Depositing via System Contract

The `depositTo()` method allows funding through the system contract. The transaction fee is covered by the sender (EOA), and the system contract automatically settles any debt, eliminating the need to call coverDebt().

```bash
cast send --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY $SYSTEM_CONTRACT_ADDR "depositTo(address)" $CONTRACT_ADDR --value 0.1ether
```

:::info[System Contract]
On the Reactive Network, the system contract and callback proxy share the same address: `0x0000000000000000000000000000000000FFFFFF`.
:::

## Callback Payment

Callbacks require the same payment mechanism as reactive transactions. If a contract fails to pay, it is blocklisted, preventing future callbacks and transactions.

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

## Callback Pricing

Callback pricing dynamically adjusts based on block base fees. The cost, $$p_{callback}$$, is calculated as follows:

$$
p_{callback} = p_{origin} ⋅ C ⋅ (g_{callback} + K)
$$

Where:

- $$p_{origin}$$: Base gas price, determined by `tx.gasprice` and `block.basefee`.
- $$C$$: Pricing coefficient specific to the destination network.
- $$g_{callback}$$: Gas consumed during callback execution.
- $$K$$: Fixed gas surcharge for the destination network.
