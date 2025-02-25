import '../css/custom.css';

const CHAIN_ID = '0x511098';

const checkWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (chainId === CHAIN_ID) {
            alert('Already connected to the Kopli Testnet.');
        }
        return true;
    } else {
        if (window.confirm('MetaMask is not installed. Would you like to visit MetaMask website to install it?')) {
            window.open('https://metamask.io/', '_blank');
        }
        return false;
    }
};


export const AddToWeb3Provider = async () => {
    if (!checkWallet()) return;

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
                        rpcUrls: ['https://kopli-rpc.rnk.dev/'],
                        chainName: 'Reactive Kopli',
                        nativeCurrency: {
                            name: 'REACT',
                            symbol: 'REACT',
                            decimals: 18,
                        },
                        blockExplorerUrls: ['https://kopli.reactscan.net/'],
                    }],
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
                color: 'var(--kopli-button-text)',
                backgroundColor: 'var(--kopli-button-bg)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
            }}
            onMouseOver={(e) => {
                e.target.style.backgroundColor = 'var(--kopli-button-hover-bg)';
                e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
                e.target.style.backgroundColor = 'var(--kopli-button-bg)';
                e.target.style.transform = 'scale(1)';
            }}
        >
            Connect to Kopli Testnet
        </button>
    );
}

export default KopliButton;