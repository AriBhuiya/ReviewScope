import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchApps() {
        const res = await axios.get(`${API_BASE}/apps`);
        return res.data;
}
export async function validateApp(app_id) {
        const res = await axios.get(`${API_BASE}/apps/validate-google-app-id?app_id=${app_id}`);
        return res.data;
}
export async function fetchSentimentsOverTime(app_id) {
        const res = await axios.get(`${API_BASE}/results/${app_id}/sentiment-over-time`);
        return res.data;
}
export async function fetchRatingsDistribution(app_id) {
        const res = await axios.get(`${API_BASE}/results/${app_id}/ratings-distribution`);
        return res.data;
}

export async function fetchThemes(app_id) {
        const res = await axios.get(`${API_BASE}/results/${app_id}/themes?limit=5`);
        return res.data;
}

export async function fetchKeywords(app_id) {
        const res = await axios.get(`${API_BASE}/results/${app_id}/keywords?limit=5`);
        return res.data;
}

export async function fetchReviewsWithSentiments(app_id, sentiment = 'all', limit = 10, offset = 0) {
        const params = new URLSearchParams();
        if (sentiment !== 'all') params.append('sentiment', sentiment);
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());
        const url = `${API_BASE}/results/${app_id}/reviews?${params.toString()}`;
        const res = await axios.get(url);
        return res.data;
}

export async function addToQueue(app_id){
        const res = await axios.post(`${API_BASE}/queue/add`, {
                app_id: app_id,
        })
        return res.data;
}