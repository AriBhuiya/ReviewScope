import {useState} from 'react';
import AppSelector from '../components/AppSelector';
import SentimentChart from "../components/SentimentChart.jsx";
import RatingDistribution from "../components/RatingDistribution.jsx";
import TopThemes from "../components/TopThemes.jsx";
import TopKeywords from "../components/TopKeywords.jsx";
import ReviewTable from "../components/ReviewTable.jsx";
import AddAppButton from "../components/AddAppButton.jsx";
import AddAppModal from '../components/AddAppModal.jsx';


export default function Dashboard() {
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [jobStatus, setJobStatus] = useState(null);


    const handleAppSelect = (appId) => {
        setSelectedAppId(appId);
        console.log("App selected:", appId); // later: trigger API loads here
    };

    const handleAddJob = async (appId) => {
        // try {
        //     const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/queue/add`, {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ app_id: appId }),
        //     });
        //     const data = await res.json();
        //     setJobStatus(data);
        //     // Optional: auto-select newly submitted app
        //     if (data?.job_id) setSelectedAppId(appId);
        // } catch (err) {
        //     console.error("Job submission failed:", err);
        //     setJobStatus({ error: 'Submission failed' });
        // }
    };


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">App Review Dashboard</h1>
            <AddAppButton onClick={() => setShowModal(true)} />
            <AppSelector onSelectApp={handleAppSelect}/>

            <SentimentChart app_id={selectedAppId}/>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RatingDistribution app_id={selectedAppId}/>
                <TopThemes app_id={selectedAppId}/>
                <TopKeywords app_id={selectedAppId} />
            </div>
            <ReviewTable app_id={selectedAppId} />

            <AddAppModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleAddJob}
            />
        </div>
    );
}