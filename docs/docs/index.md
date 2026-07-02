---
sidebar_position: 1
title: Getting Started
description: Explore Reactive Network, an EVM automation layer with CometBFT consensus and instant finality. Build reactive contracts, event-driven smart contracts for cross-chain, on-chain automation.
slug: /
hide_title: true
---

![Reactive Docs Image](./img/reactive-docs.jpg)

## Overview

Reactive Network is an EVM automation layer built around reactive contracts, event-driven smart contracts for cross-chain, on-chain automation. It runs on CometBFT consensus, providing instant finality and roughly 1-second block times while maintaining full EVM compatibility.

Reactive contracts subscribe to event logs across EVM chains and execute Solidity logic automatically when matching events occur. Instead of relying on users or off-chain bots to trigger transactions, they decide autonomously when to send cross-chain callback transactions, providing on-chain if-this-then-that automation for smart contracts.

This makes it possible to build workflows such as automated stop-loss and take-profit orders, liquidation protection, portfolio rebalancing, and yield optimization across chains.

## Reactive Legacy v Reactive Omni

What changes when moving a reactive contract from legacy Reactive Network to Omni. Contracts already deployed on legacy continue to work exactly as they did, with no changes required. The code changes below apply only when writing new reactive contracts.

### Code Changes

Drop the `vm` modifier. Reactive Network no longer runs RVMs, so every transaction executes in a single network and contracts no longer carry dual state. A reactive contract is now an ordinary smart contract that receives reactive transactions from the system contract and subscribes through it. There is no RVM-side component to initialize and no callbacks routed from RVM back to the network.

```solidity
constructor(/* ... */) payable {
      callback = _callback;
      // diff-remove-start
      if (!vm) {
          service.subscribe(originChainId, _contract, _topic_0,
              REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE);
      }
      // diff-remove-end
      // diff-add-start
      SYSTEM.subscribe(block.chainid, address(this), PING_TOPIC_0,
          REACTIVE_IGNORE, REACTIVE_IGNORE, REACTIVE_IGNORE);
      // diff-add-end
  }
```

Reactive transactions now arrive from the system contract, which lets your contract confirm it's been called by the authorized entity rather than a random caller.

```solidity
// diff-remove
function react(LogRecord calldata log) external vmOnly {
// diff-add
function react(LogRecord memory log_) external onlySystem {
```

Callbacks now go through the system contract instead of being emitted as events.

```solidity
// diff-remove-start
bytes memory payload = abi.encodeWithSignature("callback(address)", address(0));
emit Callback(destinationChainId, callback, GAS_LIMIT, payload);
// diff-remove-end
// diff-add-start
bytes memory payload = abi.encodeWithSignature("pong(address,address)", address(0), msg.sender);
SYSTEM.requestCallbackV_1_0(ISystemContract.CallbackConfiguration_V_1_0({
    chainId: SEPOLIA_CHAIN_ID,
    recipient: _counterparty,
    gasLimit: 1000000,
    payload: payload
}));
// diff-add-end
```

The system contract exposes the new callback interface:

```solidity
// diff-add-start
enum CallbackVersion { V_1_0 }
struct CallbackConfiguration_V_1_0 { uint256 chainId; address recipient; uint64 gasLimit; bytes payload; }
function requestCallback(CallbackVersion version_, bytes memory config_) external;
function requestCallbackV_1_0(CallbackConfiguration_V_1_0 memory config_) external;
// diff-add-end
```

The system contract moved to a new address:

```solidity
// diff-remove
ISystemContract internal constant SERVICE_ADDR = ISystemContract(payable(0x0000000000000000000000000000000000fffFfF));
// diff-add
ISystemContract internal constant SYSTEM = ISystemContract(payable(0x8888888888888888888888888888888888888888));
```

### Tooling

The custom RPC methods for emulating RVM execution and inspecting traces are gone, and you no longer need them. Reactive Network behaves like any other EVM chain:

* Foundry `cast` and comparable tools work out of the box.
* Reactscan shows the same transaction and block views as a standard EVM explorer, with no separate RVM views to reconcile. Blockscout works as well.

### Precompiles and Opcodes

All RC-specific precompiles have been removed. From an opcode perspective Reactive Network is a standard EVM chain. The only remaining precompiles are internal to the system contracts, and you will not encounter them in normal development.

### Consensus and Finality

The consensus layer moved from Geth+Prism to CometBFT. This is not a new chain: all balances, deployed contracts, and storage carry over. For developers:

- Instant block finality. No reorgs on Reactive Network.
- Block times around 1s, down from roughly 7s.

## Where to Begin

### Step 1 — Reactive Basics

[//]: # ([Origins & Destinations →]&#40;./origins-and-destinations.mdx&#41; Understand origin and destination chains and their callback proxy addresses.)

[Hyperlane →](./hyperlane.mdx) Learn how cross-chain callbacks are transported using Hyperlane.

[Reactive Contracts →](./reactive-contracts.md) Learn how reactive contracts subscribe to events and trigger actions.

[//]: # ([Economy →]&#40;./economy&#41; Understand callback payments and Reactive's economy.)

### Step 2 — Reactive Essentials

[Reactive Mainnet & Lasna Testnet →](./reactive-mainnet.mdx) Connect to Reactive Mainnet or Lasna Testnet.

[Reactive Library →](./reactive-lib.mdx) Use Reactive's abstract contracts and interfaces.

[Events & Callbacks →](./events-and-callbacks.md) Learn how event subscriptions trigger cross-chain callbacks. 

[Subscriptions →](./subscriptions.md) Configure event subscriptions.

[RNK RPC Methods →](./rnk-rpc-methods.md) Reference RPC methods for Reactive's nodes.

[//]: # (### Step 3 — Reactive Building)

[//]: # ()
[//]: # ([Reactive Demos →]&#40;./demos.md&#41; Explore working examples. )

[//]: # ()
[//]: # ([Reactive Demos on GitHub →]&#40;https://github.com/Reactive-Network/reactive-smart-contract-demos&#41; Clone demo projects and start building.)

[//]: # ()
[//]: # (## Extra)

[//]: # ()
[//]: # ([Reactscan →]&#40;./reactscan.md&#41; Explore reactive transactions and contracts.)

[//]: # ()
[//]: # ([Debugging →]&#40;./debugging.md&#41; Troubleshoot common issues.)

[//]: # ()
[//]: # ([Contacts →]&#40;../contacts/index.md&#41; Get support and connect with the community.)

