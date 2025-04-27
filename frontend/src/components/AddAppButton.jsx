// components/AddAppButton.jsx
export default function AddAppButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="ml-auto mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
            Submit New App
        </button>
    );
}
