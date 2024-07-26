---
sidebar_position: 3
title: Destination Contract Functions
description: Discover the core functionalities of Destination Contract Functions, focusing on Uniswap V2 integration.
slug: /compendium/functions/destination-functions
custom_edit_url: null
---

# Destination Contract Functions

## Overview

## Constructor Function

```solidity title="UniswapDemoStopOrderCallback.sol"
constructor(address _callback_sender, address _router) {
        callback_sender = _callback_sender;
        router = IUniswapV2Router02(_router);
    }
```

### Parameters

* `_callback_sender`: Address of the sender authorized to invoke the stop order function.

* `_router`: Address of the Uniswap V2 router contract.

### Description

The constructor function in the `UniswapDemoStopOrderCallback.sol` contract initializes the contract by setting the
`callback_sender` and router variables. This constructor is called only once during the deployment of the contract.
It ensures that the contract is properly configured with the address of the callback sender and the Uniswap V2 router
contract, enabling it to execute stop orders on the Uniswap V2 platform. `callback_sender` sets its variable to the
provided `_callback_sender` address. This address represents the entity authorized to call the stop function. `router`
casts its address to the `IUniswapV2Router02` interface, initializing the router variable. This allows the contract to
interact with the Uniswap V2 router contract.

## stop Function

```solidity title="UniswapDemoStopOrderCallback.sol"
function stop(
        address pair,
        address client,
        bool is_token0,
        uint256 coefficient,
        uint256 threshold
    ) external {
        if (callback_sender != address(0)) {
            require(msg.sender == callback_sender, 'Unauthorized');
        }
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();
        (uint112 reserve0, uint112 reserve1, ) = IUniswapV2Pair(pair).getReserves();
        require(below_threshold(is_token0, Reserves({ reserve0: reserve0, reserve1: reserve1 }), coefficient, threshold), 'Rate above threshold');
        address token_sell = is_token0 ? token0 : token1;
        address token_buy = is_token0 ? token1 : token0;
        uint256 allowance = IERC20(token_sell).allowance(client, address(this));
        require(allowance > 0, 'No allowance');
        require(IERC20(token_sell).balanceOf(client) >= allowance, 'Insufficient funds');
        assert(IERC20(token_sell).transferFrom(client, address(this), allowance));
        assert(IERC20(token_sell).approve(address(router), allowance));
        address[] memory path = new address[](2);
        path[0] = token_sell;
        path[1] = token_buy;
        uint256[] memory tokens = router.swapExactTokensForTokens(allowance, 0, path, address(this), DEADLINE);
        assert(IERC20(token_buy).transfer(client, tokens[1]));
        emit Stop(pair, client, token_sell, tokens);
    }
```

### Parameters

Parameters:

* `pair`: Address of the Uniswap V2 pair contract.

* `client`: Address of the client.

* `is_token0`: Boolean indicating whether the token being monitored is `token0`.

* `coefficient`: Coefficient value used for comparison.

* `threshold`: Threshold value used for comparison.

### Description

This function executes a stop order on the Uniswap V2 decentralized exchange. It ensures that the caller is authorized
to
execute the stop order, retrieves token addresses from the Uniswap V2 pair contract, checks if the current reserves meet
the
specified threshold conditions, and performs the swap transaction on behalf of the client. Finally, it emits a `Stop`
event
with relevant information about the executed stop order.

## below_threshold Function

```solidity title="UniswapDemoStopOrderCallback.sol"
function below_threshold(bool token0, Reserves memory sync, uint256 coefficient, uint256 threshold) internal pure returns (bool) {
        if (token0) {
            return (sync.reserve1 * coefficient) / sync.reserve0 <= threshold;
        } else {
            return (sync.reserve0 * coefficient) / sync.reserve1 <= threshold;
        }
    }
```

### Parameters

* `token0`: Boolean indicating whether the token being monitored is `token0`.

* `sync`: A `Reserves` struct containing the current reserve values of the pair.

* `coefficient`: Coefficient value used for comparison.

* `threshold`: Threshold value used for comparison.

### Description

The function calculates whether the current reserves meet the threshold conditions. If the `token0` parameter is `true`, it computes
(`reserve1` * `coefficient`) / `reserve0` and compares it with the threshold. If `token0` is `false`, it computes (`reserve0` * `coefficient`) / `reserve1`
and compares it with the threshold. It returns a boolean value indicating whether the current reserves meet the threshold conditions. Internally used within
the contract, the function determines whether a stop order should be executed based on the current reserves of the Uniswap pair. Being a pure function, it
does not modify the contract state and can be safely called from other functions.