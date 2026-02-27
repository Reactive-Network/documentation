import React from 'react';

const CronTable = () => {
    return (
        <div className="tableContainer">
            <table className="table">
                <thead>
                <tr>
                    <th>Event</th>
                    <th>Interval</th>
                    <th>Approximate Time</th>
                    <th>Topic 0</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><code>Cron1</code></td>
                    <td>Every block</td>
                    <td>~7 seconds</td>
                    <td><code>0xf02d6ea5c22a71cffe930a4523fcb4f129be6c804db50e4202fb4e0b07ccb514</code></td>
                </tr>
                <tr>
                    <td><code>Cron10</code></td>
                    <td>Every 10 blocks</td>
                    <td>~1 minute</td>
                    <td><code>0x04463f7c1651e6b9774d7f85c85bb94654e3c46ca79b0c16fb16d4183307b687</code></td>
                </tr>
                <tr>
                    <td><code>Cron100</code></td>
                    <td>Every 100 blocks</td>
                    <td>~12 minutes</td>
                    <td><code>0xb49937fb8970e19fd46d48f7e3fb00d659deac0347f79cd7cb542f0fc1503c70</code></td>
                </tr>
                <tr>
                    <td><code>Cron1000</code></td>
                    <td>Every 1000 blocks</td>
                    <td>~2 hours</td>
                    <td><code>0xe20b31294d84c3661ddc8f423abb9c70310d0cf172aa2714ead78029b325e3f4</code></td>
                </tr>
                <tr>
                    <td><code>Cron10000</code></td>
                    <td>Every 10,000 blocks</td>
                    <td>~28 hours</td>
                    <td><code>0xd214e1d84db704ed42d37f538ea9bf71e44ba28bc1cc088b2f5deca654677a56</code></td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CronTable;
