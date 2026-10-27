import React from 'react';

const MainnetChainTable = () => {
    const data = [
        {
            chain: 'Arbitrum',
            chainId: 42161,
            explorer: 'https://www.arbiscan.io/',
            callbackAddress: '0xaee8d2deBaB5bE353bfec167C58a549923892e11',
            rpcUrl: 'https://chainlist.org/chain/42161',
            origin: true,
            destination: true
        },
        {
            chain: 'Avalanche',
            chainId: 43114,
            explorer: 'https://avascan.info/',
            callbackAddress: '0x8bdfC7e564B90b31c49Cf1079d4c44400F4e14B4',
            rpcUrl: 'https://chainlist.org/chain/43114',
            origin: true,
            destination: true
        },
        {
            chain: 'Base',
            chainId: 8453,
            explorer: 'https://basescan.org/',
            callbackAddress: '0xCc780DdE33f56f55dE778D42c930959374a4a068',
            rpcUrl: 'https://chainlist.org/chain/8453',
            origin: true,
            destination: true
        },
        {
            chain: 'BSC',
            chainId: 56,
            explorer: 'https://bscscan.com/',
            callbackAddress: '0xfc41eE9d3A836b41399BEcce83b06B3e5650f3BB',
            rpcUrl: 'https://chainlist.org/chain/56',
            origin: true,
            destination: true
        },
        {
            chain: 'Ethereum',
            chainId: 1,
            explorer: 'https://etherscan.io/',
            callbackAddress: '0xFCE1F192F489c988392aBC16E91e359d540d94Fe',
            rpcUrl: 'https://chainlist.org/chain/1',
            origin: true,
            destination: true
        },
        {
            chain: 'HyperEVM',
            chainId: 999,
            explorer: 'https://hyperevmscan.io/',
            callbackAddress: '0x754120EC7a6eF81E4c5c835AA603C63Da64693E6',
            rpcUrl: 'https://chainlist.org/chain/999',
            origin: true,
            destination: true
        },
        {
            chain: 'Reactive',
            chainId: 1597,
            explorer: 'https://reactscan.net',
            callbackAddress: '0x8888888888888888888888888888888888888888',
            rpcUrl: 'https://mainnet-rpc.rnk.dev/',
            origin: true,
            destination: true
        },
        {
            chain: 'Robinhood',
            chainId: 4663,
            explorer: 'https://robinhoodchain.blockscout.com/',
            callbackAddress: '0x476F44b11F5C942c58f4c8E3d0300E5710743585',
            rpcUrl: 'https://chainlist.org/chain/4663',
            origin: true,
            destination: true
        },
        {
            chain: 'Unichain',
            chainId: 130,
            explorer: 'https://uniscan.xyz/',
            callbackAddress: '0x754120EC7a6eF81E4c5c835AA603C63Da64693E6',
            rpcUrl: 'https://chainlist.org/chain/130',
            origin: true,
            destination: true
        },
    ];

    return (
        <div className="tableContainer">
            <table className="table">
                <thead>
                <tr>
                    <th>Chain</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th style={{minWidth: '100px'}}>Chain ID</th>
                    <th>Callback Proxy</th>
                    <th>RPC</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, idx) => (
                    <tr key={idx}>
                        <td><a href={row.explorer} target="_blank" rel="noopener noreferrer"> {row.chain} </a></td>
                        <td>{row.origin ? '✅' : '➖'}</td>
                        <td>{row.destination ? '✅' : '➖'}</td>
                        <td>{row.chainId}</td>
                        <td>
                            <code style={{whiteSpace: 'nowrap'}}>
                                {row.callbackAddress}
                            </code>
                        </td>
                        <td>
                            {row.rpcUrl.includes('chainlist.org') ? (
                                <a href={row.rpcUrl} target="_blank" rel="noopener noreferrer">
                                    Chainlist
                                </a>
                            ) : (
                                <code>{row.rpcUrl}</code>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MainnetChainTable;