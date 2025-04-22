import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;
console.log("API Base URL:", API_BASE);

export async function fetchApps() {
    const res = await fetch(`${API_BASE}/apps`);
    const data = await res.json();
    console.log("Fetched apps:", data);  // <-- Add this
    return data;
}