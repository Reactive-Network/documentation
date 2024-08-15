---
title: "Lesson 3: ReactVM and Reactive Network As a Dual-State Environment"
sidebar_position: 3
description: Understand the dual-state environment of Reactive Smart Contracts. Learn to manage data, identify execution contexts, and handle transactions in both Reactive Network and ReactVM for efficient RSC development.
slug: react-vm
custom_edit_url: null
---

# Lesson 3: ReactVM and Reactive Network As a Dual-State Environment

## Overview

In the previous lesson, we discussed one of the basic concepts of Reactive Smart Contracts (RSCs) — Inversion of Control. In this one, we will focus on another crucial property of RSCs: the fact they exist in two instances with separate states in the Reactive Network and ReactVM. Understanding this idea is necessary for successful Reactive Smart Contract development.

By the end of this lesson, you will learn to:

* Distinguish both environments where a Reactive Smart Contract is executed.
* Identify the current environment.
* Manage data with two separate states.
* Understand the types of transactions RSCs operate with.

## Differences Between the Reactive Network and ReactVM

Each Reactive Smart Contract has two instances — one on the Reactive Network and the other in its separate ReactVM. It is important to note that both instances are physically stored and executed on each network node. Parallelizing RSCs is an architectural decision made to ensure high performance even with big numbers of events. We will talk more about that in one of our next articles.

![Reactive Network | React Vm ](./img/reactvm.jpg)

The Reactive Network operates as a typical EVM blockchain with the addition of system contracts that allow subscribing to and unsubscribing from the origin chain events that we are monitoring, such as Ethereum, BNB, Polygon, or Optimism. Each deployer address has a dedicated ReactVM.

ReactVM is a restricted virtual machine designed to process events in isolation. Contracts deployed from one address are executed in one ReactVM. They can interact with each other but not with other contracts on the Reactive Network.

Contracts within a single ReactVM can interact with the external world in two ways, both through the Reactive Network:

* They react to specified events to which they are subscribed and are executed when these events occur.

* Based on the execution of the code with the inputs from events, the ReactVM sends requests to the Reactive Network for callbacks to destination chains to perform the resulting on-chain actions.

For each RSC deployed, there are two instances of it with separate states but the same code. Each method is expected to be executed in one or both environments and to interact with one or both states. This leads to the question of how we identify, within the code, which state we are currently working with.

### Identifying the Execution Context

The execution context within these dual environments is determined using a boolean variable, typically named `vm`. This variable helps the contract identify its current operating environment:

* `vm = false` indicates execution within the Reactive Network.

* `vm = true` indicates execution within the ReactVM.

The `vm` variable is initialized in the constructor after attempting to call the system contract. System contracts are only deployed in the Reactive Network, whereas the ReactVM does not have a separate instance of them. If the call is unsuccessful, indicating that we are operating within a separate ReactVM instance rather than within the Reactive Network, the `vm` variable is set to `true`; otherwise, it remains `false`.

```solidity
bytes memory payload = abi.encodeWithSignature(
    "subscribe(uint256,address,uint256,uint256,uint256,uint256)",
    SEPOLIA_CHAIN_ID,
    _contract,
    topic_0,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE,
    REACTIVE_IGNORE
);
(bool subscription_result,) = address(service).call(payload);
if (!subscription_result) {
    vm = true;
}
```

We need to ensure that each method/function is executed only in the environment it is supposed to. We do this through modifiers that check the `vm` variable initiated in the constructor.

```solidity
modifier rnOnly() {
    require(!vm, 'Reactive Network only');
    _;
}

modifier vmOnly() {
    require(vm, 'VM only');
    _;
}
```

### Managing Dual Variable Sets for Each State

To adapt to these two operational states, RSCs should manage two sets of variables:

* Variables for the Reactive Network: used for interactions with system smart contracts, along with subscribing to and receiving events.

* Variables for the ReactVM: used within the ReactVM to execute the reaction logic based on the received events.

We recommend the aforementioned separation of variables to ensure that operations relevant to each environment are executed properly without any interference. You can follow our notation for your development. However, you could also try implementing more advanced techniques such as using one variable in two instances of an RSC differently. `vm` is a prime example of a variable that holds distinct values across various RSC instances. Similarly, you could optimize gas usage by repurposing variables for different functions across different instances.

In the examples presented in this course, we consistently specify in the comments which state corresponds to each variable. Let’s briefly examine our Uniswap stop order example. Here’s how we separate the variables within it:

```solidity
// State specific to reactive network contract instance

address private owner;
bool private paused;
ISubscriptionService private service;


// State specific to ReactVM contract instance

address private origin;
mapping(address => Tick[]) private reserves;
```

The variables used for managing event subscriptions pertain to the Reactive Network contract instance, where system contracts exist. Conversely, the variables employed in the logic executed after events are specific to the ReactVM contract instance.

## Transaction Execution

Let us consider the types of transactions that are executed in the Reactive Network and ReactVM for a specific Reactive Smart Contract.

### Reactive Network Transactions

There are two ways to initiate a transaction on the Reactive Network: directly by a user or triggered by an event on the origin chain

Users can directly initiate transactions on the Reactive Network by invoking methods specific to the RSC instance dedicated to the Reactive Network. These methods interact with the state of the Reactive Network and enable various functionalities. For example, a user might initiate a transaction by calling the `pause()` function to suspend event reception and response temporarily.

```solidity
// Methods specific to reactive network contract instance

function pause() external rnOnly onlyOwner {
    require(!paused, 'Already paused');
    service.unsubscribe(
        SEPOLIA_CHAIN_ID,
        ORIGIN,
        PAYMENT_REQUEST_TOPIC_0,
        REACTIVE_IGNORE,
        REACTIVE_IGNORE,
        REACTIVE_IGNORE
    );
    paused = true;
}
```

In the Reactive Network, transactions also occur when an event of interest is emitted on the origin chain. In such cases, the system contract dispatches the event to all active subscribers, which are separate ReactVMs.

### ReactVM Transactions

In the ReactVM, transactions can't be initiated directly by users. Instead, they are triggered when an event of interest occurs on an origin chain, at which point the system contract dispatches the event to the corresponding ReactVM for execution.

When an RSC in the ReactVM receives an event, it triggers the `react()` function. This part of the code outlines the actual logic of how we react to events: how we update the state and which callbacks to destination chains we emit. It's important to note that a callback to a destination chain initiates the resulting transaction on that destination chain.

We will consider other examples of `react()` functions for different use cases closely in our next lessons.

## Conclusion

In this lesson, we’ve explored how Reactive Smart Contracts (RSCs) operate within two distinct environments: the Reactive Network and a separate ReactVM. We’ve examined smart contract code to understand how to manage this dual state through separate sets of variables and method modifiers. We’ve also discussed the types of transactions our RSCs are designed to handle. This understanding marks a crucial step forward in our journey toward writing our first Reactive Smart Contract.
