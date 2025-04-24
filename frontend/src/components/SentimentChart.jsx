import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {useEffect, useState} from "react";
import {fetchSentimentsOverTime} from "../lib/api.js";

export default function SentimentChart({app_id}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (app_id) {
            fetchSentimentsOverTime(app_id)
                .then(res => {
                    if (res && Array.isArray(res["time_series"])) {
                        setData(res["time_series"]);
                    } else {
                        setData([]);
                    }
                })
                .catch(error => console.error("Error fetching sentiment data:", error));
        }
    }, [app_id]);

    return (
        <div className="w-full bg-white rounded shadow p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">Sentiment Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 1]} tickFormatter={(val) => val.toFixed(1)} />
                    <Tooltip formatter={(value) => value.toFixed(2)} />
                    <Line
                        type="monotone"
                        dataKey="avg_sentiment"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
