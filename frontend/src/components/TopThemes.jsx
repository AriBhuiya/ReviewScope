import {fetchThemes} from "../lib/api.js";
import {useEffect, useState} from "react";


export default function TopThemes({app_id}) {
    
    const [data, setData] = useState([]);
    const [maxCount, setMaxCount] = useState(1);
    useEffect(() => {
        if (app_id) {
            fetchThemes(app_id)
                .then(res => {
                    if (res && res["themes"]) {
                        setData(res["themes"]);
                    } else {
                        setData([]);
                    }
                })
                .catch(error => {
                    console.error("Error fetching top themes:", error)
                    setData([]);
                });
        }
    }, [app_id]);
    
    useEffect(() => {
        const max_count = Math.max(...data.map(t => t.count));
        setMaxCount(max_count);
    },[data, data.length, maxCount]);
    
    return (
        <div className="bg-white p-4 rounded w-full">
            <h3 className="text-3xl md:text-3xl font-bold mb-7 text-stone-700">Top Themes</h3>
            <div className="flex flex-wrap gap-2">
                {data.map(theme => {
                    const scale = 1 + (theme.count / maxCount) * 1.5; // scale 1-2.5
                    return (
                        <span
                            key={theme.label}
                            className="text-stone-700 bg-stone-200 rounded px-2 py-1"
                            style={{fontSize: `${scale}rem`}}
                        >
              {theme.label}
            </span>
                    );
                })}
            </div>
        </div>
    );
}
