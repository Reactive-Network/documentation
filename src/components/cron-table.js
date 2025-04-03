import React from 'react';

const CronTable = () => {
    return (
        <div className="tableContainer">
            <table className="table">
                <thead>
                <tr>
                    <th>Event</th>
                    <th>Interval</th>
                    <th>Approx. Time</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><code>Cron1</code></td>
                    <td>Every block</td>
                    <td>~7 seconds</td>
                    <td>Base signal, always emitted</td>
                </tr>
                <tr>
                    <td><code>Cron10</code></td>
                    <td>Every 10 blocks</td>
                    <td>~1 minute</td>
                    <td>For short-term cycles or retries</td>
                </tr>
                <tr>
                    <td><code>Cron100</code></td>
                    <td>Every 100 blocks</td>
                    <td>~12 minutes</td>
                    <td>For medium-frequency tasks</td>
                </tr>
                <tr>
                    <td><code>Cron1000</code></td>
                    <td>Every 1000 blocks</td>
                    <td>~2 hours</td>
                    <td>For more costly operations</td>
                </tr>
                <tr>
                    <td><code>Cron10000</code></td>
                    <td>Every 10,000 blocks</td>
                    <td>~28 hours</td>
                    <td>For heavy or rare routines</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CronTable;
