---
title: "Use Case: Approval Magic Demo"
sidebar_position: 4
description: Explore how the reactive network automates token approvals and transfers across multiple chains. Learn about the ApprovalService, ApprovalListener, and client contracts like ApprovalEthExch and ApprovalMagicSwap, and how they optimize gas costs while ensuring secure, real-time token interactions. Gain practical insights into its setup, functionality, and deployment.
slug: use-case-2
---

# Use Case: Approval Magic Demo

## Overview

This article focuses on the [Approval Magic Demo](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/approval-magic), where a reactive contract listens for token approvals and automates token transfers using pre-approved assets. Traditional approval mechanisms often require manual steps, but this demo uses reactive contracts to automate approvals and transfers across multiple networks.

## Contracts

**Subscription-Based Approval Service**: The [ApprovalService](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalService.sol) contract is responsible for subscription-based approvals. Users (or contracts) can subscribe by paying a fee, enabling them to receive and process approval callbacks that originate from token approvals. This service tracks subscribers, covers the gas cost of triggered callbacks, and emits `Subscribe`/`Unsubscribe` events. If the subscription conditions aren’t met or a contract fails to pay for its gas usage, the subscriber is automatically unsubscribed.

**Reactive Contract**: The [ApprovalListener](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalListener.sol) contract elaborates on how the Reactive Network can integrate with the `ApprovalService`. It listens for specific log events — such as `Subscribe`, `Unsubscribe`, and ERC-20 approval signatures — and reacts accordingly. When these events occur, `ApprovalListener` triggers callbacks to manage subscriptions or handle token approvals.

**Token Initialization and Distribution**: The [ApprovalDemoToken](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalDemoToken.sol) is an ERC-20 token used for testing. At deployment, it mints 100 tokens for the deployer. Additionally, anyone can call `request()` once to receive 1 token (costing 1 Ether).

**Token Exchange**: The [ApprovalEthExch](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalEthExch.sol) contract shows how a subscription-based approval flow can facilitate token-for-ETH exchanges. It relies on `ApprovalService` to handle approval callbacks, ensuring tokens can be transferred without requiring extra user interaction. Owners can manage subscriptions, withdraw funds, and perform this exchange as a building block for more complex trading or DeFi protocols.

**Automated Token Swaps**: The [ApprovalMagicSwap](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalMagicSwap.sol) contract extends the subscription-based approach by incorporating Uniswap V2 token swaps. When a token approval triggers a callback, this contract automatically swaps the approved tokens for another ERC-20 token via Uniswap — again, without requiring the user to take any extra steps.

## Further Considerations

Deploying these smart contracts in a live environment involves addressing key considerations:

- **Security:** Ensuring security measures for token approvals and transfers to prevent unauthorized access.
- **Scalability:** Managing a high volume of subscribers and transactions to maintain performance.
- **Gas Optimization:** Reducing gas costs associated with approval handling to improve economic viability.
- **Interoperability:** Expanding support to a wider range of tokens and networks to improve versatility.

## Deployment

To deploy the contracts to Ethereum Sepolia and Reactive Kopli, [clone](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main) the project and follow the [Deployment & Testing](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/approval-magic) steps. Replace the relevant keys, addresses, and endpoints as needed. Make sure all environment variables are correctly configured before proceeding.

## Conclusion

The Approval Magic Demo exemplifies the transformative potential of reactive smart contracts by automating token approvals and transfers. By utilizing `ApprovalService` and `ApprovalListener`, the system simplifies complex multi-chain interactions while optimizing gas costs. Client contracts like `ApprovalEthExch` and `ApprovalMagicSwap` further demonstrate its real-world utility in enabling token exchanges and swaps.