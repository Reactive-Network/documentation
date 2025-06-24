import React from 'react';

const MailboxAddressTable = () => {
    const data = [
        {
            chain: 'Ethereum Mainnet',
            chainId: 1,
            address: '0xc005dc82818d67AF737725bD4bf75435d065D239',
            link: 'https://etherscan.io/',
            rpcUrl: 'https://chainlist.org/chain/1'
        },
        {
            chain: 'Binance Smart Chain',
            chainId: 56,
            address: '0x2971b9Aec44bE4eb673DF1B88cDB57b96eefe8a4',
            link: 'https://bscscan.com/',
            rpcUrl: 'https://chainlist.org/chain/56'
        },
        {
            chain: 'Avalanche C-Chain',
            chainId: 43114,
            address: '0xFf06aFcaABaDDd1fb08371f9ccA15D73D51FeBD6',
            link: 'https://avascan.info/',
            rpcUrl: 'https://chainlist.org/chain/43114'
        },
        {
            chain: 'Base Chain',
            chainId: 8453,
            address: '0xeA87ae93Fa0019a82A727bfd3eBd1cFCa8f64f1D',
            link: 'https://basescan.org/',
            rpcUrl: 'https://chainlist.org/chain/8453'
        },
        {
            chain: 'Sonic Mainnet',
            chainId: 146,
            address: '0x3a464f746D23Ab22155710f44dB16dcA53e0775E',
            link: 'https://sonicscan.org/',
            rpcUrl: 'https://chainlist.org/chain/146'
        },
        {
            chain: 'Reactive Mainnet',
            chainId: 1597,
            address: '0x3a464f746D23Ab22155710f44dB16dcA53e0775E',
            link: 'https://reactscan.net',
            rpcUrl: 'https://mainnet-rpc.rnk.dev/' // plain text
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
                    <th>Mailbox Address</th>
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
                        <td>✅</td>
                        <td>✅</td>
                        <td>{row.chainId}</td>
                        <td>{row.address}</td>
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

export default MailboxAddressTable;
