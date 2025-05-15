import { LineChart, Line,AreaChart,Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
        <div className="w-full bg-white rounded  p-4 mb-4">
            <h3 className="text-5xl md:text-5xl font-bold mb-7">Sentiment Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 1]} tickFormatter={(val) => val.toFixed(1)} />
                    <Tooltip formatter={(value) => value.toFixed(2)} />
                    <Area
                        type="monotone"
                        dataKey="avg_sentiment"
                        stroke="#1654ec"
                        fill="#1654ec"                        
                        strokeWidth={0}
                        dot={{ r: 0 }}
                        activeDot={{ r: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
