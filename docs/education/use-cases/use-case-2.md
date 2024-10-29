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

## Deployment & Testing

To deploy the contracts to Ethereum Sepolia, [clone](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main) the project and follow these steps. Replace the relevant keys, addresses, and endpoints as needed. Make sure the following environment variables are correctly configured before proceeding:

* `SEPOLIA_RPC` — https://rpc2.sepolia.org
* `SEPOLIA_PRIVATE_KEY` — Ethereum Sepolia private key
* `REACTIVE_RPC` — https://kopli-rpc.rkt.ink
* `SEPOLIA_CALLBACK_PROXY_ADDR` — 0x33Bbb7D0a2F1029550B0e91f653c4055DC9F4Dd8
* `KOPLI_CALLBACK_PROXY_ADDR` — 0x0000000000000000000000000000000000FFFFFF
* `CLIENT_WALLET` — Deployer's EOA wallet address

**IMPORTANT**: The following assumes that `ApprovalService` and `ApprovalListener` are deployed using the same private key. `ApprovalDemoToken` and `ApprovalEthExch` can use other keys if needed.

**Note**: To receive REACT, send SepETH to the Reactive faucet on Ethereum Sepolia (`0x9b9BB25f1A81078C544C829c5EB7822d747Cf434`). An equivalent amount will be sent to your address.

### Step 1 — Service Deployment

Current deployment addresses that can be reused:

```bash
export APPROVAL_SRV_ADDR=0x810B924Db9D52fE263408f231012d8e90D71D48d
export APPROVAL_RCT_ADDR=0xb5C84B52D17a95dE108D21F7CE9AEc5A227bb1B6
```

The `ApprovalService` and `ApprovalListener` contracts can be deployed once and used by any number of clients.

#### ApprovalService Deployment

To deploy the `ApprovalService` contract, run the command given below. The constructor requires these arguments:

- Subscription Fee (in Wei): `100`
- Gas Price Coefficient: `1`
- Extra Gas for Reactive Service: `10`

```bash
forge create src/demos/approval-magic/ApprovalService.sol:ApprovalService --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY --constructor-args 100 1 10
```

The `Deployed to` address from the response should be assigned to `APPROVAL_SRV_ADDR`.

