---
title: "Use Case: Reactive Network Demo"
sidebar_position: 1
description: Learn to build and deploy a Basic Reactive Smart Contract. Understand low-latency log monitoring and cross-chain calls using Ethereum testnets. Ideal for mastering Reactive Network fundamentals.
slug: use-case-1
---

# Use Case: Reactive Network Demo

## Overview

This article focuses on building and deploying a reactive contract, using the basic [Reactive Network Demo](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/basic) that provides:

* Low-latency monitoring of logs emitted by contracts on the origin chain (Sepolia testnet).
* Executing calls from the Reactive Network to contracts on the destination chain, also on Sepolia.

![Basic Demo Smart Contract](./img/use-case-1.png)

## Contracts

* **Origin Chain Contract**: [BasicDemoL1Contract](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/basic/BasicDemoL1Contract.sol) receives Ether and returns it to the sender, emitting a `Received` event with transaction details.

* **Reactive Contract**: [BasicDemoReactiveContract](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/basic/BasicDemoReactiveContract.sol) subscribes to events on Sepolia, emits logs, and triggers callbacks when conditions are met, such as `topic_3` being at least 0.1 Ether. It manages event subscriptions and tracks processed events.

```solidity
function react(
    uint256 chain_id,
    address _contract,
    uint256 topic_0,
    uint256 topic_1,
    uint256 topic_2,
    uint256 topic_3,
    bytes calldata data,
    uint256 /* block_number */,
    uint256 /* op_code */
) external vmOnly {
    emit Event(chain_id, _contract, topic_0, topic_1, topic_2, topic_3, data, ++counter);
    if (topic_3 >= 0.1 ether) {
        bytes memory payload = abi.encodeWithSignature("callback(address)", address(0));
        emit Callback(chain_id, _callback, GAS_LIMIT, payload);
    }
}
```

* **Destination Chain Contract**: [BasicDemoL1Callback](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/basic/BasicDemoL1Callback.sol) logs callback details upon receiving a call, capturing the origin, sender, and reactive sender addresses. It could also be a third-party contract.

## Further Considerations

The demo highlights just a subset of Reactive Network's features. Potential improvements include:

- **Enhanced Event Subscriptions**: Subscribing to multiple event origins, including callback logs, to maintain consistency.
- **Dynamic Subscriptions**: Allowing real-time adjustments to subscriptions based on conditions.
- **State Management**: Introducing persistent state handling for more complex, context-aware reactions.
- **Flexible Callbacks**: Supporting arbitrary transaction payloads to increase adaptability.

## Deployment

To deploy the contracts to Ethereum Sepolia and Reactive Kopli, [clone](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main) the project and follow the [Deployment & Testing](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/basic) steps. Replace the relevant keys, addresses, and endpoints as needed. Make sure all environment variables are correctly configured before proceeding.

## Conclusion

In this article, we explored how reactive contracts operate and deployed a simple system using one. We examined the process step by step, including event emission, tracking, and performing post-actions on the destination Ethereum contract through the reactive one. While this example doesn't include practical logic, it demonstrates the technology's functionality and sets the stage for real-world applications.