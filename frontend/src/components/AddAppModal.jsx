import { useState } from 'react';

export default function AddAppModal({ isOpen, onClose, onSubmit }) {
    const [appId, setAppId] = useState('');

    const handleSubmit = () => {
        if (!appId.trim()) return;
        onSubmit(appId.trim());
        setAppId('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Submit New App</h2>
                <p>Enter app's symbolic name only - ex: com.spotify.music</p>
                <input
                    type="text"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    placeholder="Enter app ID (e.g., com.spotify.music)"
                    className="w-full border px-3 py-2 rounded mb-4"
                />
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
