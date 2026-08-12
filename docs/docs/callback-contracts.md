---
title: Callback Contracts
sidebar_position: 4
description: How to write a callback contract that receives cross-chain callbacks on a destination chain; AbstractCallback, authorization modifiers, funding, and deployment order.
slug: /callback-contracts
hide_title: true
---

![Callback Contracts Image](./img/callback-contracts.jpg)

## Overview

A callback contract lives on a destination chain and receives calls triggered by a reactive contract. When a [reactive contract](./reactive-contracts.md) requests a callback, the network submits a transaction on the destination chain through a callback proxy, and that proxy calls your contract. From your contract's side, nothing exotic happens: it's an ordinary function call from an ordinary address. There's no `react()`, no subscription, and no `LogRecord`. What a callback contract needs is a way to prove the call is authentic, and funds to pay for it.

## Inheritance

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.29;

import { IPayable } from "@reactive/src/interfaces/IPayable.sol";
import { AbstractCallback } from "@reactive/src/base/AbstractCallback.sol";

contract MyCallback is AbstractCallback {
    event Handled(address indexed reactive_, uint256 value_);

    // `payable`, because the contract pays for the callbacks it receives.
    constructor(IPayable callbackProxy_, address callbackSender_)
        payable
        AbstractCallback(callbackProxy_, callbackSender_)
    {
    }

    function myCallback(address reactive_, uint256 value_)
        external
        onlyServiceProvider
        onlyCallbackSender(reactive_)
    {
        emit Handled(reactive_, value_);
    }
}
```

Three requirements are doing the work.

**Inherit [AbstractCallback](https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractCallback.sol) with two constructor arguments.** `callbackProxy_` is the callback proxy on this chain, which becomes the contract's service provider for payment. `callbackSender_` is the reactive contract you're authorizing. Both are stored immutably, so neither can be changed after deployment.

**Declare the first parameter as an `address` and guard the method twice.** The proxy overwrites the first 160 bits of the payload with the address of the reactive contract that requested the callback, so the first argument is always that address regardless of what you name it.

**Make the constructor `payable` and fund it.** The proxy charges the recipient for callback execution, in this chain's native currency.

Two imports cover it. [AbstractCallback](https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractCallback.sol) is the base, and [IPayable](https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/interfaces/IPayable.sol) is needed only as the type of the constructor's proxy argument.

A contract can't be both reactive and callback. `AbstractPayer` holds a single immutable `_SERVICE_PROVIDER`, and `AbstractReactive` hardcodes it to `SYSTEM` while `AbstractCallback` sets it to the proxy, so inheriting both gives the same base constructor arguments twice and won't compile. A reactive contract that wants to call itself has to check `msg.sender` and the injected address by hand.

| Name                  | Comes from                                                                                                          | What it's for                                                                                     |
|-----------------------|---------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `_CALLBACK_SENDER`    | [AbstractCallback](https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractCallback.sol)  | The reactive contract authorized to trigger your callbacks                                        |
| `onlyCallbackSender`  | [AbstractCallback](https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractCallback.sol)  | Checks the injected address against `_CALLBACK_SENDER`, reverting with `CallbackNotAuthorized`     |
| `_SERVICE_PROVIDER`   | [AbstractPayer](https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractPayer.sol)        | The callback proxy, which is what bills you                                                       |
| `onlyServiceProvider` | [AbstractPayer](https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractPayer.sol)        | Rejects calls from anyone but the proxy, reverting with `NotAuthorized`                           |
| `pay(uint256)`        | [AbstractPayer](https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractPayer.sol)        | Already implemented, and it verifies the caller. Don't write your own                             |
| `_coverDebt()`        | [AbstractPayer](https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractPayer.sol)        | Settles outstanding debt from the contract's balance. Internal, so expose it yourself if you want it callable |
| `receive()`           | [AbstractPayer](https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractPayer.sol)        | Accepts funds, `virtual` so you can override it                                                   |

## Authorizing Callbacks

The two modifiers answer two different questions, and one is not a substitute for the other.

- `onlyServiceProvider` asks whether the caller is the callback proxy. Without it, anyone can call `myCallback()` directly and pass whatever address they like as the first argument, defeating the second check entirely.

- `onlyCallbackSender(reactive_)` asks whether the injected address is the reactive contract you authorized. Without it, any reactive contract on the network can drive your callback through the legitimate proxy.

Together they establish that the call came through the network and originated from the contract you trust. Use both, always.

- The first argument's name is yours; only its type and position matter. Pass it straight to `onlyCallbackSender` and use it as the sender's identity if you need it.

- Inheriting `AbstractCallback` isn't strictly required. Any contract with a matching function signature will receive the call, but then it has no authentication and no way to pay, so it will accept forged calls and accrue debt it can't settle.

- The proxy checks that the target address has code before calling, reverting with `NotAContract` otherwise. A callback to an address holding no contract never reaches the call stage.

## Paying For Callbacks

Callbacks are billed to the recipient, not to the reactive contract that requested them. That's worth stating plainly, because the request happens on Reactive Network while the charge lands on the destination chain, in that chain's native currency.

Reserves are held for you by the callback proxy on each destination chain. Send funds to it, or call `depositTo(yourContract)`, and a charge is drawn from reserves first. If reserves fall short, the shortfall becomes debt and the proxy calls `pay(uint256)` on your contract with a limited gas budget, which `AbstractPayer` already implements. A contract holding a balance settles on the spot.

A contract in debt receives nothing. The proxy reverts with `InDebt` before it even attempts delivery, so callbacks stop arriving until the debt clears. Depositing enough to cover it pays the debt down first and puts the contract back in service.

- **A failed callback still costs you.** The proxy charges after the call regardless of the outcome, so a reverting callback method burns gas, emits `CallbackFailure`, and bills you for the attempt.

- **Gas comes in two flavours of failure.** The requester sets `gasLimit`, and the proxy reserves overhead out of it for charging and kickback. If what remains is below that overhead, the proxy reverts with `InsufficientGas` and your method is never called. If it clears the overhead but isn't enough for your method to finish, your method reverts and the proxy emits `CallbackFailure`. Both trace back to a `gasLimit` set too low on the reactive side.

- `_coverDebt()` is internal, so expose it yourself if an outside call should be able to settle:

```solidity
/// @notice Settles outstanding debt from this contract's own balance.
function coverDebt() external {
    _coverDebt();
}
```

## Deployment Order

Your callback contract needs the reactive contract's address at construction, and the reactive contract needs yours before it can name a recipient. Since `_CALLBACK_SENDER` is immutable, the cycle has to break on the reactive side:

1. Deploy the reactive contract.
2. Deploy the callback contract, passing the callback proxy address and the reactive contract's address.
3. Set the recipient on the reactive contract through an owner-only setter.
4. Fund both. The reactive contract pays for reactive transactions in REACT; the callback contract pays for callbacks in the destination chain's native currency.

Getting `callbackSender_` wrong is unrecoverable. There's no setter, so a mismatched address means redeploying.