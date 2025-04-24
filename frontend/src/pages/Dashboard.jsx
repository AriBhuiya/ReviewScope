import {useState, useEffect} from 'react';
import AppSelector from '../components/AppSelector';
import SentimentChart from "../components/SentimentChart.jsx";
import RatingDistribution from "../components/RatingDistribution.jsx";
import TopThemes from "../components/TopThemes.jsx";
import TopKeywords from "../components/TopKeywords.jsx";
import ReviewTable from "../components/ReviewTable.jsx";

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
            <SentimentChart app_id={selectedAppId}/>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RatingDistribution app_id={selectedAppId}/>
                <TopThemes app_id={selectedAppId}/>
                <TopKeywords app_id={selectedAppId} />
            </div>
            <ReviewTable app_id={selectedAppId} />
        </div>
    );
}