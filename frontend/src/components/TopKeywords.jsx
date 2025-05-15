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
                        formatted[0].value=2000000
                        formatted[1].value=50000
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
        <div  className="bg-white p-4 rounded w-full h-64">
            <h3 className="text-3xl md:text-3xl font-bold mb-7 text-stone-700">Top Keywords</h3>
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