**NOTE**: To ensure a successful callback, `APPROVAL_SRV_ADDR` must have an ETH balance. Find more details [here](https://dev.reactive.network/system-contract#callback-payments). To fund the contract, run the following command:

```bash
cast send $APPROVAL_SRV_ADDR --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY --value 0.1ether
```

To cover the debt of `APPROVAL_SRV_ADDR`, run this command:

```bash
cast send --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY $APPROVAL_SRV_ADDR "coverDebt()"
```

Alternatively, you can deposit funds into the [Callback Proxy](https://dev.reactive.network/origins-and-destinations) contract on Sepolia, using the command below. The EOA address whose private key signs the transaction pays the fee.

```bash
cast send --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY $SEPOLIA_CALLBACK_PROXY_ADDR "depositTo(address)" $APPROVAL_SRV_ADDR --value 0.1ether
```

#### Reactive Deployment

Deploy the `ApprovalListener` contract with the command shown below. Make sure to use the same private key (`SEPOLIA_PRIVATE_KEY`). Both contracts must be deployed from the same address as this ensures that the Sepolia contract can authenticate the RVM ID for callbacks.

```bash
forge create src/demos/approval-magic/ApprovalListener.sol:ApprovalListener --rpc-url $REACTIVE_RPC --private-key $SEPOLIA_PRIVATE_KEY --constructor-args $APPROVAL_SRV_ADDR
```

The `Deployed to` address should be assigned to `APPROVAL_RCT_ADDR`.

**NOTE**: To ensure a successful callback, `APPROVAL_RCT_ADDR` must have an ETH balance. Find more details [here](https://dev.reactive.network/system-contract#callback-payments). To fund the contract, run the following command:

```bash
cast send $APPROVAL_RCT_ADDR --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY --value 0.1ether
```

To cover the debt of `APPROVAL_RCT_ADDR`, run this command:

```bash
cast send --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY $APPROVAL_RCT_ADDR "coverDebt()"
```

Alternatively, you can deposit funds into the [Callback Proxy](https://dev.reactive.network/origins-and-destinations) contract on Kopli Testnet, using the command below. The EOA address whose private key signs the transaction pays the fee.

```bash
cast send --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY $KOPLI_CALLBACK_PROXY_ADDR "depositTo(address)" $APPROVAL_RCT_ADDR --value 0.1ether
```

### Step 2 — Demo Client Deployment

#### Token Deployment

Deploy the `ApprovalDemoToken` contract with the command given below. The constructor arguments are the name and symbol of the token you deploy. As an example, use the `"FTW"` value for both arguments.

```bash
forge create src/demos/approval-magic/ApprovalDemoToken.sol:ApprovalDemoToken --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY --constructor-args "FTW" "FTW"
```

The `Deployed to` address should be assigned to `TOKEN_ADDR`.

#### Client Deployment

Deploy the `ApprovalEthExch` contract with the following command:

```bash
forge create src/demos/approval-magic/ApprovalEthExch.sol:ApprovalEthExch --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY --constructor-args $APPROVAL_SRV_ADDR $TOKEN_ADDR
```

The `Deployed to` address should be assigned to `EXCH_ADDR`.

### Step 3 — Fund and Subscribe

#### Fund the Exchanged Contract

Transfer `1000` tokens (Service Fee in Wei) to the exchange contract:

```bash
cast send $EXCH_ADDR --value 1000 --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY
```

#### Subscribe to Approval Service

Subscribe the exchange contract to the approval service:

```bash
cast send $EXCH_ADDR "subscribe()" --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY
```

**NOTE**: Dynamic subscription to approval events takes about 30 seconds, roughly twice Sepolia's block interval plus Reactive's block interval, before the service starts processing approvals for the new subscriber.

### Step 4 — Test Approvals

Approve the transfer for `100` tokens (Tokens to exchange in Wei) and watch the magic happen:

```bash
cast send $TOKEN_ADDR "approve(address,uint256)" $EXCH_ADDR 100 --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY
```

### Step 5 — Magic Swap Deployment

You can use two pre-deployed tokens or deploy your own (see the Token Deployment section).

```bash
export TOKEN1_ADDR=0x8b6e74c0C1B1cb3aaFA950cCc359CC41C7A9E8c5
export TOKEN2_ADDR=0xdaD2e45B8ab12d646C6756D8959BDbBbc14c206B
```

You can request each token once as follows:

```bash
cast send $TOKEN1_ADDR "request()" --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY
```

```bash
cast send $TOKEN2_ADDR "request()" --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY
```

#### Token Deployment

Deploy two tokens with constructor arguments: `"TOKEN_NAME"` and `"TOKEN_SYMBOL"`. As an example, use `"TK1"` for both arguments of the first token and `"TK2"` for the second.

```bash
forge create src/demos/approval-magic/ApprovalDemoToken.sol:ApprovalDemoToken --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY --constructor-args "TK1" "TK1"
```

The `Deployed to` address should be assigned to `TOKEN1_ADDR`.

```bash
forge create src/demos/approval-magic/ApprovalDemoToken.sol:ApprovalDemoToken --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY --constructor-args "TK2" "TK2"
```

The `Deployed to` address should be assigned to `TOKEN2_ADDR`.

#### Create Liquidity Pool

Create a liquidity pool for the two tokens using the Uniswap pair factory contract address `0x7E0987E5b3a30e3f2828572Bb659A548460a3003`, which is a constant in this context.

```bash
cast send 0x7E0987E5b3a30e3f2828572Bb659A548460a3003 'createPair(address,address)' --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY $TOKEN1_ADDR $TOKEN2_ADDR
```

**NOTE**: Assign the Uniswap pair address from transaction logs on [Sepolia scan](https://sepolia.etherscan.io/) to `UNISWAP_PAIR_ADDR` or export the pre-made pair for the tokens above:

```bash
export UNISWAP_PAIR_ADDR=0xe410faC0B719E6400cC966aDb23E16C2b2fDAB9d
```

#### Add liquidity

Transfer tokens to the Uniswap pair:

```bash
cast send $TOKEN1_ADDR 'transfer(address,uint256)' --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY $UNISWAP_PAIR_ADDR 0.5ether
```
```bash
cast send $TOKEN2_ADDR 'transfer(address,uint256)' --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY $UNISWAP_PAIR_ADDR 0.5ether
```

Mint liquidity, using your EOA address (Client Wallet):

```bash
cast send $UNISWAP_PAIR_ADDR 'mint(address)' --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY $CLIENT_WALLET
```

#### Swap Deployment

Deploy the `ApprovalMagicSwap` contract:

```bash
forge create src/demos/approval-magic/ApprovalMagicSwap.sol:ApprovalMagicSwap --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY --constructor-args $APPROVAL_SRV_ADDR $TOKEN1_ADDR $TOKEN2_ADDR
```

The `Deployed to` address should be assigned to `SWAP_ADDR`.

#### Fund and Subscribe Swap Contract

If needed, export the pre-deployed magic swap contract:

```bash
export SWAP_ADDR=0xC3B13E40Ff7c333246aDCD36b925cD4371775651
```

Transfer some funds to the swap contract and subscribe to the service:


```bash
cast send $SWAP_ADDR --value 100000 --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY
```

```bash
cast send $SWAP_ADDR "subscribe()" --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY
```

### Step 6 — Test Swap

See the magic in action by approving one of the tokens (e.g., `TOKEN1_ADDR`) for the swap contract:

```bash
cast send $TOKEN1_ADDR "approve(address,uint256)" $SWAP_ADDR 0.1ether --rpc-url $SEPOLIA_RPC --private-key $SEPOLIA_PRIVATE_KEY
```