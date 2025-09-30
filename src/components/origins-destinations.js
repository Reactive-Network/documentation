import React from 'react';

const MainnetChainTable = () => {
    const data = [
        {
            chain: 'Ethereum Mainnet',
            chainId: 1,
            link: 'https://etherscan.io/',
            callbackAddress: '0x1D5267C1bb7D8bA68964dDF3990601BDB7902D76',
            rpcUrl: 'https://chainlist.org/chain/1',
            origin: true,
            destination: true
        },
        {
            chain: 'Binance Smart Chain',
            chainId: 56,
            link: 'https://bscscan.com/',
            callbackAddress: '0xdb81A196A0dF9Ef974C9430495a09B6d535fAc48',
            rpcUrl: 'https://chainlist.org/chain/56',
            origin: true,
            destination: true
        },
        {
            chain: 'Avalanche C-Chain',
            chainId: 43114,
            link: 'https://avascan.info/',
            callbackAddress: '0x934Ea75496562D4e83E80865c33dbA600644fCDa',
            rpcUrl: 'https://chainlist.org/chain/43114',
            origin: true,
            destination: true
        },
        {
            chain: 'Base Chain',
            chainId: 8453,
            link: 'https://basescan.org/',
            callbackAddress: '0x0D3E76De6bC44309083cAAFdB49A088B8a250947',
            rpcUrl: 'https://chainlist.org/chain/8453',
            origin: true,
            destination: true
        },
        {
            chain: 'Arbitrum One',
            chainId: 42161,
            link: 'https://www.arbiscan.io/',
            callbackAddress: '0x4730c58FDA9d78f60c987039aEaB7d261aAd942E',
            rpcUrl: 'https://chainlist.org/chain/42161',
            origin: true,
            destination: true
        },
        {
            chain: 'Sonic Mainnet',
            chainId: 146,
            link: 'https://sonicscan.org/',
            callbackAddress: '0x9299472a6399fd1027ebf067571eb3e3d7837fc4',
            rpcUrl: 'https://chainlist.org/chain/146',
            origin: true,
            destination: true
        },
        {
            chain: 'HyperEVM',
            chainId: 999,
            link: 'https://hyperevmscan.io/',
            callbackAddress: '0x9299472a6399fd1027ebf067571eb3e3d7837fc4',
            rpcUrl: 'https://chainlist.org/chain/999',
            origin: true,
            destination: true
        },
        {
            chain: 'Abstract',
            chainId: 2741,
            link: 'https://abscan.org/',
            callbackAddress: '➖',
            rpcUrl: 'https://chainlist.org/chain/2741',
            origin: true,
            destination: true
        },
        {
            chain: 'Reactive Mainnet',
            chainId: 1597,
            link: 'https://reactscan.net',
            callbackAddress: '0x0000000000000000000000000000000000fffFfF',
            rpcUrl: 'https://mainnet-rpc.rnk.dev/',
            origin: true,
            destination: true
        }
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
                    <th>Callback Proxy Address</th>
                    <th>Recommended RPC URL</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, idx) => (
                    <tr key={idx}>
                        <td>
                            <a href={row.link} target="_blank" rel="noopener noreferrer">
                                {row.chain}
                            </a>
                        </td>
                        <td>{row.origin ? '✅' : '➖'}</td>
                        <td>{row.destination ? '✅' : '➖'}</td>
                        <td>{row.chainId}</td>
                        <td>{row.callbackAddress}</td>
                        <td>
                            {row.rpcUrl.includes('chainlist.org') ? (
                                <a href={row.rpcUrl} target="_blank" rel="noopener noreferrer">
                                    Find on Chainlist
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
