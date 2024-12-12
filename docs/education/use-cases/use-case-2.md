---
title: "Use Case: Approval Magic Demo"
sidebar_position: 4
description: Explore how the reactive network automates token approvals and transfers across multiple chains. Learn about the ApprovalService, ApprovalListener, and client contracts like ApprovalEthExch and ApprovalMagicSwap, and how they optimize gas costs while ensuring secure, real-time token interactions. Gain practical insights into its setup, functionality, and deployment.
slug: use-case-2
---

# Use Case: Approval Magic Demo

## Overview

This article focuses on the [Approval Magic Demo](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/approval-magic), where a reactive contract listens for token approvals and automates token transfers using pre-approved assets. Traditional approval mechanisms often require manual steps, but this demo uses reactive contracts to automate approvals and transfers across multiple networks.

Key smart contracts in the demo include:

- [ApprovalService](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalService.sol): Manages subscriptions and handles gas-efficient token settlements.
- [ApprovalListener](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalListener.sol): A reactive listener that automates approval flows across chains.
- [ApprovalDemoToken](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalDemoToken.sol): An ERC-20 token used to demonstrate approval mechanics.
- [ApprovalEthExch](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalEthExch.sol) & [ApprovalMagicSwap](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalMagicSwap.sol): Client contracts facilitating token transfers and swaps based on approvals.

## ApprovalService

[ApprovalService](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalService.sol) automates user subscriptions and token approvals. Key functions:

**subscribe():** Allows users to subscribe to the service by paying the required fee. It ensures the correct fee is provided and that the user is not already subscribed. Upon successful subscription, it emits a `Subscribe` event and marks the user as subscribed.

```solidity
function subscribe() external payable {
    require(msg.value == subscription_fee, 'Incorrect fee');
    require(!subscribers[msg.sender], 'Already subscribed');
    emit Subscribe(msg.sender);
    subscribers[msg.sender] = true;
}
```

**unsubscribe():** Allows a subscribed user to opt out of the service. It checks if the user is currently subscribed, emits an `Unsubscribe` event, and updates the user's subscription status to `false`.

```solidity
function unsubscribe() external {
    require(subscribers[msg.sender], 'Not subscribed');
    emit Unsubscribe(msg.sender);
    subscribers[msg.sender] = false;
}
```

**onApproval():** The `onApproval()` function handles token approval events. It is triggered when an approval occurs, validating the caller and handling the approval logic. It calculates the gas cost for executing the approval, adjusts it based on a gas coefficient, and ensures the transaction is settled by calling the `settle()` function on the target contract.

```solidity
function onApproval(
    address rvm_id,
    IApprovalClient target,
    address approver,
    address approved_token,
    uint256 amount
) external authorizedSenderOnly rvmIdOnly(rvm_id) {
    uint256 gas_init = gasleft();
    target.onApproval(approver, approved_token, amount);
    uint256 adjusted_gas_price = tx.gasprice * gas_coefficient * (extra_gas + gas_init - gasleft());
    adjusted_gas_price = adjusted_gas_price > 100 ? 100 : adjusted_gas_price;
    target.settle(adjusted_gas_price);
}
```

**Gas Management:** Gas cost is dynamically calculated during the approval process to ensure the transaction remains cost-efficient. A fail-safe mechanism unsubscribes users if they can't cover the gas costs, protecting the service from losses.

```solidity
uint256 adjusted_gas_price = tx.gasprice * gas_coefficient * (extra_gas + gas_init - gasleft());
```

## ApprovalListener

[ApprovalListener](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalListener.sol) listens for subscription and approval events, providing the automation of approval processes across different chains. By using predefined topics, the contract captures relevant events and triggers corresponding actions, such as subscribing and unsubscribing users from the service.

**react():** Listens for events and determines whether the event is a subscription, unsubscription, or approval, triggering the corresponding action.

```solidity
function react(
    uint256 /* chain_id */,
    address _contract,
    uint256 topic_0,
    uint256 topic_1,
    uint256 topic_2,
    uint256 /* topic_3 */,
    bytes calldata data,
    uint256 /* block_number */,
    uint256 /* op_code */
) external vmOnly {
```

**Subscription Events:** Handles subscription events by encoding the `subscribe()` function and emitting a callback to process the subscription.

```solidity
if (topic_0 == SUBSCRIBE_TOPIC_0) {
    bytes memory payload = abi.encodeWithSignature(
        "subscribe(address,address)",
        address(0),
        address(uint160(topic_1))
    );
    emit Callback(REACTIVE_CHAIN_ID, address(this), CALLBACK_GAS_LIMIT, payload);
}
```

**Unsubscription Events:** Processes unsubscription events, encoding the `unsubscribe()` function and emitting a callback to remove the user from the service.

