import {format} from 'date-fns';
import {useEffect, useState} from "react";
import {fetchReviewsWithSentiments} from "../lib/api.js";

const sentimentColors = {
    Positive: 'bg-green-100 text-green-800',
    Neutral: 'bg-yellow-100 text-yellow-800',
    Negative: 'bg-red-100 text-red-800',
};


export default function ReviewTable({app_id}) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const limit = 10;
    const [offset, setOffset] = useState(0);
    const [sentimentFilter, setSentimentFilter] = useState("all");

    const handleNext = () => setOffset((prev) => prev + limit);
    const handlePrev = () => setOffset((prev) => Math.max(prev - limit, 0));

    useEffect(() => {
        if (!app_id) return;
        setLoading(true);
        fetchReviewsWithSentiments(app_id, sentimentFilter, limit, offset)
            .then((data) => {
                setReviews(data["reviews"] || []);
                setTotal(data["total"]);
            })
            .catch((err) => {
                console.error('Error fetching reviews:', err);
                setReviews([]);
            })
            .finally(() => setLoading(false));
    }, [app_id, offset, sentimentFilter]);



    return (
        <div className="bg-white rounded shadow p-4 w-full overflow-x-auto">
            <h2 className="text-lg font-semibold mb-2">Recent Reviews</h2>
            <div className="mb-4">
                <label className="mr-2 text-sm font-medium text-gray-700">Filter by Sentiment:</label>
                <select
                    value={sentimentFilter}
                    onChange={(e) => {
                        setOffset(0); // Reset to page 1
                        setSentimentFilter(e.target.value);
                    }}
                    className="border px-2 py-1 rounded text-sm"
                >
                    <option value="all">All</option>
                    <option value="Positive">Positive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Negative">Negative</option>
                </select>
            </div>
            <table className="min-w-full text-sm text-left">
                <thead className="border-b font-medium">
                <tr>
                    <th className="px-4 py-2">Rating</th>
                    <th className="px-4 py-2">Sentiment</th>
                    <th className="px-4 py-2">Sentiment Score</th>
                    <th className="px-4 py-2">Review</th>
                    <th className="px-4 py-2">Date</th>
                </tr>
                </thead>
                <tbody>
                {reviews.map((review) => (
                    <tr key={review["review_id"]} className="border-b last:border-0">
                        <td className="px-4 py-2">{"⭐".repeat(review.rating)}</td>
                        <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${sentimentColors[review["sentiment"]]}`}>
                      {review["sentiment"]}
                    </span>
                        </td>
                        <td className="px-4 py-2">
                            {review["sentiment_score"] ? (
                                <span
                                    className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">{review["sentiment_score"]}</span>
                            ) : (
                                '-'
                            )}
                        </td>
                        <td className="px-4 py-2 max-w-sm">{review.text}</td>
                        <td className="px-4 py-2">{format(new Date(review.date), 'MMM d, yyyy')}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {loading && <p className="text-sm text-gray-500">Loading reviews...</p>}

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
                <span className="text-sm text-gray-600">
                Showing {offset + 1}–{Math.min(offset + reviews.length, total)} of {total} reviews
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrev}
                        disabled={offset === 0}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <span className="text-sm">Page</span>
                    <input
                        type="number"
                        min="1"
                        max={Math.ceil(total / limit)}
                        value={Math.floor(offset / limit) + 1}
                        onChange={(e) => {
                            const page = Math.max(1, Math.min(Number(e.target.value), Math.ceil(total / limit)));
                            setOffset((page - 1) * limit);
                        }}
                        className="w-16 px-2 py-1 border rounded text-center"
                    />

                    <span className="text-sm">of {Math.ceil(total / limit)}</span>

                    <button
                        onClick={handleNext}
                        disabled={offset + limit >= total}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
