import React from 'react';

const FundsTable = () => {
    return (
        <div className="tableContainer">
            <table className="table">
                <thead>
                <tr>
                    <th>Value</th>
                    <th>Held by</th>
                    <th>Meaning</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Balance</td>
                    <td>The contract itself</td>
                    <td>Funds the contract can spend</td>
                </tr>
                <tr>
                    <td>Reserves</td>
                    <td>System contract or callback proxy</td>
                    <td>Pre-paid credit for fees</td>
                </tr>
                <tr>
                    <td>Debt</td>
                    <td>System contract or callback proxy</td>
                    <td>Fees owed but not yet paid</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default FundsTable;