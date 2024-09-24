import React, { useState, useEffect } from 'react';

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
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId: CHAIN_ID,
                        rpcUrls: ["https://kopli-rpc.reactive.network/"],
                        chainName: "Reactive Kopli",
                        nativeCurrency: {
                            name: "REACT",
                            symbol: "REACT",
                            decimals: 18
                        },
                        blockExplorerUrls: ["https://kopli.reactscan.net/"]
                    }]
                });
            } catch (e) {
                console.error('Failed to add Ethereum chain', e);
            }
        }
    }
};

const KopliButton = () => {
    const [buttonColor, setButtonColor] = useState('var(--button-bg-color-light)');
    const [hoverColor, setHoverColor] = useState('var(--button-hover-color-light)');

    useEffect(() => {
        const updateColors = () => {
            const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setButtonColor(isDarkTheme ? 'var(--button-bg-color-dark)' : 'var(--button-bg-color-light)');
            setHoverColor(isDarkTheme ? 'var(--button-hover-color-dark)' : 'var(--button-hover-color-light)');
        };

        // Initial setting of colors
        updateColors();

        // Event listener for theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', updateColors);

        return () => {
            mediaQuery.removeEventListener('change', updateColors);
        };
    }, []);

    return (
        <button
            onClick={AddToWeb3Provider}
            style={{
                width: '200px',
                height: '50px',
                fontSize: '16px',
                lineHeight: '50px',
                textAlign: 'center',
                padding: '0',
                display: 'block',
                backgroundColor: buttonColor,
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = hoverColor; // Change to hover color
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = buttonColor; // Reset to original color
            }}
        >
            Connect to Kopli Testnet
        </button>
    );
};

export default KopliButton;
