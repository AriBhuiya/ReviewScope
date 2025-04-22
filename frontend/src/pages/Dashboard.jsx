import { useState } from 'react';
import AppSelector from '../components/AppSelector';

export default function Dashboard() {
    const [selectedAppId, setSelectedAppId] = useState(null);

    const handleAppSelect = (appId) => {
        setSelectedAppId(appId);
        console.log("App selected:", appId); // later: trigger API loads here
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">App Review Dashboard</h1>
            <AppSelector onSelectApp={handleAppSelect}/>
                {/* Later: Conditional rendering of charts, metadata, etc. */}
                {selectedAppId && (
                    <p className="mt-4 text-gray-700">Selected App ID: {selectedAppId}</p>
                )}
            </div>
                );
                }