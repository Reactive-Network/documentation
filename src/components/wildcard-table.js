import React from 'react';

const WildcardTable = () => {
    return (
        <div className="tableContainer">
            <table className="table">
                <thead>
                <tr>
                    <th>Criterion</th>
                    <th>Wildcard</th>
                    <th>Matches</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><code>chainId_</code></td>
                    <td><code>0</code></td>
                    <td>Any chain</td>
                </tr>
                <tr>
                    <td><code>contract_</code></td>
                    <td><code>address(0)</code></td>
                    <td>Any contract on the specified chain</td>
                </tr>
                <tr>
                    <td><code>topic0_</code> to <code>topic3_</code></td>
                    <td><code>REACTIVE_IGNORE</code></td>
                    <td>Any value in that position</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default WildcardTable;