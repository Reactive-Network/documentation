import React from 'react';

const CallbackInheritanceTable = () => {
    return (
        <div className="tableContainer">
            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Comes from</th>
                    <th>What it's for</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><code>_CALLBACK_SENDER</code></td>
                    <td><a href="https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractCallback.sol">AbstractCallback</a></td>
                    <td>The reactive contract authorized to trigger your callbacks</td>
                </tr>
                <tr>
                    <td><code>onlyCallbackSender</code></td>
                    <td><a href="https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractCallback.sol">AbstractCallback</a></td>
                    <td>Checks the injected address against <code>_CALLBACK_SENDER</code>, reverting with <code>CallbackNotAuthorized</code></td>
                </tr>
                <tr>
                    <td><code>_SERVICE_PROVIDER</code></td>
                    <td><a href="https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractPayer.sol">AbstractPayer</a></td>
                    <td>The callback proxy, which is what bills you</td>
                </tr>
                <tr>
                    <td><code>onlyServiceProvider</code></td>
                    <td><a href="https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractPayer.sol">AbstractPayer</a></td>
                    <td>Rejects calls from anyone but the proxy, reverting with <code>NotAuthorized</code></td>
                </tr>
                <tr>
                    <td><code>pay(uint256)</code></td>
                    <td><a href="https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractPayer.sol">AbstractPayer</a></td>
                    <td>Already implemented, and it verifies the caller. Don't write your own</td>
                </tr>
                <tr>
                    <td><code>_coverDebt()</code></td>
                    <td><a href="https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractPayer.sol">AbstractPayer</a></td>
                    <td>Settles outstanding debt from the contract's balance. Internal, so expose it yourself if you want it callable</td>
                </tr>
                <tr>
                    <td><code>receive()</code></td>
                    <td><a href="https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractPayer.sol">AbstractPayer</a></td>
                    <td>Accepts funds, <code>virtual</code> so you can override it</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CallbackInheritanceTable;