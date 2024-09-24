import React, { useState, useEffect } from 'react';

export const AddToWeb3Provider = async () => {
    const chainId = '0x512578';

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId }],
        });
    } catch (e) {
        if (e.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId: "0x512578",
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
            }
        }
    }
};

const KopliButton = () => {
    const [buttonColor, setButtonColor] = useState('#2756FC'); // Default to light theme color
    const [hoverColor, setHoverColor] = useState('#1A4C92'); // Default hover color for light theme

    useEffect(() => {
        const handleThemeChange = (e) => {
            if (e.matches) {
                console.log("Dark theme detected");
                setButtonColor('#CBB5FF'); // Dark theme button color
                setHoverColor('#A287FF'); // Dark theme hover color
            } else {
                console.log("Light theme detected");
                setButtonColor('#2756FC'); // Light theme button color
                setHoverColor('#1A4C92'); // Light theme hover color
            }
        };

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setButtonColor(mediaQuery.matches ? '#CBB5FF' : '#2756FC'); // Initial color based on theme
        setHoverColor(mediaQuery.matches ? '#A287FF' : '#1A4C92'); // Initial hover color based on theme

        mediaQuery.addEventListener('change', handleThemeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleThemeChange);
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