```solidity
else if (topic_0 == UNSUBSCRIBE_TOPIC_0) {
    bytes memory payload = abi.encodeWithSignature(
        "unsubscribe(address,address)",
        address(0),
        address(uint160(topic_1))
    );
    emit Callback(REACTIVE_CHAIN_ID, address(this), CALLBACK_GAS_LIMIT, payload);
}
```

**Approval Events:** Decodes approval event data, constructs the `onApproval` payload, and emits a callback to handle token approval logic.

```solidity
else {
    (uint256 amount) = abi.decode(data, (uint256));
    bytes memory payload = abi.encodeWithSignature(
        "onApproval(address,address,address,address,uint256)",
        address(0),
        address(uint160(topic_2)),
        address(uint160(topic_1)),
        _contract,
        amount
    );
    emit Callback(SEPOLIA_CHAIN_ID, address(approval_service), CALLBACK_GAS_LIMIT, payload);
}
```

## ApprovalDemoToken

[ApprovalDemoToken](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalDemoToken.sol) is a sample ERC-20 token used to demonstrate approval mechanics. Users can request tokens, and once approved by the service contract, they receive their allocated tokens automatically.

```solidity
function request() external {
    require(!recipients[msg.sender], 'Already received yours');
    _mint(msg.sender, 1 ether);
}
```

## Client Contracts

Client contracts such as [ApprovalEthExch](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalEthExch.sol) and [ApprovalMagicSwap](https://github.com/Reactive-Network/reactive-smart-contract-demos/blob/main/src/demos/approval-magic/ApprovalMagicSwap.sol) demonstrate real-world use cases, automating token transfers and swaps upon receiving approval.

### ApprovalEthExch

A basic token exchange that transfers approved tokens from the user to the contract. The `onApproval()` function facilitates the transfer of approved tokens from the user to the contract while ensuring adequate checks are in place. It verifies that the approved token is supported, the approved amount matches the allowance, the user has sufficient tokens, and the contract has enough ETH for payout. Upon passing these checks, the function transfers the tokens from the approver to the contract and sends the corresponding ETH back to the approver.

```solidity
function onApproval(
    address approver,
    address approved_token,
    uint256 amount
) external onlyService {
    require(approved_token == address(token), 'Token not supported');
    require(amount == token.allowance(approver, address(this)), 'Approved amount mismatch');
    require(amount <= token.balanceOf(approver), 'Insufficient tokens');
    require(amount <= address(this).balance, 'Insufficient funds for payout');
    token.transferFrom(approver, address(this), amount);
    payable(approver).transfer(amount);
}
```

### ApprovalMagicSwap

This contract uses Uniswap to swap tokens automatically based on approvals. The `onApproval` function enables the automatic swapping of tokens on Uniswap. It first verifies that the approved token is one of the supported tokens (`token0` or `token1`), checks that the approved amount matches the allowance, and confirms that the approver has sufficient token balance. After transferring the tokens from the approver to the contract, it approves the router for the token transfer and constructs a path for the swap. Finally, it executes the token swap via Uniswap and transfers the resulting tokens back to the approver.

```solidity
function onApproval(
    address approver,
    address approved_token,
    uint256 amount
) external onlyService {
    require(approved_token == address(token0) || approved_token == address(token1), 'Token not supported');
    require(amount == IERC20(approved_token).allowance(approver, address(this)), 'Approved amount mismatch');
    require(amount <= IERC20(approved_token).balanceOf(approver), 'Insufficient tokens');
    assert(IERC20(approved_token).transferFrom(approver, address(this), amount));
    assert(IERC20(approved_token).approve(address(router), amount));
    address[] memory path = new address[](2);
    path[0] = approved_token;
    path[1] = approved_token == address(token0) ? address(token1) : address(token0);
    uint256[] memory tokens = router.swapExactTokensForTokens(amount, 0, path, address(this), DEADLINE);
    assert(IERC20(path[1]).transfer(approver, tokens[1]));
}
```

## Further Considerations

Deploying these smart contracts in a live environment involves addressing key considerations:

- **Security:** Ensuring security measures for token approvals and transfers to prevent unauthorized access.
- **Scalability:** Managing a high volume of subscribers and transactions to maintain performance.
- **Gas Optimization:** Reducing gas costs associated with approval handling to improve economic viability.
- **Interoperability:** Expanding support to a wider range of tokens and networks to improve versatility.

## Deployment

To deploy the contracts to Ethereum Sepolia and Reactive Kopli, [clone](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main) the project and follow the [Deployment & Testing](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/approval-magic) steps. Replace the relevant keys, addresses, and endpoints as needed. Make sure all environment variables are correctly configured before proceeding.

## Conclusion