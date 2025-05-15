import React, {useState, useEffect, useCallback} from 'react';
import {fetchAppStatus, fetchQueueOverview} from "../lib/api.js";

const stageFlow = [
    {stage: 'scraper', label: 'Scraper', icon: '🛠️'},
    {stage: 'nlp', label: 'NLP', icon: '🧠'},
    {stage: 'done', label: 'Done', icon: '✅'},
];

const statusColorMap = {
    queued: '#f7d794',
    processing: '#f3a683',
    completed: '#78e08f',
    error: '#e55039',
};

const ProcessingStatus = ({app_id}) => {
    const [apps, setApps] = useState([]);
    const [done_jobs_today, setDone_jobs_today] = useState(0);

    const handleFetchQueueOverview = () => {
        fetchQueueOverview()
            .then(data => {
                setDone_jobs_today(data["done_jobs_today"]);
                return data["active_jobs"];
            })
            .then(data => setApps(data));
    };

    const handleFetchAppStatus = (app_id) => {
        fetchAppStatus(app_id).then(data => setApps([data]));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const refreshData = (app_id) => {
        if (app_id === null || app_id === undefined) {
            handleFetchQueueOverview();
        } else {
            handleFetchAppStatus(app_id);
        }
    };

    const handleManualRefresh = useCallback(() => {
        refreshData(app_id);
    }, [app_id, refreshData]);


    useEffect(() => {
        const intervalId = setInterval(() => {
            handleManualRefresh();
        }, 2000);

        return () => clearInterval(intervalId);
    }, [handleManualRefresh]);




    useEffect(() => {
        if (app_id === null || app_id === undefined) {
            fetchQueueOverview()
                .then(data => {
                    setDone_jobs_today(data["done_jobs_today"]);
                    return data["active_jobs"];
                })
                .then(activeJobs => setApps(activeJobs));
        } else {
            fetchAppStatus(app_id).then(data => setApps([data]));
        }
    }, [app_id]);



    return (
        <div style={styles.container}>
            <div style={styles.titleContainer}>
                <div style={styles.title}>{app_id ? <span>{app_id}</span> : <span>Overall</span>}</div>
                <button className="bg-white text-stone-600 px-4 py-2 rounded shadow hover:bg-stone-200"
                        onClick={handleManualRefresh}>Refresh Processing Status
                </button>
            </div>
            {
                apps.length > 0 ?
                    apps.map((app, idx) => {
                        const currentStageIndex = stageFlow.findIndex(s => s.stage === app.stage);
                        return (
                            <div key={idx} style={styles.card}>
                                <div style={styles.appName}>{app.app_id}</div>
                                <div style={styles.timelineContainer}>
                                    {stageFlow.map((step, i) => {
                                        const isActive = step.stage === app.stage;
                                        const isCompleted = i < currentStageIndex;
                                        const isError = app.status === 'error' && step.stage === app.stage;
                                        const isUpcoming = i > currentStageIndex;
                                        const bgColor = isActive
                                            ? statusColorMap[app.status] || '#ccc'
                                            : isCompleted
                                                ? statusColorMap['completed']
                                                : '#ccc';

                                        return (
                                            <React.Fragment key={i}>
                                                <div style={styles.timelineItem}>
                                                    <StatusIndicator
                                                        isActive={isActive}
                                                        isCompleted={isCompleted}
                                                        isError={isError}
                                                        isUpcoming={isUpcoming}
                                                        icon={step.icon}
                                                        bgColor={bgColor}
                                                        status={app.status}
                                                        isProcessing={app.status === 'processing' && step.stage === app.stage}
                                                    />
                                                    <div style={styles.label}>
                                                        {isError
                                                            ? 'Failed'
                                                            : isActive
                                                                ? `${app.status.toUpperCase()} (${step.label})`
                                                                : step.label}
                                                    </div>
                                                </div>
                                                {i < stageFlow.length - 1 && (
                                                    <div
                                                        style={{
                                                            ...styles.line,
                                                            backgroundColor: i < currentStageIndex
                                                                ? statusColorMap['completed']
                                                                : '#ccc',
                                                        }}
                                                    />
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                                {app.stage === 'done' && app.status === 'completed' && (
                                        <div style={{ marginTop: '1rem', padding: '12px', backgroundColor: '#e0f8e9', borderRadius: '8px', color: '#2e7d32' }}>
                                            ✅ This app has been successfully processed. Please select it from the dropdown in the main dashboard.
                                        </div>
                                    )
                                }
                                <div style={{ marginTop: '0.75rem', fontSize: '14px', color: '#555' }}>
                                    <strong>Last updated:</strong> {new Date(app.updated_at).toLocaleString()}
                                </div>
                            </div>
                        );
                    }) : (
                        <p className="bg-stone-100 border border-stone-300 text-stone-700 p-4 rounded-lg text-sm leading-relaxed shadow-sm">
                            No apps are currently being processed. Submit a new app to process, or check the dropdown for an already processed one.<br />
                            <span className="mt-2 inline-block font-semibold">Jobs done today: {done_jobs_today}</span>
                        </p>

                    )}
        </div>
    );
};

const StatusIndicator = ({
                             bgColor,
                             isActive,
                             icon,
                             isCompleted,
                             isError,
                             isUpcoming,
                             isProcessing,
                         }) => {
    return (
        <div
            style={{
                ...styles.circle,
                backgroundColor: bgColor,
                color: isActive ? '#212121' : '#9E9E9E',
                border: isCompleted ? '2px solid #4CAF50' : '2px solid #E0E0E0',
                boxShadow: isActive
                    ? '0 8px 20px rgba(0, 0, 0, 0.2)'
                    : 'none',
                opacity: isUpcoming ? 0.5 : 1,
                animation: isProcessing ? 'rotateBorder 2s infinite linear' : 'none',
            }}
        >
            <div
                style={{
                    filter: isUpcoming ? 'grayscale(100%)' : 'none',
                }}
            >
                {isError ? '❌' : icon}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '850px',
        margin: '30px auto',
        padding: '1rem',
        fontFamily: 'Poppins, sans-serif',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    title: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#44403c',
    },
    refreshButton: {
        padding: '8px 16px',
        fontSize: '14px',
        backgroundColor: 'rgb(23 86 238)',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    card: {
        padding: '24px',
        border: '1px solid #E0E0E0',
        borderRadius: '12px',
        marginBottom: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 3px 6px rgba(0,0,0,0.05)',
    },
    appName: {
        marginBottom: '14px',
        fontSize: '18px',
        fontWeight: '500',
        color: '#333',
    },
    timelineContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
    },
    timelineItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        minWidth: '60px',
        zIndex: 1,
    },
    circle: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        border: '3px solid #fff',
        transition: 'all 0.3s ease',
        boxShadow: '0 3px 8px rgba(0,0,0,0.05)',
    },
    label: {
        fontSize: '13px',
        textAlign: 'center',
        marginTop: '6px',
        color: '#333',
    },
    line: {
        height: '4px',
        flex: 1,
        backgroundColor: '#ccc',
        margin: '0 4px',
        borderRadius: '2px',
        zIndex: 0,
    },
};

// CSS Animation for rotating border (only for processing steps)
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes rotateBorder {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default ProcessingStatus;
