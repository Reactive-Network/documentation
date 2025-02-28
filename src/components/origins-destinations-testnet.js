import React from 'react';

const TestnetChainTable = () => {
    return (
        <div className="tableContainer">
            <table className="table">
                <thead>
                <tr>
                    <th>Chain</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Chain ID</th>
                    <th>Callback Proxy Address</th>
                    <th>Recommended RPC URL</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><a href="https://sepolia.etherscan.io/">Ethereum Sepolia</a></td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>11155111</td>
                    <td>0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA</td>
                    <td><a href="https://chainlist.org/chain/11155111">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://kopli.reactscan.net">Kopli Testnet</a></td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>5318008</td>
                    <td>0x0000000000000000000000000000000000fffFfF</td>
                    <td>https://kopli-rpc.rnk.dev/</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TestnetChainTable;
