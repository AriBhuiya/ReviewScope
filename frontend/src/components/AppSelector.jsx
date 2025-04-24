import React, { useState, useEffect } from 'react';
import { fetchApps } from "../lib/api.js";

export default function AppSelector({ onSelectApp }) {
    const [apps, setApps] = useState([]);
    const [selectedApp, setSelectedApp] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApps()
            .then((fetchedApps) => {
                setApps(fetchedApps);
                if (fetchedApps.length > 0 && selectedApp === '') {
                    const firstAppId = fetchedApps[0].app_id;
                    setSelectedApp(firstAppId);
                    onSelectApp(firstAppId);
                }

            })
            .catch((err) => {
                console.error("Error fetching apps:", err);
                setError('Error fetching Cached Apps');
            });
    }, [onSelectApp, selectedApp]);

    const handleChange = (e) => {
        const appId = e.target.value;
        setSelectedApp(appId);
        onSelectApp(appId);
    };



    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-2">Select an App</h2>
            <div className="flex items-center gap-4 w-full">
                <select
                    value={selectedApp}
                    onChange={handleChange}
                    className="flex-grow p-2 border rounded"
                    disabled={!!error}
                >
                    {error ? (
                        <option>{error}</option>
                    ) : apps.length === 0 ? (
                        <option disabled>No cached apps available</option>
                    ) : (
                        apps.map((app) => (
                            <option key={app.app_id} value={app.app_id}>
                                {app.app_id}
                            </option>
                        ))
                    )}
                </select>
            </div>
        </div>
    );
}
