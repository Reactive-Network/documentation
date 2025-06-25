import React from 'react';

const TransportComparisonTable = () => {
    const categories = ['Pros', 'Cons'];

    const hyperlane = {
        Pros: [
            '✅ Decentralized and highly secure',
            '🌐 Broad chain and dApp compatibility',
            '💸 Entire flow can be funded in REACT',
        ],
        Cons: [
            '⚠️ Relayer-dependent, operational and liveness risks',
            '🐢 Slower due to multi-step message relay and network latency',
            '🔒 Requires `handle()` interface on the destination contract',
            '💰 Higher cost due to relayer fee overhead',
        ],
    };

    const reactive = {
        Pros: [
            '🚀 Direct execution without relayers → faster and cheaper',
            '🔁 Deterministic finality with minimal latency',
            '⚙️ Supports arbitrary function calls — `no handle()` constraint',
            '💸 Cost-efficient, fees only cover raw gas on both ends',
        ],
        Cons: [
            '🧱 Smaller but growing ecosystem',
            '⚠️ Higher trust assumptions due to controlled execution environment',
            '💰 Gas must be paid in REACT on Reactive Network and the native token on destination for full execution',
        ],
    };

    return (
        <div className="tableContainer">
            <table className="table">
                <thead>
                <tr>
                    <th>Category</th>
                    <th>Hyperlane Transport</th>
                    <th>Reactive Transport</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((category) =>
                    Array.from({ length: Math.max(hyperlane[category].length, reactive[category].length) }).map((_, idx) => (
                        <tr key={`${category}-${idx}`}>
                            {idx === 0 ? (
                                <td
                                    rowSpan={Math.max(hyperlane[category].length, reactive[category].length)}
                                    style={{
                                        fontWeight: 'bold',
                                        verticalAlign: 'top',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    {category}
                                </td>
                            ) : null}
                            <td>{hyperlane[category][idx] || ''}</td>
                            <td>{reactive[category][idx] || ''}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default TransportComparisonTable;
