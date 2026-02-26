import React from 'react';

const TestnetChainTable = () => {
    const data = [
        {
            chain: 'Avalanche Fuji',
            chainId: 43113,
            explorer: 'https://43113.testnet.routescan.io/',
            callbackAddress: '',
            rpcUrl: 'https://chainlist.org/chain/43113',
            origin: true,
            destination: false
        },
        {
            chain: 'Base Sepolia',
            chainId: 84532,
            explorer: 'https://sepolia.basescan.org/',
            callbackAddress: '0xa6eA49Ed671B8a4dfCDd34E36b7a75Ac79B8A5a6',
            rpcUrl: 'https://chainlist.org/chain/84532',
            origin: true,
            destination: true
        },
        {
            chain: 'BSC Testnet',
            chainId: 97,
            explorer: 'https://testnet.bscscan.com/',
            callbackAddress: '',
            rpcUrl: 'https://chainlist.org/chain/97',
            origin: true,
            destination: false
        },
        {
            chain: 'Ethereum Sepolia',
            chainId: 11155111,
            explorer: 'https://sepolia.etherscan.io/',
            callbackAddress: '0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA',
            rpcUrl: 'https://chainlist.org/chain/11155111',
            origin: true,
            destination: true
        },
        {
            chain: 'Reactive Lasna',
            chainId: 5318007,
            explorer: 'https://lasna.reactscan.net',
            callbackAddress: '0x0000000000000000000000000000000000fffFfF',
            rpcUrl: 'https://lasna-rpc.rnk.dev/',
            origin: true,
            destination: true
        },
        {
            chain: 'Polygon Amoy',
            chainId: 80002,
            explorer: 'https://amoy.polygonscan.com/',
            callbackAddress: '',
            rpcUrl: 'https://chainlist.org/chain/80002',
            origin: true,
            destination: false
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
                    <th>Chain ID</th>
                    <th>Callback Proxy</th>
                    <th>RPC</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, idx) => (
                    <tr key={idx}>
                        <td>
                            <a href={row.explorer} target="_blank" rel="noopener noreferrer">
                                {row.chain}
                            </a>
                        </td>
                        <td>{row.origin ? '✅' : '➖'}</td>
                        <td>{row.destination ? '✅' : '➖'}</td>
                        <td>{row.chainId}</td>
                        <td>
                            {row.callbackAddress ? (
                                <code style={{whiteSpace: 'nowrap'}}>
                                    {row.callbackAddress}
                                </code>
                            ) : (
                                '➖'
                            )}
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

export default TestnetChainTable;
