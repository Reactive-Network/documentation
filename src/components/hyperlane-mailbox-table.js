import React from 'react';

const MailboxAddressTable = () => {
    const data = [
        {
            chain: 'Ethereum',
            chainId: 1,
            address: '0xc005dc82818d67AF737725bD4bf75435d065D239',
            explorer: 'https://etherscan.io/',
            rpcUrl: 'https://chainlist.org/chain/1'
        },
        {
            chain: 'BSC',
            chainId: 56,
            address: '0x2971b9Aec44bE4eb673DF1B88cDB57b96eefe8a4',
            explorer: 'https://bscscan.com/',
            rpcUrl: 'https://chainlist.org/chain/56'
        },
        {
            chain: 'Avalanche',
            chainId: 43114,
            address: '0xFf06aFcaABaDDd1fb08371f9ccA15D73D51FeBD6',
            explorer: 'https://avascan.info/',
            rpcUrl: 'https://chainlist.org/chain/43114'
        },
        {
            chain: 'Base',
            chainId: 8453,
            address: '0xeA87ae93Fa0019a82A727bfd3eBd1cFCa8f64f1D',
            explorer: 'https://basescan.org/',
            rpcUrl: 'https://chainlist.org/chain/8453'
        },
        {
            chain: 'Sonic',
            chainId: 146,
            address: '0x3a464f746D23Ab22155710f44dB16dcA53e0775E',
            explorer: 'https://sonicscan.org/',
            rpcUrl: 'https://chainlist.org/chain/146'
        },
        {
            chain: 'Reactive',
            chainId: 1597,
            address: '0x3a464f746D23Ab22155710f44dB16dcA53e0775E',
            explorer: 'https://reactscan.net/',
            rpcUrl: 'https://mainnet-rpc.rnk.dev/'
        },
    ];

    return (
        <div className="tableContainer">
            <table className="table">
                <thead>
                <tr>
                    <th>Chain</th>
                    <th>Chain ID</th>
                    <th>Hyperlane Mailbox</th>
                    <th>RPC</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, idx) => (
                    <tr key={idx}>
                        <td>
                            <a
                                href={row.explorer}
                                target="_blank"
                                rel="noopener noreferrer">
                                {row.chain}
                            </a>
                        </td>
                        <td>{row.chainId}</td>
                        <td>
                            <code style={{whiteSpace: 'nowrap'}}>
                                {row.address}
                            </code>
                        </td>
                        <td>
                            {row.rpcUrl.includes('chainlist.org') ? (
                                <a
                                    href={row.rpcUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
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

export default MailboxAddressTable;
