---
title: Reactive Contracts
sidebar_position: 4
description: Learn about Reactive Contracts (RCs) — event-driven smart contracts for cross-chain, on-chain automation that monitor event logs and trigger callback transactions.
slug: /reactive-contracts
hide_title: true
---

![Reactive Contracts Image](./img/reactive-contracts.jpg)

## Overview

Reactive Contracts (RCs) are event-driven smart contracts for cross-chain, on-chain automation. They monitor event logs across EVM chains, execute Solidity logic when subscribed events occur, and can trigger cross-chain callback transactions.

RCs define which chains, contracts, and events to monitor and operate autonomously based on on-chain events rather than user transactions or bots.

## Deployment

Reactive Contracts deploy in two environments:

- **Reactive Network (RNK)** — the public chain where EOAs interact with the contract and subscriptions are managed

- **ReactVM (RVM)** — a private execution environment where event processing takes place

Both copies use identical bytecode but operate independently.

## State Separation

The two deployments do not share state. Constructor flags or runtime checks can be used to distinguish environments. A contract can detect execution inside ReactVM by calling the system contract — calls revert outside ReactVM. See our [demos](./demos.md) for details.

## ReactVM Limitations

Inside [ReactVM](./reactvm.md), Reactive Contracts can't access external systems directly. They receive event logs from Reactive Network and can send callback transactions to destination chains, but can't interact with external RPC endpoints or off-chain services.

## Verifying Reactive Contracts

Contracts can be verified during or after deployment using the Sourcify endpoint. Sourcify is a decentralized verification service that matches deployed bytecode with source code, making contracts auditable and transparent.

**Reactive Sourcify Endpoint**: https://sourcify.rnk.dev/

## Verify After Deployment

```bash
forge verify-contract \
--verifier sourcify \
--verifier-url https://sourcify.rnk.dev/ \
--chain-id $CHAIN_ID \
$CONTRACT_ADDR $CONTRACT_NAME
```

Replace:

- `$CHAIN_ID` → `1597` (Reactive Mainnet) or `5318007` (Lasna Testnet)
- `$CONTRACT_ADDR` → deployed contract address
- `$CONTRACT_NAME` → contract name (e.g. `MyContract`)

## Verify on Deployment

```bash
forge create \
--verifier sourcify \
--verifier-url https://sourcify.rnk.dev/ \
--verify \
--chain-id $CHAIN_ID \
--private-key $PRIVATE_KEY \
$PATH
```

Replace:

- `$CHAIN_ID` → `1597` (Reactive Mainnet) or `5318007` (Lasna Testnet)
- `$PATH` → e.g. `src/MyContract.sol:MyContract`
- `$PRIVATE_KEY` → deployer key

Example: 

```bash
forge create \
  --broadcast \
  --rpc-url $REACTIVE_RPC_URL \
  --private-key $REACTIVE_PRIVATE_KEY \
  --chain-id $REACTIVE_CHAIN_ID \
  --value 0.01ether \
  --verify \
  --verifier sourcify \
  --verifier-url https://sourcify.rnk.dev/ \
  src/.../MyContract.sol:MyContract \
  --constructor-args \
    $ARGUMENT_1 \
    $ARGUMENT_2 \
    $ARGUMENT_3 \
    # ...add more as needed
```

:::warning[Broadcast Error]
If you encounter the error below, your Foundry version doesn't expect the `--broadcast` flag for `forge create`. Remove `--broadcast` and retry.

```go
error: unexpected argument '--broadcast' found
```
:::

## Verified Contracts on Reactscan

After verification:

1. Open Reactscan ([Reactive Mainnet](https://reactscan.net/), [Lasna Testnet](https://lasna.reactscan.net/))
2. Navigate to your RVM
3. Open Contracts


![Image a](./img/verify-a.png)

4. Select the contract address

![Image b](./img/verify-b.png)

Successful verification shows:

```json
Contract Address: 0xc3e185561D2a8b04F0Fcd104A562f460D6cC503c
Status: VERIFIED (EXACT MATCH)
Compiler: 0.8.28
```

![Image c](./img/verify-c.png)

Verified contracts expose full source code with syntax highlighting and file structure.

[More on Reactive Contracts →](../education/module-1/reactive-contracts)
