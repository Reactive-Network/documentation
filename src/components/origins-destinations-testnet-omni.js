import React from 'react';

const TestnetChainTable = () => {
    const data = [
        {
            chain: 'Base Sepolia',
            chainId: 84532,
            explorer: 'https://sepolia.basescan.org',
            callbackAddress: '0x476F44b11F5C942c58f4c8E3d0300E5710743585',
            rpcUrl: 'https://chainlist.org/chain/84532',
            origin: true,
            destination: true
        },
        {
            chain: 'Ethereum Sepolia',
            chainId: 11155111,
            explorer: 'https://sepolia.etherscan.io',
            callbackAddress: '0xAa14d9Cd0f788Ca23d11805986C1d8bd035D23b4',
            rpcUrl: 'https://chainlist.org/chain/11155111',
            origin: true,
            destination: true
        },
        {
            chain: 'Reactive Lasna',
            chainId: 5318007,
            explorer: 'https://lasna.reactscan.net',
            callbackAddress: '0x8888888888888888888888888888888888888888',
            rpcUrl: 'https://lasna-rpc.rnk.dev/',
            origin: true,
            destination: true
        },
        {
            chain: 'Unichain Sepolia',
            chainId: 1301,
            explorer: 'https://sepolia.uniscan.xyz',
            callbackAddress: '0x775c9B990ADe401060B78D0e98684eEf8d2466C1',
            rpcUrl: 'https://chainlist.org/chain/1301',
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