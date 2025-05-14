import { useState } from 'react';
import AppSelector from '../components/AppSelector';
import SentimentChart from "../components/SentimentChart.jsx";
import RatingDistribution from "../components/RatingDistribution.jsx";
import TopThemes from "../components/TopThemes.jsx";
import TopKeywords from "../components/TopKeywords.jsx";
import ReviewTable from "../components/ReviewTable.jsx";
// import AddAppButton from "../components/AddAppButton.jsx"; // Removed AddAppButton import
import AddAppModal from '../components/AddAppModal.jsx';
import ProcessingStatus from '../components/ProcessingStatus.jsx';

export default function Dashboard() {
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newApp, setNewApp] = useState(null);

    const handleAppSelect = (appId) => {
        setSelectedAppId(appId);
    };

    const isNewAppValid = (newApp) => {
        setNewApp(newApp);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 rounded-xl shadow mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-2">App Review Dashboard</h1>
                        <p className="text-lg md:text-2xl opacity-90 mb-4">Track and analyze sentiment for all your apps.</p>
                        <div className="border-b border-blue-300 opacity-50 mb-4"></div> {/* Added the separator */}
                        {/* App Selector inside hero */}
                        <div className="rounded ">
                            <AppSelector onSelectApp={handleAppSelect} onAddAppClick={() => setShowAddModal(true)} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                        <button
                            onClick={() => setShowStatusModal(true)}
                            className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100"
                        >
                            View All App Status
                        </button>
                        {/* <AddAppButton onClick={() => setShowAddModal(true)} /> */} {/* Removed AddAppButton */}
                    </div>
                </div>
            </div>

            {/* Sentiment Chart */}
            <div className="bg-white p-4 rounded-xl shadow mb-6">
                <SentimentChart app_id={selectedAppId} />
            </div>

            {/* Rating + Themes + Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow">
                    <RatingDistribution app_id={selectedAppId} />
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <TopThemes app_id={selectedAppId} />
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <TopKeywords app_id={selectedAppId} />
                </div>
            </div>

            {/* Review Table */}
            <div className="bg-white p-4 rounded-xl shadow">
                <ReviewTable app_id={selectedAppId} />
            </div>

            {/* Add App Modal */}
            <AddAppModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                isNewAppValid={isNewAppValid}
            />

            {/* All Apps Status Modal */}
            {showStatusModal && (
                <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" style={{"scrollbar-width":"none"}}>
                        {/* Modal Hero */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-t-xl">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">App Processing Status</h2>
                                <button onClick={() => setShowStatusModal(false)} className="text-white opacity-75 hover:opacity-100 text-xl">&times;</button>
                            </div>
                        </div>
                        <div className="p-6">
                            <ProcessingStatus />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}