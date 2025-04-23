import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {fetchRatingsDistribution} from "../lib/api.js";
import {useEffect, useState} from "react";


export default function RatingDistribution({app_id}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (app_id) {
            fetchRatingsDistribution(app_id)
                .then(res => {
                    if (res && res["ratings_distribution"]) {
                        const formattedData = Object.entries(res["ratings_distribution"]).map(
                            ([rating, count]) => ({ rating, count })
                        );
                        setData(formattedData);
                    } else {
                        setData([]);
                    }
                })
                .catch(error => {
                    console.error("Error fetching rating distribution", error)
                    setData([]);
                });
        }
    }, [app_id]);
    return (
        <div className="bg-white p-4 rounded shadow w-full">
            <h2 className="text-lg font-semibold mb-2">Rating Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
