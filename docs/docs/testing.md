---
title: Testing with Foundry
sidebar_position: 15
description: Test Reactive Contracts locally with Foundry using the reactive-test-lib — no testnet deployment required.
slug: /testing
hide_title: true
---

# Testing with Foundry

## Overview

[Reactive Test Lib](https://github.com/Reactive-Network/reactive-test-lib) is a Foundry-native testing library that simulates the full Reactive Network lifecycle locally. It replaces the system contract, ReactVM, and callback proxy with mock implementations, allowing you to run `forge test` against your Reactive Contracts without deploying to a testnet.

The library supports:

- Event subscriptions with wildcard matching
- The full `react()` invocation pipeline
- Cross-chain callback execution with RVM ID injection
- Same-chain (self) callbacks via `SERVICE_ADDR`
- Cron-based triggers
- Multi-step reactive protocols (e.g., confirmation chains, bridges)
- Automatic chain ID detection via a contract registry

Install the library:

```bash
forge install Reactive-Network/reactive-test-lib
```

Add the remapping to `remappings.txt`:

```
reactive-test-lib/=lib/reactive-test-lib/src/
```

## Architecture

The library simulates three runtime components that normally only exist on the Reactive Network:

| Real Component | Mock | Purpose |
|---|---|---|
| System Contract | `MockSystemContract` | Subscription registry with wildcard matching |
| ReactVM | `ReactiveSimulator` | Event delivery and `react()` invocation |
| Callback Proxy | `MockCallbackProxy` | Cross-chain callback execution with RVM ID injection |

The simulation runs on a single EVM instance. Chain IDs are logical values — there is no actual cross-chain communication.

## Getting Started

### Base Test Contract

All reactive tests inherit from `ReactiveTest`, which extends Foundry's `Test.sol`:

```solidity
import "reactive-test-lib/base/ReactiveTest.sol";
import {CallbackResult} from "reactive-test-lib/interfaces/IReactiveInterfaces.sol";

contract MyReactiveTest is ReactiveTest {
    function setUp() public override {
        super.setUp();
        // Deploy your contracts here
    }
}
```

`super.setUp()` automatically:

1. Deploys `MockSystemContract` and etches its code to `SERVICE_ADDR` (`0x...fffFfF`)
2. Deploys `MockCallbackProxy` for cross-chain callback execution
3. Sets `rvmId` to `address(this)` (simulated deployer identity)
4. Sets `reactiveChainId` to `REACTIVE_CHAIN_ID` (`0x512512`)

After setup, any contract that calls `subscribe()` on `SERVICE_ADDR` in its constructor — including contracts inheriting from `AbstractReactive` — will register subscriptions with the mock system contract.

### Deploying Contracts Under Test

Deploy your origin, reactive, and callback contracts in `setUp()`. Pass `address(proxy)` as the callback sender for contracts extending `AbstractCallback`:

```solidity
// Origin contract (L1) — emits events that trigger reactions
origin = new BasicDemoL1Contract();

// Callback contract — pass proxy as the authorized callback sender
cb = new BasicDemoL1Callback(address(proxy));

// Reactive contract — constructor calls subscribe() on MockSystemContract
rc = new BasicDemoReactiveContract(
    address(sys),                                            // system contract
    SEPOLIA_CHAIN_ID,                                        // origin chain
    SEPOLIA_CHAIN_ID,                                        // destination chain
    address(origin),                                         // contract to watch
    uint256(keccak256("Received(address,address,uint256)")), // topic_0
    address(cb)                                              // callback target
);
```

### Running a Single Reactive Cycle

`triggerAndReact()` executes the full pipeline once: emit event → match subscription → call `react()` → execute callbacks.

```solidity
function testCallbackFires() public {
    CallbackResult[] memory results = triggerAndReact(
        address(origin),
        abi.encodeWithSignature("receive()"),
        SEPOLIA_CHAIN_ID
    );

    assertCallbackCount(results, 1);
    assertCallbackSuccess(results, 0);
    assertCallbackEmitted(results, address(cb));
}
```

Use `triggerAndReactWithValue()` to send ETH with the triggering call:

```solidity
CallbackResult[] memory results = triggerAndReactWithValue(
    address(origin),
    abi.encodeWithSignature("receive()"),
    0.01 ether,
    SEPOLIA_CHAIN_ID
);
```

## Testing the Basic Demo

The [Basic Demo](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/basic) is the simplest Reactive Contract pattern. An L1 contract emits an event when receiving ETH. The reactive contract subscribes to that event and, if the value exceeds a threshold, emits a `Callback` to the L1 callback contract.

```solidity
contract BasicDemoTest is ReactiveTest {
    BasicDemoL1Contract origin;
    BasicDemoReactiveContract rc;
    BasicDemoL1Callback cb;

    uint256 constant SEPOLIA = 11155111;

    function setUp() public override {
        super.setUp();

        origin = new BasicDemoL1Contract();
        cb = new BasicDemoL1Callback(address(proxy));
        rc = new BasicDemoReactiveContract(
            address(sys),
            SEPOLIA,
            SEPOLIA,
            address(origin),
            uint256(keccak256("Received(address,address,uint256)")),
            address(cb)
        );
    }

    function testCallbackAboveThreshold() public {
        // 0.01 ETH > 0.001 threshold — callback fires
        CallbackResult[] memory results = triggerAndReactWithValue(
            address(origin),
            "",
            0.01 ether,
            SEPOLIA
        );

        assertCallbackCount(results, 1);
        assertCallbackSuccess(results, 0);
    }

    function testNoCallbackBelowThreshold() public {
        // 0.0005 ETH < 0.001 threshold — no callback
        CallbackResult[] memory results = triggerAndReactWithValue(
            address(origin),
            "",
            0.0005 ether,
            SEPOLIA
        );

        assertNoCallbacks(results);
    }
}
```

## Testing Uniswap Stop Orders

The [Uniswap V2 Stop Order](https://github.com/Reactive-Network/reactive-smart-contract-demos/tree/main/src/demos/uniswap-v2-stop-order) demo monitors a Uniswap pair's reserves and triggers a swap when the price crosses a threshold. The reactive contract subscribes to `Sync` events on the pair contract.

To test this pattern, simulate the Sync event by deploying a mock pair that emits the event:

```solidity
contract StopOrderTest is ReactiveTest {
    MockUniswapPair pair;
    UniswapDemoStopOrderReactive rc;
    UniswapDemoStopOrderCallback stopOrder;

    uint256 constant SEPOLIA = 11155111;
    uint256 constant SYNC_TOPIC = 0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1;

    function setUp() public override {
        super.setUp();

        pair = new MockUniswapPair();
        stopOrder = new UniswapDemoStopOrderCallback(address(proxy));
        rc = new UniswapDemoStopOrderReactive(
            address(pair),
            address(stopOrder),
            client,
            true,       // token0
            1e18,       // coefficient
            500         // threshold
        );
        enableVmMode(address(rc));
    }

    function testStopOrderTriggeredBelowThreshold() public {
        // Simulate a sync event with reserves that push price below threshold
        CallbackResult[] memory results = triggerAndReact(
            address(pair),
            abi.encodeWithSignature("emitSync(uint112,uint112)", 1000, 100),
            SEPOLIA
        );

        assertCallbackCount(results, 1);
        assertCallbackEmitted(results, address(stopOrder));
    }
}
```

:::info[vmOnly Modifier]
Contracts that use `vmOnly` on their `react()` function need `enableVmMode(address(rc))` called after deployment. This flips the internal `vm` storage flag to `true`. Without this, `react()` will revert with `"VM only"`.
:::

## Testing Self-Callbacks

Some Reactive Contracts emit callbacks that target themselves on the Reactive Network rather than an external chain. This pattern is used in the [REACT Bridge](https://github.com/Reactive-Network/react-bridge), where `ReactiveBridge` emits:

```solidity
emit Callback(reactive_chain_id, address(this), GAS_LIMIT, payload);
```

On the real network, these same-chain callbacks are delivered by `SERVICE_ADDR`. The `ReactiveBridge` constructor authorizes `SERVICE_ADDR` as its callback sender:

```solidity
constructor(...) AbstractCallback(address(SERVICE_ADDR)) { ... }
```

The simulator handles this automatically. When a `Callback` event's `chain_id` matches `reactiveChainId`, it delivers via `vm.prank(SERVICE_ADDR)` instead of the proxy. This means `authorizedSenderOnly` passes correctly.

```solidity
contract SelfCallbackTest is ReactiveTest {
    ReactiveBridge rb;

    function setUp() public override {
        super.setUp();
        rb = new ReactiveBridge(
            reactiveChainId,
            SEPOLIA,
            address(bridge),
            ...
        );
        enableVmMode(address(rb));
    }

    function testSelfCallbackDelivered() public {
        // The reactive bridge's deliver() and returnMessage() are self-callbacks.
        // They are delivered via SERVICE_ADDR, not the proxy.
        CallbackResult[] memory results = triggerFullCycleWithValue(
            address(rb),
            abi.encodeWithSignature("bridge(uint256,address)", 123, recipient),
            1 ether,
            reactiveChainId,
            20
        );

        // Self-callbacks succeed because msg.sender == SERVICE_ADDR
        for (uint256 i = 0; i < results.length; i++) {
            assertCallbackSuccess(results, i);
        }
    }
}
```

## Testing Multi-Step Protocols

Complex protocols like the [REACT Bridge](https://github.com/Reactive-Network/react-bridge) require multiple reactive cycles. A single user action triggers a chain of events across multiple logical chains:

```
1. ReactiveBridge.bridge() → emits SendMessage
2. react(SendMessage) → Callback to Bridge.initialMessage()
3. Bridge emits ConfirmationRequest
4. react(ConfirmationRequest) → Callback to Bridge.requestConfirmation()
5. Bridge emits Confirmation → react() → Callback to Bridge.confirm()
6. Bridge emits DeliveryConfirmation → react() → ...
```

`triggerAndReact()` only runs one cycle. For multi-step protocols, use `triggerFullCycle()`:

```solidity
CallbackResult[] memory results = triggerFullCycleWithValue(
    address(reactiveBridge),
    abi.encodeWithSignature("bridge(uint256,address)", uniqueish, recipient),
    1 ether,
    reactiveChainId,
    20  // max iterations — safety limit
);
```

The simulator chains reactive rounds automatically:

1. Executes the initial call, captures events
2. Matches events against subscriptions, calls `react()`, collects `Callback` specs
3. Executes each callback while recording events emitted by the target
4. Tags new events with the callback's `chain_id` (events from a Sepolia callback become Sepolia events)
5. Feeds events back to step 2
6. Stops when no more callbacks are produced or `maxIterations` is reached

All `CallbackResult` values across all iterations are returned in a single array.

## Chain Registry

When testing contracts that span multiple logical chains, you must pass the correct `originChainId` for each trigger call. The chain registry eliminates this by mapping contract addresses to their logical chain IDs:

```solidity
function setUp() public override {
    super.setUp();

    bridge = new Bridge(address(proxy), ...);
    reactiveBridge = new ReactiveBridge(reactiveChainId, SEPOLIA, address(bridge), ...);

    // Register contracts with their logical chains
    registerChain(address(bridge), SEPOLIA);
    registerChain(address(reactiveBridge), reactiveChainId);
}
```

After registration, use the auto-detect overloads that omit `originChainId`:

```solidity
// These resolve the chain ID from the registry automatically
CallbackResult[] memory results = triggerAndReact(
    address(bridge),
    abi.encodeWithSignature("bridge(uint256,address,uint256)", id, recipient, amount)
);

CallbackResult[] memory results = triggerFullCycle(
    address(reactiveBridge),
    abi.encodeWithSignature("bridge(uint256,address)", id, recipient),
    20
);
```

In full-cycle mode, events from callback execution are automatically tagged with the callback's destination chain ID, so the registry is mainly useful for the initial trigger.

## Testing Cron Contracts

Reactive Contracts can subscribe to system cron events for periodic execution. The simulator provides `triggerCron()` to deliver synthetic cron events:

```solidity
import {CronType} from "reactive-test-lib/interfaces/IReactiveInterfaces.sol";
import {ReactiveConstants} from "reactive-test-lib/constants/ReactiveConstants.sol";

contract CronTest is ReactiveTest {
    BasicCronContract rc;

    function setUp() public override {
        super.setUp();
        rc = new BasicCronContract(address(sys), ReactiveConstants.CRON_TOPIC_1);
    }

    function testCronTriggersCallback() public {
        CallbackResult[] memory results = triggerCron(CronType.Cron1);
        assertCallbackCount(results, 1);
    }

    function testAdvanceBlocksAndTrigger() public {
        uint256 startBlock = block.number;
        CallbackResult[] memory results = advanceAndTriggerCron(100, CronType.Cron1);

        assertCallbackCount(results, 1);
        assertEq(block.number, startBlock + 100);
    }
}
```

Available cron types: `Cron1` (every block), `Cron10`, `Cron100`, `Cron1000`, `Cron10000`.

## Assertion Helpers

`ReactiveTest` provides assertion helpers for common callback checks:

```solidity
// Exact callback count
assertCallbackCount(results, 3);

// Zero callbacks
assertNoCallbacks(results);

// A specific target received a callback
assertCallbackEmitted(results, address(myCallback));

// Callback at index succeeded / failed
assertCallbackSuccess(results, 0);
assertCallbackFailure(results, 1);
```

Each `CallbackResult` contains:

| Field | Description |
|---|---|
| `chainId` | Destination chain ID from the `Callback` event |
| `target` | Address the callback was executed on |
| `gasLimit` | Gas limit specified by `react()` |
| `payload` | ABI-encoded function call (with RVM ID injected) |
| `success` | Whether the callback call succeeded |
| `returnData` | Return or revert data |

## How the Mock Environment Works

### Subscription Matching

`MockSystemContract` stores subscriptions and supports the same wildcard semantics as the real system contract:

| Field | Wildcard | Meaning |
|---|---|---|
| `chain_id` | `0` | Match any chain |
| `_contract` | `address(0)` | Match any contract |
| `topic_0..3` | `REACTIVE_IGNORE` | Match any topic |

### RVM ID Injection

The real Reactive Network overwrites the first 160 bits of the first callback argument with the deployer's address. Both the `MockCallbackProxy` (cross-chain) and the simulator's direct delivery (same-chain) replicate this. The `rvmIdOnly` modifier works correctly in tests.

Override `rvmId` to simulate a different deployer:

```solidity
rvmId = makeAddr("customDeployer");
```

### Callback Routing

Callbacks are routed based on the `Callback` event's `chain_id`:

- **Cross-chain** (`chain_id != reactiveChainId`) — executed via `MockCallbackProxy`
- **Same-chain** (`chain_id == reactiveChainId`) — executed via `vm.prank(SERVICE_ADDR)`

### `vmOnly` and `rnOnly`

Etching `MockSystemContract` to `SERVICE_ADDR` causes `detectVm()` to set `vm = false` (code exists at the address). This means:

- `rnOnly` functions work in constructors — `subscribe()` calls succeed
- `vmOnly` functions need `enableVmMode(address(rc))` after deployment

## Further Considerations

- **Single-chain simulation**: Everything runs on one EVM. Chain IDs are logical values only — there is no fork or actual cross-chain communication.
- **No dependency on `reactive-lib`**: The test library reimplements ABI-compatible interfaces. Your contracts import `reactive-lib` as usual; the test library only needs to be ABI-compatible.
- **Compatibility**: Solidity >= 0.8.20, Foundry with `vm.recordLogs()` support, `reactive-lib` v0.2.0+.

[Reactive Test Lib on GitHub →](https://github.com/Reactive-Network/reactive-test-lib)
