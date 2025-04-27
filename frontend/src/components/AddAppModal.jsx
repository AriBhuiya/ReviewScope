import {useEffect, useState} from 'react';
import {addToQueue, validateApp} from "../lib/api.js";

export default function AddAppModal({ isOpen, onClose, isNewAppValid }) {
    const [appId, setAppId] = useState('');
    const [error, setError] = useState('');
    const [isUnknownApp, setIsUnknownApp] = useState(false);

    const handleSubmit = () => {
        validateApp(appId)
            .then((result) => {
                if (result["valid"]) {
                    isNewAppValid(appId);
                    setError('');
                    setIsUnknownApp(false);
                } else {
                    isNewAppValid(null);
                    if (result["error"] === "Unknown_App_ID"){
                        setIsUnknownApp(true);
                        setError('App ID is invalid. Please enter a valid package name (like com.spotify.music).');
                    }else{
                        setError(result["error"]);
                    }
                }
                return result["valid"];
            })
            .then((is_valid) => {
                if (is_valid) {
                    addToQueue(appId)
                        .then((res) => {
                        if (res["status"] === "exists" && res["current_status"] === "completed") {
                            setError('App reviews are already cached. Please select this app from the dashboard');
                        }
                        else if (res["status"] === "exists") {
                            setError(`App is already being processed. Current Status:${res["current_status"]}; current stage:${res["stage"]}`);
                        }
                        else if (res["status"] === "queued") {
                            onClose()
                            alert("App successfully queued for parsing! 🎉 Please check back in sometime");
                        }
                    })
                }
            })
            .catch((err) => {
                console.log(err);
                setError('Something went wrong validating the app. Try again later.');
            });
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
                {error && (
                    <>
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                        {
                            isUnknownApp && (
                                <p className="text-sm text-gray-600 mb-4">
                                    How to find it? Search for your app on <a href="https://play.google.com/"
                                                                              target="_blank"
                                                                              className="text-blue-600 underline">Google
                                    Play
                                    Store</a>, open the app page, and copy the text after <code>id=</code> in the URL.
                                    (Example: In
                                    https://play.google.com/store/apps/details?id=com.spotify.music&hl=en <b>copy</b>
                                    <code>com.spotify.music</code>)
                                </p>
                            )
                        }
                    </>
                )}
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">cancel</button>
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
