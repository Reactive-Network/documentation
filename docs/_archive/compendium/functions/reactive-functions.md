---
sidebar_position: 2
title: Reactive Contract Functions
description: Discover the functionality of Reactive Smart Contracts, emphasizing Uniswap V2 integration.
slug: /compendium/functions/reactive-functions
custom_edit_url: null
---

# Reactive Contract Functions

## Overview

The basic functions of Reactive Smart Contracts can be explained using the one specifically designed for the Uniswap V2
platform.

## Constructor Function

```solidity title="UniswapDemoStopOrderReactive.sol"
constructor(
        address service_address,
        address _pair,
        address _stop_order,
        address _client,
        bool _token0,
        uint256 _coefficient,
        uint256 _threshold
    ) {
        triggered = false;
        done = false;
        SubscriptionService service = SubscriptionService(service_address);
        pair = _pair;
        bytes memory payload = abi.encodeWithSignature("subscribe(address,uint256)", pair, UNISWAP_V2_SYNC_TOPIC_0);
        (bool subscription_result,) = address(service).call(payload);
        if (!subscription_result) {
            vm = true;
        }
        stop_order = _stop_order;
        bytes memory payload_2 = abi.encodeWithSignature("subscribe(address,uint256)", stop_order, STOP_ORDER_STOP_TOPIC_0);
        (bool subscription_result_2,) = address(service).call(payload_2);
        if (!subscription_result_2) {
            vm = true;
        }
        client = _client;
        token0 = _token0;
        coefficient = _coefficient;
        threshold = _threshold;
    }
```

### Parameters

* `service_address`: Address of the `SubscriptionService` contract.

* `_pair`: Address of the Uniswap V2 pair contract.

* `_stop_order`: Address of the stop order contract.

* `_client`: Address of the client.

* `_token0`: Boolean indicating whether `token0` is being monitored.

* `_coefficient`: Coefficient value for comparison.

* `_threshold`: Threshold value for comparison.

### Description

The `UniswapDemoStopOrderReactive.sol` contract's constructor initializes the contract by performing several key tasks.
It sets state variables such as `triggered` and `done` to `false`, subscribes to events using the `SubscriptionService`,
and sets other contract parameters including the Uniswap V2 `pair` contract address, the `stop_order` contract address,
the `client` address, a boolean value indicating whether `token0` is being monitored, the `coefficient` and `threshold`
values used for comparison.

This constructor is invoked once during the contract deployment process. It ensures that the contract is properly initialized
and configured to monitor events and execute stop orders based on the specified parameters.

## react Function

```solidity title="UniswapDemoStopOrderReactive.sol"
function react(
        uint256 chain_id,
        address _contract,
        uint256 topic_0,
        uint256 topic_1,
        uint256 topic_2,
        uint256 /* topic_3 */,
        bytes calldata data
    ) external {
        require(vm, 'ReactVM only');
        // TODO: Support for multiple dynamic orders? Not viable until we have dynamic subscriptions.
        assert(!done);
        if (_contract == stop_order) {
            // TODO: Practically speaking, it's broken, because we also need to check the transfer direction.
            //       For the purposes of the demo, I'm just going to ignore that complication.
            if (
                triggered &&
                topic_0 == STOP_ORDER_STOP_TOPIC_0 &&
                topic_1 == uint256(uint160(pair)) &&
                topic_2 == uint256(uint160(client))
            ) {
                done = true;
            }
        } else {
            Reserves memory sync = abi.decode(data, ( Reserves ));
            if (below_threshold(sync)) {
                bytes memory payload = abi.encodeWithSignature(
                    "stop(address,address,bool,uint256,uint256)",
                    pair,
                    client,
                    token0,
                    coefficient,
                    threshold
                );
                triggered = true;
                emit Callback(chain_id, stop_order, CALLBACK_GAS_LIMIT, payload);
            }
        }
    }
```

### Parameters

* `chain_id`: Unsigned integer representing the chain ID.

* `_contract`: Address of the contract emitting the event.

* `topic_0`: Unsigned integer representing the first topic of the event.

* `topic_1`: Unsigned integer representing the second topic of the event.

* `topic_2`: Unsigned integer representing the third topic of the event.

* `data`: Calldata containing additional data associated with the event.

### Description

The function serves as a reaction mechanism within the contract, determining the appropriate response to specific events.
It first verifies whether the function is invoked within the ReactVM environment. Then, it ensures that the function hasn't
been executed before by checking the `done` flag. Depending on the source of the event, it takes different actions:

* If the event originates from the `stop_order` contract, it verifies specific conditions and sets the `done` flag to `true`
if met.

* If the event comes from another contract, it decodes the calldata to extract reserve information. Based on these reserves,
it evaluates whether they meet certain threshold conditions using the `below_threshold` function. If the conditions are satisfied,
it triggers the execution of a stop order by emitting a callback with relevant details and sets the `triggered` flag to `true`.

## below_threshold Function

```solidity title="UniswapDemoStopOrderReactive.sol"
function below_threshold(Reserves memory sync) internal view returns (bool) {
        if (token0) {
            return (sync.reserve1 * coefficient) / sync.reserve0 <= threshold;
        } else {
            return (sync.reserve0 * coefficient) / sync.reserve1 <= threshold;
        }
    }
```

### Parameters

* `Reserves memory sync`: Represents the current reserves of the Uniswap pair.

### Description

The `below_threshold` function determines whether the current reserves of a Uniswap pair meet the threshold conditions for
executing a stop order. It takes the reserves as input and returns a boolean value indicating whether the conditions are met.
Since it only reads data from the contract and does not modify the state, it is marked as view, ensuring it does not incur any
gas costs when called externally.

The function checks if `token0` is `true`, indicating that `reserve1` and `coefficient` should be used for comparison. If `true`, it
computes the ratio (`reserve1` * `coefficient`) / `reserve0` and compares it with the threshold. If the computed value is less
than or equal to the threshold, it returns `true`.

If `token0` is `false`, it indicates that `reserve0` and `coefficient` should be used for comparison. It calculates
(`reserve0` * `coefficient`) / `reserve1` and compares it with the threshold. If the calculated value is less than or equal
to the threshold, it returns `true`.

Otherwise, it returns `false` if the conditions are not met. 