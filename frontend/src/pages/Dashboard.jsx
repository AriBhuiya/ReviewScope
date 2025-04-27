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
    const [newApp, setNewApp] = useState(null);


    const handleAppSelect = (appId) => {
        setSelectedAppId(appId);
        console.log("App selected:", appId); // later: trigger API loads here
    };

    const isNewAppValid = (newApp)=>{
        setNewApp(newApp);
    }


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
                isNewAppValid={isNewAppValid}
            />
        </div>
    );
}