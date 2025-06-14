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
                    <td>✅</td>
                    <td>1</td>
                    <td>0x1D5267C1bb7D8bA68964dDF3990601BDB7902D76</td>
                    <td><a href="https://chainlist.org/chain/1">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://bscscan.com/">Binance Smart Chain</a></td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>56</td>
                    <td>0xdb81A196A0dF9Ef974C9430495a09B6d535fAc48</td>
                    <td><a href="https://chainlist.org/chain/56">Find on Chainlist</a></td>
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
                    <td><a href="https://basescan.org/">Base Chain</a></td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>8453</td>
                    <td>0x0D3E76De6bC44309083cAAFdB49A088B8a250947</td>
                    <td><a href="https://chainlist.org/chain/8453">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://sonicscan.org ">Sonic Mainnet</a></td>
                    <td>✅</td>
                    <td>➖</td>
                    <td>146</td>
                    <td>➖</td>
                    <td><a href="https://chainlist.org/chain/146">Find on Chainlist</a></td>
                </tr>
                <tr>
                    <td><a href="https://reactscan.net">Reactive Mainnet</a></td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>1597</td>
                    <td>0x0000000000000000000000000000000000fffFfF</td>
                    <td>https://mainnet-rpc.rnk.dev/</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MainnetChainTable;
