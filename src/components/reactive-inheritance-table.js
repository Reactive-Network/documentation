import React from 'react';

const ReactiveInheritanceTable = () => {
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
                    <td><code>SYSTEM</code></td>
                    <td><a href="https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractReactive.sol">AbstractReactive</a></td>
                    <td>The system contract at <code>0x8888888888888888888888888888888888888888</code>, where you subscribe and request callbacks</td>
                </tr>
                <tr>
                    <td><code>REACTIVE_IGNORE</code></td>
                    <td><a href="https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractReactive.sol">AbstractReactive</a></td>
                    <td>Wildcard value for any topic position</td>
                </tr>
                <tr>
                    <td><code>onlySystem</code></td>
                    <td><a href="https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractReactive.sol">AbstractReactive</a></td>
                    <td>Rejects <code>react()</code> calls from anyone but the system contract</td>
                </tr>
                <tr>
                    <td><code>LogRecord</code></td>
                    <td><a href="https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/interfaces/IReactive.sol">IReactive</a></td>
                    <td>The struct <code>react()</code> receives</td>
                </tr>
                <tr>
                    <td><code>_SERVICE_PROVIDER</code></td>
                    <td><a href="https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractPayer.sol">AbstractPayer</a></td>
                    <td>The contract allowed to bill you, <code>SYSTEM</code> for a reactive contract</td>
                </tr>
                <tr>
                    <td><code>onlyServiceProvider</code></td>
                    <td><a href="https://github.com/Reactive-Network/reactive-lib-omni/blob/master/src/base/AbstractPayer.sol">AbstractPayer</a></td>
                    <td>Rejects calls from anyone but that service provider. <code>onlySystem</code> is this same check under a clearer name</td>
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

export default ReactiveInheritanceTable;