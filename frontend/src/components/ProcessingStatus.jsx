import React, { useState, useEffect } from 'react';

const stageFlow = [
  { stage: 'scraper', label: 'Scraper', icon: '🛠️' },
  { stage: 'nlp', label: 'NLP', icon: '🧠' },
  { stage: 'done', label: 'Done', icon: '✅' },
];

const statusColorMap = {
  queued: '#f7d794',
  processing: '#f3a683',
  completed: '#78e08f',
  error: '#e55039',
};

// Mock API function (replace with real API later)
const fetchAppData = () => {
  return [
    { name: 'com.facebook.katana', status: 'processing', stage: 'scraper' },
    { name: 'com.zomato.product', status: 'queued', stage: 'nlp' },
    { name: 'com.zepto.item', status: 'processing', stage: 'nlp' },
    { name: 'com.uber.cab', status: 'completed', stage: 'done' },
    { name: 'com.snapchat.messenger', status: 'error', stage: 'nlp' },
  ];
};

const ProcessingStatus = () => {
  const [apps, setApps] = useState([]);

  const refreshData = () => {
    const data = fetchAppData();
    setApps(data);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <div style={styles.title}>App Processing Status</div>
        <button className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100" onClick={refreshData}>Refresh Processing Status</button>
      </div>
      {apps.map((app, idx) => {
        const currentStageIndex = stageFlow.findIndex(s => s.stage === app.stage);
        return (
          <div key={idx} style={styles.card}>
            <div style={styles.appName}>{app.name}</div>
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
          </div>
        );
      })}
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
    color: '#212121',
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
