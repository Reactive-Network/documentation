import '../css/custom.css';
import React from 'react';

const CHAIN_ID = '0x512578';

export const AddToWeb3Provider = async () => {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CHAIN_ID }],
        });
    } catch (e) {
        if (e.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: CHAIN_ID,
                        rpcUrls: ['https://kopli-rpc.reactive.network/'],
                        chainName: 'Reactive Kopli',
                        nativeCurrency: {
                            name: 'REACT',
                            symbol: 'REACT',
                            decimals: 18
                        },
                        blockExplorerUrls: ['https://kopli.reactscan.net/']
                    }]
                });
            } catch (e) {
                console.error('Failed to add Ethereum chain', e);
            }
        }
    }
};

const KopliButton = () => {
    return (
        <button
            id="kopli-button"
            onClick={AddToWeb3Provider}
            style={{
                width: '200px',
                height: '50px',
                fontSize: '16px',
                lineHeight: '50px',
                textAlign: 'center',
                padding: '0',
                display: 'block',
                color: 'var(--kopli-button-text)', /* Text color based on theme */
                backgroundColor: 'var(--kopli-button-bg)', /* Background color based on theme */
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
            }}
            onMouseOver={(e) => {
                e.target.style.backgroundColor = 'var(--kopli-button-hover-bg)'; /* Hover background color based on theme */
                e.target.style.transform = 'scale(1.05)'; /* Add a hover scale effect */
            }}
            onMouseOut={(e) => {
                e.target.style.backgroundColor = 'var(--kopli-button-bg)'; /* Revert background color */
                e.target.style.transform = 'scale(1)'; /* Revert to original size */
            }}
        >
            Connect to Kopli Testnet
        </button>
    );
}

export default KopliButton;
