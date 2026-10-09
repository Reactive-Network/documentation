import React from 'react';

const MainnetChainTable = () => {
    const data = [
        // {
        //     chain: 'Abstract',
        //     chainId: 2741,
        //     explorer: 'https://abscan.org/',
        //     callbackAddress: '0x9299472A6399Fd1027ebF067571Eb3e3D7837FC4',
        //     rpcUrl: 'https://chainlist.org/chain/2741',
        //     origin: true,
        //     destination: true
        // },
        {
            chain: 'Arbitrum',
            chainId: 42161,
            explorer: 'https://www.arbiscan.io/',
            callbackAddress: '⌛',
            rpcUrl: 'https://chainlist.org/chain/42161',
            origin: true,
            destination: true
        },
        {
            chain: 'Avalanche',
            chainId: 43114,
            explorer: 'https://avascan.info/',
            callbackAddress: '⌛',
            rpcUrl: 'https://chainlist.org/chain/43114',
            origin: true,
            destination: true
        },
        {
            chain: 'Base',
            chainId: 8453,
            explorer: 'https://basescan.org/',
            callbackAddress: '⌛',
            rpcUrl: 'https://chainlist.org/chain/8453',
            origin: true,
            destination: true
        },
        {
            chain: 'BSC',
            chainId: 56,
            explorer: 'https://bscscan.com/',
            callbackAddress: '⌛',
            rpcUrl: 'https://chainlist.org/chain/56',
            origin: true,
            destination: true
        },
        {
            chain: 'Ethereum',
            chainId: 1,
            explorer: 'https://etherscan.io/',
            callbackAddress: '⌛',
            rpcUrl: 'https://chainlist.org/chain/1',
            origin: true,
            destination: true
        },
        {
            chain: 'HyperEVM',
            chainId: 999,
            explorer: 'https://hyperevmscan.io/',
            callbackAddress: '⌛',
            rpcUrl: 'https://chainlist.org/chain/999',
            origin: true,
            destination: true
        },
        // {
        //     chain: 'Linea',
        //     chainId: 59144,
        //     explorer: 'https://lineascan.build/',
        //     callbackAddress: '0x9299472A6399Fd1027ebF067571Eb3e3D7837FC4',
        //     rpcUrl: 'https://chainlist.org/chain/59144',
        //     origin: true,
        //     destination: true
        // },
        // {
        //     chain: 'Plasma',
        //     chainId: 9745,
        //     explorer: 'https://plasmascan.to/',
        //     callbackAddress: '0x9299472A6399Fd1027ebF067571Eb3e3D7837FC4',
        //     rpcUrl: 'https://chainlist.org/chain/9745',
        //     origin: true,
        //     destination: true
        // },
        {
            chain: 'Reactive',
            chainId: 1597,
            explorer: 'https://reactscan.net',
            callbackAddress: '0x8888888888888888888888888888888888888888',
            rpcUrl: 'https://mainnet-rpc.rnk.dev/',
            origin: true,
            destination: true
        },
        // {
        //     chain: 'Sonic',
        //     chainId: 146,
        //     explorer: 'https://sonicscan.org/',
        //     callbackAddress: '0x9299472A6399Fd1027ebF067571Eb3e3D7837FC4',
        //     rpcUrl: 'https://chainlist.org/chain/146',
        //     origin: true,
        //     destination: true
        // },
        {
            chain: 'Robinhood',
            chainId: 4663,
            explorer: 'https://robinhoodchain.blockscout.com/',
            callbackAddress: '⌛',
            rpcUrl: 'https://chainlist.org/chain/4663',
            origin: true,
            destination: true
        },
        {
            chain: 'Unichain',
            chainId: 130,
            explorer: 'https://uniscan.xyz/',
            callbackAddress: '⌛',
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