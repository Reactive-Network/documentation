import React from 'react';

const MainnetChainTable = () => {
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
                    <td><a href="https://etherscan.io/">Ethereum Mainnet</a></td>
                    <td>✅</td>
                    <td>➖</td>
                    <td>1</td>
                    <td>0x1D5267C1bb7D8bA68964dDF3990601BDB7902D76</td>
                    <td><a href="https://chainlist.org/chain/1">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://avascan.info/">Avalanche C-Chain</a></td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>43114</td>
                    <td>0x934Ea75496562D4e83E80865c33dbA600644fCDa</td>
                    <td><a href="https://chainlist.org/chain/43114">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://bscscan.com/">Binance Smart Chain</a></td>
                    <td>✅</td>
                    <td>➖</td>
                    <td>56</td>
                    <td>0xdb81A196A0dF9Ef974C9430495a09B6d535fAc48</td>
                    <td><a href="https://chainlist.org/chain/56">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://polygonscan.com/">Polygon PoS</a></td>
                    <td>✅</td>
                    <td>➖</td>
                    <td>137</td>
                    <td>0x42458259d5c85fB2bf117f197f1Fef8C3b7dCBfe</td>
                    <td><a href="https://chainlist.org/chain/137">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://basescan.org/">Base Chain</a></td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>8453</td>
                    <td>0x0D3E76De6bC44309083cAAFdB49A088B8a250947</td>
                    <td><a href="https://chainlist.org/chain/8453">Find on Chainlist</a></td>
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
                    <td><a href="https://opbnbscan.com/">opBNB Mainnet</a></td>
                    <td>➖</td>
                    <td>➖</td>
                    <td>204</td>
                    <td>➖</td>
                    <td><a href="https://chainlist.org/chain/204">Find on Chainlist</a></td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MainnetChainTable;
