---
title: Economy
sidebar_position: 6
description: Learn how Reactive Contracts pay for execution and cross-chain callbacks, including REACT funding, transaction fees, and callback pricing.
slug: /economy
hide_title: true
---

![Economy](./img/economy.jpg)

## Overview

This section explains how Reactive Contracts pay for execution and cross-chain callbacks, including REACT funding, transaction fees, and callback pricing. RVM transactions and callbacks are executed first and accounted for later. Contracts must maintain sufficient balances to remain active.

## RVM Transactions 

RVM transactions do not include a gas price at execution time. Fees are calculated and charged later using the base fee of a subsequent block (typically the next block). Because accounting is aggregated at the block level, Reactscan can't associate fees with individual RVM transactions.

:::info[Max Gas Limit]
The maximum gas limit for RVM transactions is 900,000 units.
:::

The Reactive transaction fee is calculated as:

$$
fee = BaseFee ⋅ GasUsed
$$

Where:

- `BaseFee` — base fee per gas unit in the accounting block
- `GasUsed` — gas consumed during execution

:::info[Reactive Network Transactions]
RNK transactions follow the standard EVM gas model.
:::

### Direct Transfers

Reactive Contracts must be funded in REACT before executing RVM transactions.

Fund a contract:

```bash
cast send $CONTRACT_ADDR \
  --rpc-url $REACTIVE_RPC \
  --private-key $REACTIVE_PRIVATE_KEY \
  --value 0.1ether
```

Then settle outstanding debt:

```bash
cast send \
  --rpc-url $REACTIVE_RPC \
  --private-key $REACTIVE_PRIVATE_KEY \
  $CONTRACT_ADDR "coverDebt()"
```

:::info[Contract Status]
Contract status is available on [Reactscan](https://reactscan.net/).

- `active` — contract executes normally
- `inactive` — outstanding debt must be settled
:::

### System Contract Deposits

Contracts can be funded through the system contract using `depositTo()`. The sender pays the transaction fee, and any outstanding debt is settled automatically.

```bash
cast send \
  --rpc-url $REACTIVE_RPC \
  --private-key $REACTIVE_PRIVATE_KEY \
  $SYSTEM_CONTRACT_ADDR "depositTo(address)" \
  $CONTRACT_ADDR \
  --value 0.1ether
```

:::info[System Contract]
On Reactive Network, the system contract and callback proxy share the same address: `0x0000000000000000000000000000000000fffFfF`.
:::

## Callback Pricing

Callback costs depend on the destination network and current base fees. The callback price $$p_{callback}$$ is calculated as:

$$
p_{callback} = p_{base} ⋅ C ⋅ (g_{callback} + K)
$$

Where:

- $$p_{base}$$ — base gas price (`tx.gasprice` or `block.basefee`)
- $$C$$ — destination-network pricing coefficient
- $$g_{callback}$$ — callback gas usage
- $$K$$ — fixed gas surcharge

## Callback Payment

Callbacks use the same payment model as RVM transactions. Contracts without sufficient funds are blocklisted and can't execute transactions or callbacks.

:::warning[Callback Gas Limit]
Reactive Network enforces a minimum callback gas limit of 100,000 gas. Callback requests below this threshold are ignored, as this minimum ensures sufficient gas for internal audits and computations required to process the callback.
:::

### Direct Transfers

Fund a callback contract:

```bash
cast send $CALLBACK_ADDR \
  --rpc-url $DESTINATION_RPC \
  --private-key $DESTINATION_PRIVATE_KEY \
  --value 0.1ether
```

Then settle outstanding debt:

```bash
cast send \
  --rpc-url $DESTINATION_RPC \
  --private-key $DESTINATION_PRIVATE_KEY \
  $CALLBACK_ADDR "coverDebt()"
```

### Callback Proxy Deposits

Callback contracts can be funded through the callback proxy using `depositTo()`. Debt is settled automatically.

```bash
cast send \
  --rpc-url $DESTINATION_RPC \
  --private-key $DESTINATION_PRIVATE_KEY \
  $CALLBACK_PROXY_ADDR "depositTo(address)" \
  $CALLBACK_ADDR \
  --value 0.1ether
```

:::tip[On-The-Spot Payment]
Implementing `pay()` or inheriting from `AbstractPayer` enables automatic settlement. The callback proxy calls `pay()` when a callback creates debt. The standard implementation verifies the caller, checks balances, and settles the debt.
:::

## Callback Contract Balance

### Balance

Retrieve the balance of a callback contract:

```bash
cast balance $CONTRACT_ADDR --rpc-url $DESTINATION_RPC
```

### Debt

Query the debt recorded by the callback proxy:

```bash
cast call $CALLBACK_PROXY_ADDR "debts(address)" $CONTRACT_ADDR --rpc-url $DESTINATION_RPC | cast to-dec
```

### Reserves

Retrieve reserves held by the callback proxy:

```bash
cast call $CALLBACK_PROXY_ADDR "reserves(address)" $CONTRACT_ADDR --rpc-url $DESTINATION_RPC | cast to-dec
```

## Reactive Contract Balance

### Balance

Retrieve the REACT balance of a reactive contract:

```bash
cast balance $CONTRACT_ADDR --rpc-url $REACTIVE_RPC
```

### Debt

Query the debt recorded by the system contract:

```bash
cast call $SYSTEM_CONTRACT_ADDR "debts(address)" $CONTRACT_ADDR --rpc-url $REACTIVE_RPC | cast to-dec
```

### Reserves

Retrieve reserves held by the system contract:

```bash
cast call $SYSTEM_CONTRACT_ADDR "reserves(address)" $CONTRACT_ADDR --rpc-url $REACTIVE_RPC | cast to-dec
```