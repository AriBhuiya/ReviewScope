import React, { useRef } from 'react';
import WordCloud from 'react-d3-cloud';

const data = [
    { text: 'offline', value: 100 },
    { text: 'login', value: 80 },
    { text: 'ads', value: 60 },
    { text: 'pause', value: 50 },
    { text: 'update', value: 40 },
];

const fontSizeMapper = word => Math.log2(word.value+1) * 5;

export default function TopKeywords() {
    const containerRef = useRef(null);
    return (
        <div ref={containerRef} className="bg-white p-4 rounded shadow w-full h-64">
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
