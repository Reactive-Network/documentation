---
title: Economy
sidebar_position: 5
description: Explore the Reactive Network's economy and callback payment mechanisms.
slug: /economy
hide_title: true
---

![Economy](./img/economy.jpg)

## Overview



## RVM Transactions

### Direct Transfers

All RVM transactions must be paid in REACT by transferring funds to a specific reactive contract. A direct payment can be done like so:

```bash
cast send $CONTRACT_ADDR --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY --value 0.1ether
```

After funding the reactive contract, you must run the `coverDebt()` method:

```bash
cast send --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY $CONTRACT_ADDR "coverDebt()"
```

:::info[Contract Status]
The contract's status can be found on [Reactive Scan](https://kopli.reactscan.net/) in a dedicated RVM. If it's `active`, it will perform all intended operations. If `inactive`, it has a debt that should be settled.
:::

### Depositing via System Contract

The `depositTo()` method allows you to fund your reactive contract through the system contract. The fee is paid by the EOA address signing the transaction. The system contract settles the debt automatically (no need to invoke coverDebt()) and stores the remaining funds. 

```bash
cast send --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY $SYSTEM_CONTRACT_ADDR "depositTo(address)" $CONTRACT_ADDR --value 0.1ether
```

:::info[System Contract]
On the Reactive Network, the system contract address and callback proxy address have the same value `0x0000000000000000000000000000000000FFFFFF`.
:::

## Callback Payment

Callback execution shares the same mechanism as paying for reactive transactions. Failure to pay results in the contract being blocklisted, preventing it from getting all future callbacks and transactions.

### Direct Transfers

To transfer funds directly to your callback contract, use the following command:

```bash
cast send $CALLBACK_ADDR --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY --value 0.1ether
```

After funding the callback contract, you must run the `coverDebt()` method:

```bash
cast send --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY $CALLBACK_ADDR "coverDebt()"
```

### Depositing via Callback Proxy

The `depositTo()` method allows you to fund your callback contract through the callback proxy. The fee is paid by the EOA address signing the transaction. The callback proxy settles the debt automatically (no need to invoke coverDebt()) and stores the remaining funds.

```bash
cast send --rpc-url $DESTINATION_RPC --private-key $DESTINATION_PRIVATE_KEY $CALLBACK_PROXY_ADDR "depositTo(address)" $CALLBACK_ADDR --value 0.1ether
```

:::tip[On-The-Spot Payment]
Implement the `pay()` method or inherit from `AbstractPayer` for on-the-spot payments. `Callback Proxy` triggers the `pay()` method when a callback puts the contract in debt. The standard implementation verifies the caller is the proxy, checks for sufficient funds, and then settles the debt.
:::

## Callback Pricing

The current pricing formula incorporates dynamic block base fees. The callback price $$p_{callback}$$ is calculated as follows:

$$
p_{callback} = p_{origin} ⋅ C ⋅ (g_{callback} + K)
$$

Where:

- $$p_{origin}$$: The base gas price, determined by `tx.gasprice` and `block.basefee`.
- $$C$$: A pricing coefficient specific to the destination network.
- $$g_{callback}$$: The gas used for the callback.
- $$K$$: A fixed gas surcharge for the destination network.
