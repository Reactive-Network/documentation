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
                    <td><a href="https://testnet.bscscan.com/">Binance Smart Chain</a></td>
                    <td>✅</td>
                    <td>➖</td>
                    <td>97</td>
                    <td></td>
                    <td><a href="https://chainlist.org/chain/97">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://www.oklink.com/amoy">Polygon Amoy</a></td>
                    <td>✅</td>
                    <td>➖</td>
                    <td>80002</td>
                    <td></td>
                    <td><a href="https://chainlist.org/chain/80002">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://43113.testnet.routescan.io/">Avalanche Fuji</a></td>
                    <td>✅</td>
                    <td>➖</td>
                    <td>43113</td>
                    <td></td>
                    <td><a href="https://chainlist.org/chain/43113">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://sepolia.basescan.org/">Base Sepolia</a></td>
                    <td>✅</td>
                    <td>➖</td>
                    <td>84532</td>
                    <td></td>
                    <td><a href="https://chainlist.org/chain/84532">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://kopli.reactscan.net">Reactive Kopli</a></td>
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
