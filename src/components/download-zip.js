import React from 'react';

const DownloadButton = () => {
    const handleDownload = () => {
        window.location.href = '/zip/basic-demo-contracts.zip';
    };

    return (
        <button
            id="download-button"
            onClick={handleDownload}
            style={{
                width: '200px',
                height: '50px',
                fontSize: '16px',
                lineHeight: '50px',
                textAlign: 'center',
                padding: '0',
                display: 'block',
                color: 'var(--mainnet-button-text)',
                backgroundColor: 'var(--mainnet-button-bg)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
            }}
            onMouseOver={(e) => {
                e.target.style.backgroundColor = 'var(--mainnet-button-hover-bg)';
                e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
                e.target.style.backgroundColor = 'var(--mainnet-button-bg)';
                e.target.style.transform = 'scale(1)';
            }}
        >
            Download Demo Contracts
        </button>
    );
};

export default DownloadButton;
