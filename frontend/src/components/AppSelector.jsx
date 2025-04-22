import React, { useState, useEffect } from 'react';
import axios from "axios";

export default function AppSelector({ onSelectApp }) {
    const [apps, setApps] = useState([]);  // 🟡 Mocked for now, empty list
    const [selectedApp, setSelectedApp] = useState('');

    const handleAnalyze = () => {
        if (selectedApp) {
            onSelectApp(selectedApp);
        }
    };

    useEffect(() => {
    }, []);

    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-2">Select an App</h2>
            <div className="flex items-center gap-4 w-full">
                <select
                    value={selectedApp}
                    onChange={(e) => setSelectedApp(e.target.value)}
                    className="flex-grow p-2 border rounded"
                >
                    <option value="">Select Apps</option>
                    {apps.length === 0 ? (
                        <option disabled>No cached apps available</option>
                    ) : (
                        apps.map((app) => (
                            <option key={app.app_id} value={app.app_id}>
                                {app.name}
                            </option>
                        ))
                    )}
                </select>
                <button
                    onClick={handleAnalyze}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Analyze
                </button>
            </div>
        </div>
    );
}