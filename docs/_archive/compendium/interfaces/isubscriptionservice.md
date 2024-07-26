---
title: ISubscriptionService
sidebar_position: 2
description: Delve into the Solidity code outlining the ISubscriptionService interface, offering event subscription capabilities for reactive contracts. Learn about its 'subscribe' and 'unsubscribe' functions.
slug: /compendium/interfaces/isubscriptionservice
custom_edit_url: null
---

# ISubscriptionService

## Overview

The following Solidity code defines the `ISubscriptionService` interface, which serves as an event subscription service for reactive contracts that can use this service to subscribe to specific events based on certain criteria and receive notifications when those events occur.

```solidity title="ISubscriptionService.sol"
// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.0;

// @title Interface for event subscription service.
// @notice Reactive contracts receive notifications about new events matching the criteria of their event subscriptions.
interface ISubscriptionService {
    // @notice Subscribes the calling contract to receive events matching the criteria specified.
    // @param chain_id EIP155 origin chain ID for the event (as a `uint256`), or `0` for all chains.
    // @param _contract Contract address to monitor, or `0` for all contracts.
    // @param topic_0 Topic 0 to monitor, or `REACTIVE_IGNORE` for all topics.
    // @param topic_1 Topic 1 to monitor, or `REACTIVE_IGNORE` for all topics.
    // @param topic_2 Topic 2 to monitor, or `REACTIVE_IGNORE` for all topics.
    // @param topic_3 Topic 3 to monitor, or `REACTIVE_IGNORE` for all topics.
    // @dev At least one of criteria above must be non-`REACTIVE_IGNORE`.
    // @dev Will allow duplicate or overlapping subscriptions, clients must ensure idempotency.
    function subscribe(
        uint256 chain_id,
        address _contract,
        uint256 topic_0,
        uint256 topic_1,
        uint256 topic_2,
        uint256 topic_3
    ) external;

    // @notice Removes active subscription of the calling contract, matching the criteria specified, if one exists.
    // @param chain_id Chain ID criterion of the original subscription.
    // @param _contract Contract address criterion of the original subscription.
    // @param topic_0 Topic 0 criterion of the original subscription.
    // @param topic_1 Topic 0 criterion of the original subscription.
    // @param topic_2 Topic 0 criterion of the original subscription.
    // @param topic_3 Topic 0 criterion of the original subscription.
    // @dev This is very expensive.
    function unsubscribe(
        uint256 chain_id,
        address _contract,
        uint256 topic_0,
        uint256 topic_1,
        uint256 topic_2,
        uint256 topic_3
    ) external;
}
```

## Description

The interface consists of two functions: `subscribe` and `unsubscribe`. The `subscribe` function allows a contract to subscribe to events emitted by other contracts when these events match the specified criteria. The `unsubscribe` function removes an active subscription of the calling contract, if one exists, based on the specified criteria. The parameters of both functions mirror each other:

* `chain_id`: A `uint256` representing the `EIP155` source chain ID for the event.

* `_contract`: The address of the originating contract that emitted the event.

* `topic_0`, `topic_1`, `topic_2`, `topic_3`: The topics of the event, which are `uint256` values. Depending on the event, these topics may contain specific information related to the event. At least one of these topics must be specified, or `REACTIVE_IGNORE` can be used to subscribe to all topics.

Both the `subscribe` and `unsubscribe` functions in the `ISubscriptionService` interface are marked as `external`. Any contract that implements the `ISubscriptionService` interface must provide functions with identical parameters and visibility specifier for both `subscribe` and `unsubscribe`, and these functions must be callable from outside the implementing contract.

:::note

Unsubscribing is an expensive operation due to the necessity of searching and removing subscriptions. Duplicate or overlapping subscriptions are allowed, but clients must ensure idempotency.

:::