---
title: "Use Case: Reactive Network Demo"
sidebar_position: 1
description: Learn to build and deploy a Basic Reactive Smart Contract. Understand low-latency log monitoring and cross-chain calls using Ethereum testnets. Ideal for mastering Reactive Network fundamentals.
slug: use-case-1
---

# Use Case: Reactive Network Demo

## Overview

This article focuses on building and deploying a reactive contract, using the basic [Reactive Network Demo](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/basic) that provides:

* Low-latency monitoring of logs emitted by contracts on the origin chain.
* Executing calls from the Reactive Network to contracts on the destination chain.

![Basic Demo Smart Contract](./img/use-case-1.png)

## Contracts

**Origin Contract**: [BasicDemoL1Contract](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/basic/BasicDemoL1Contract.sol) receives Ether and returns it to the sender, emitting a `Received` event with transaction details.

**Reactive Contract**: [BasicDemoReactiveContract](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/basic/BasicDemoReactiveContract.sol) demonstrates a reactive subscription model. It subscribes to logs from a specified contract and processes event data in a decentralized manner. The contract subscribes to events from a specified contract on the origin chain. Upon receiving a log, the contract checks if `topic_3` is at least 0.01 Ether. If the condition is met, it emits a `Callback` event containing a payload to invoke an external callback function on the destination chain.

The `react()` function processes incoming logs and triggers a callback when necessary:

```solidity
function react(LogRecord calldata log) external vmOnly {
    
    if (log.topic_3 >= 0.01 ether) {
        bytes memory payload = abi.encodeWithSignature("callback(address)", address(0));
        emit Callback(destinationChainId, callback, GAS_LIMIT, payload);
    }
}
```

During deployment, the contract subscribes to logs from a contract on the origin chain, using `topic_0` for filtering:

```bash
if (!vm) {
    service.subscribe(
        originChainId,
        _contract,
        topic_0,
        REACTIVE_IGNORE,
        REACTIVE_IGNORE,
        REACTIVE_IGNORE
    );
}
```

The `LogRecord` struct, defined in [IReactive](https://github.com/Reactive-Network/reactive-lib/blob/main/src/interfaces/IReactive.sol), provides structured data for event processing:

```bash
struct LogRecord {
    uint256 chain_id;
    address _contract;
    uint256 topic_0;
    uint256 topic_1;
    uint256 topic_2;
    uint256 topic_3;
    bytes data;
    uint256 block_number;
    uint256 op_code;
    uint256 block_hash;
    uint256 tx_hash;
    uint256 log_index;
}
```

**Destination Contract**: [BasicDemoL1Callback](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/basic/BasicDemoL1Callback.sol) serves as the destination contract for handling reactive callbacks. When triggered by a cross-chain event, it logs key transaction details while ensuring only authorized senders can invoke the callback. Upon execution, it emits a `CallbackReceived` event, capturing metadata such as the origin, sender, and reactive sender addresses.

## Further Considerations

The demo highlights just a fraction of Reactive Network’s capabilities. Future enhancements could include:

- **Expanded Event Subscriptions**: Monitoring multiple event sources, including callback logs.
- **Dynamic Subscriptions**: Adjusting subscriptions in real-time based on evolving conditions.
- **State Persistence**: Maintaining contract state for more complex, context-aware reactions.
- **Versatile Callbacks**: Enabling customizable transaction payloads to improve adaptability.

## Deployment

To deploy the contracts, [clone](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main) the project and follow the [Deployment & Testing](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/basic) steps. Make sure all environment variables are correctly configured before proceeding.

## Conclusion

This article has demonstrated how reactive contracts can monitor logs, process event data, and trigger actions across chains. While the example focuses on foundational concepts rather than practical business logic, it lays the groundwork for more advanced, real-world applications leveraging Reactive Network’s low-latency automation.