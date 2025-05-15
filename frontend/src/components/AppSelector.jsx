import React, { useState, useEffect } from 'react';
import { fetchApps } from "../lib/api.js";

export default function AppSelector({ onSelectApp, onAddAppClick }) {
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
            <h2 className="text-xl font-semibold mb-3">Select an App</h2>
            <div className="flex items-center gap-4 w-full mb-3">
                <select
                    value={selectedApp}
                    onChange={handleChange}
                    className="flex-grow p-2 border rounded text-stone-700 bg-stone-200"
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
            <button
                onClick={onAddAppClick}
                className="bg-stone-200 hover:bg-stone-500 hover:text-white text-stone-700 py-2 px-4 rounded shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 text-sm"
            >
                + Add New App
            </button>
        </div>
    );
}