import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [logs, setLogs] = useState([]);  // State to store logs

    // Fetch logs from the backend when the component mounts
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/logs');
                setLogs(response.data);  // Set the logs in state
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div>
            <h1>DDoS Protection Logs</h1>
            <ul>
                {logs.map(log => (
                    <li key={log._id}>
                        {log.ipAddress} - {new Date(log.requestTime).toLocaleString()} - {log.requestPath}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
