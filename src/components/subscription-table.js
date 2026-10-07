import React from 'react';

const SubscriptionTable = () => {
    return (
        <div className="tableContainer">
            <table className="table">
                <thead>
                <tr>
                    <th>Subscription</th>
                    <th><code>chainId_</code></th>
                    <th><code>contract_</code></th>
                    <th><code>topic0_</code></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Every event from one contract</td>
                    <td>specific</td>
                    <td>specific</td>
                    <td><code>REACTIVE_IGNORE</code></td>
                </tr>
                <tr>
                    <td>One event type across a chain</td>
                    <td>specific</td>
                    <td><code>address(0)</code></td>
                    <td>specific</td>
                </tr>
                <tr>
                    <td>One event from one contract</td>
                    <td>specific</td>
                    <td>specific</td>
                    <td>specific</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SubscriptionTable;