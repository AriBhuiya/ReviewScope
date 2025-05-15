import { format } from 'date-fns';
import { useEffect, useState } from "react";
import { fetchReviewsWithSentiments } from "../lib/api.js";

const sentimentColors = {
    Positive: 'bg-green-200 text-green-900',
    Neutral: 'bg-yellow-200 text-yellow-900',
    Negative: 'bg-red-200 text-red-900',
};

export default function ReviewTable({ app_id }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const limit = 10;
    const [offset, setOffset] = useState(0);
    const [sentimentFilter, setSentimentFilter] = useState("all");

    const handleNext = () => setOffset((prev) => prev + limit);
    const handlePrev = () => setOffset((prev) => Math.max(prev - limit, 0));
    const goToPage = (page) => setOffset((page - 1) * limit);

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
        <div className="bg-white rounded p-6 w-full overflow-x-auto">
            <h3 className="text-5xl md:text-5xl font-bold mb-2 text-stone-700">Recent Reviews</h3>

            <div className="mb-4 flex items-center">
                <label className="mr-2 text-sm font-medium text-stone-700">Filter by Sentiment:</label>
                <select
                    value={sentimentFilter}
                    onChange={(e) => {
                        setOffset(0);
                        setSentimentFilter(e.target.value);
                    }}
                    className="border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                >
                    <option value="all">All</option>
                    <option value="Positive">Positive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Negative">Negative</option>
                </select>
            </div>
            <table className="min-w-full text-sm text-left">
                <thead className="bg-stone-700 text-white font-semibold shadow">
                    <tr>
                        <th className="px-5 py-6">Rating</th>
                        <th className="px-5 py-3">Sentiment</th>
                        <th className="px-5 py-3">Sentiment Score</th>
                        <th className="px-5 py-3">Review</th>
                        <th className="px-5 py-3">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review, index) => (
                        <tr
                            key={review["review_id"]}
                            className={`last: ${index % 2 === 0 ? '' : 'bg-stone-200'}`}
                        >
                            <td className="px-5 py-6">{"⭐".repeat(review.rating)}</td>
                            <td className="px-5 py-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sentimentColors[review["sentiment"]]}`}>
                                    {review["sentiment"]}
                                </span>
                            </td>
                            <td className="px-5 py-2">
                                {review["sentiment_score"] ? (
                                    <span className="px-2 py-1 rounded bg-stone-100 text-stone-700 text-xs">{review["sentiment_score"].toFixed(2)}</span>
                                ) : (
                                    '-'
                                )}
                            </td>
                            <td className="px-5 py-2 max-w-sm">{review.text}</td>
                            <td className="px-5 py-2">{format(new Date(review.date), 'MMM d, yyyy')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {loading && <p className="text-sm text-stone-500 mt-2">Loading reviews...</p>}

            <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-stone-600">
                    Showing <span className="font-semibold">{offset + 1}</span>–<span className="font-semibold">{Math.min(offset + reviews.length, total)}</span> of <span className="font-semibold">{total}</span> reviews
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handlePrev}
                        disabled={offset === 0}
                        className="bg-stone-500 text-white py-2 px-4 rounded-md hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-1 disabled:bg-stone-300 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <div className="flex items-center">
                        <span className="text-sm text-stone-500 mr-2">Page</span>
                        <input
                            type="number"
                            min="1"
                            max={Math.ceil(total / limit)}
                            value={Math.floor(offset / limit) + 1}
                            onChange={(e) => {
                                const page = Math.max(1, Math.min(Number(e.target.value), Math.ceil(total / limit)));
                                goToPage(page);
                            }}
                            className="w-16 px-3 py-2 border rounded text-center focus:ring-2 focus:ring-stone-500 focus:border-stone-500 text-sm"
                        />
                        <span className="text-sm text-stone-500 ml-2">of {Math.ceil(total / limit)}</span>
                    </div>
                    <button
                        onClick={handleNext}
                        disabled={offset + limit >= total}
                        className="bg-stone-500 text-white py-2 px-4 rounded-md hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-1 disabled:bg-stone-300 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}