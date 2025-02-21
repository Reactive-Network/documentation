import React from 'react';

const ChainTable = () => {
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
                    <td>0x33Bbb7D0a2F1029550B0e91f653c4055DC9F4Dd8</td>
                    <td><a href="https://chainlist.org/chain/11155111">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://etherscan.io/">Ethereum Mainnet</a></td>
                    <td>✅</td>
                    <td>➖</td>
                    <td>1</td>
                    <td>➖</td>
                    <td><a href="https://chainlist.org/chain/1">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://avascan.info/">Avalanche C-Chain</a></td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>43114</td>
                    <td>0x76DdEc79A96e5bf05565dA4016C6B027a87Dd8F0</td>
                    <td><a href="https://chainlist.org/chain/43114">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://arbiscan.io/">Arbitrum One</a></td>
                    <td>✅</td>
                    <td>➖</td>
                    <td>42161</td>
                    <td>➖</td>
                    <td><a href="https://chainlist.org/chain/42161">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://pacific-explorer.manta.network/">Manta Pacific</a></td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>169</td>
                    <td>0x9299472A6399Fd1027ebF067571Eb3e3D7837FC4</td>
                    <td><a href="https://chainlist.org/chain/169">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://basescan.org/">Base Chain</a></td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>8453</td>
                    <td>0x4730c58FDA9d78f60c987039aEaB7d261aAd942E</td>
                    <td><a href="https://chainlist.org/chain/8453">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://bscscan.com/">Binance Smart Chain</a></td>
                    <td>✅</td>
                    <td>➖</td>
                    <td>56</td>
                    <td>➖</td>
                    <td><a href="https://chainlist.org/chain/56">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://polygonscan.com/">Polygon PoS</a></td>
                    <td>✅</td>
                    <td>➖</td>
                    <td>137</td>
                    <td>➖</td>
                    <td><a href="https://chainlist.org/chain/137">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://zkevm.polygonscan.com/">Polygon zkEVM</a></td>
                    <td>➖</td>
                    <td>➖</td>
                    <td>1101</td>
                    <td>➖</td>
                    <td><a href="https://chainlist.org/chain/1101">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://opbnbscan.com/">opBNB Mainnet</a></td>
                    <td>➖</td>
                    <td>➖</td>
                    <td>204</td>
                    <td>➖</td>
                    <td><a href="https://chainlist.org/chain/204">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://kopli.reactscan.net">Kopli Testnet</a></td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>5318008</td>
                    <td>0x0000000000000000000000000000000000FFFFFF</td>
                    <td>https://kopli-rpc.rnk.dev/</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ChainTable;
