import React, { useEffect, useState } from 'react';
import WordCloud from 'react-d3-cloud';
import {fetchKeywords} from "../lib/api.js";

const fontSizeMapper = word => Math.log2(word.value+1) * 5;

export default function TopKeywords({app_id}) {
    const [data, setData] = useState([]);
    useEffect(() => {
        if (app_id) {
            fetchKeywords(app_id)
                .then(res => {
                    if (res && res["top_keywords"]) {
                        const formatted = res["top_keywords"].map(k => ({
                            text: k["keyword"],
                            value: k["count"]
                        }));
                        setData(formatted);
                    }
                })
                .catch(error => {
                    console.error("Error fetching top themes:", error)
                    setData([]);
                });
        }
    }, [app_id]);

    return (
        <div  className="bg-white p-4 rounded shadow w-full h-64">
            <h2 className="text-lg font-semibold mb-2">Top Keywords</h2>
                <WordCloud
                    data={data}
                    fontSize={fontSizeMapper}
                    rotate={0}
                    width={400}
                    height={150}
                    padding={2}
                />
        </div>
    );
}
