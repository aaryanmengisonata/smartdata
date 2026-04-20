import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [navParams, setNavParams] = useState({});
  const [featureState, setFeatureState] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fabric Audit Shared State
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('bronze_silver');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Editable Grid State
  const [gridColumns, setGridColumns] = useState([]);
  const [gridData, setGridData] = useState([]);

  // Initialize Grid Data based on dataset
  React.useEffect(() => {
    const cols = selectedDataset === 'bronze_silver' 
      ? ['Order_ID', 'Customer_ID', 'Product', 'Quantity', 'Unit_Price', 'Region', 'Status']
      : selectedDataset === 'silver_gold'
      ? ['Customer_ID', 'Total_Spend', 'Order_Count', 'LTV_Segment', 'Last_Active', 'Risk_Score']
      : ['Column_A', 'Column_B', 'Column_C', 'Column_D', 'Column_E'];
    
    setGridColumns(cols);

    const initialData = Array.from({ length: 20 }, (_, i) => {
      if (selectedDataset === 'bronze_silver') return [
        `ORD_${10041 + i}`, `CUST_${8500 + i}`, 
        i % 3 === 0 ? 'MacBook Pro 16"' : i % 2 === 0 ? 'AirPods Pro' : 'Magic Keyboard',
        (i % 4) + 1, i % 3 === 0 ? '$2,499.00' : i % 2 === 0 ? '$249.00' : '$199.00',
        i % 2 === 0 ? 'North America' : 'EMEA', 'Processed'
      ];
      if (selectedDataset === 'silver_gold') return [
        `CUST_${8500 + i}`, `$${(1250.50 + i * 415.2).toFixed(2)}`,
        (i % 5) + 2, i % 2 === 0 ? 'High Value' : 'Medium Value',
        `2024-03-0${(i % 9) + 1}`, (0.01 * (i % 4)).toFixed(2)
      ];
      return [`Data_A_${i}`, `Data_B_${i}`, `Data_C_${i}`, `Data_D_${i}`, `Data_E_${i}`];
    });
    setGridData(initialData);
  }, [selectedDataset]);

  const updateGridCell = (rowIndex, colIndex, value) => {
    setGridData(prev => {
      const newData = [...prev];
      newData[rowIndex] = [...newData[rowIndex]];
      newData[rowIndex][colIndex] = value;
      return newData;
    });
  };

  const addGridRow = () => {
    setGridData(prev => [...prev, new Array(gridColumns.length).fill('')]);
  };

  const deleteGridRow = (rowIndex) => {
    setGridData(prev => prev.filter((_, i) => i !== rowIndex));
  };

  // --- LOGIC: LIVE LOG STREAM ---
  React.useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        const timestamp = new Date().toLocaleTimeString();
        const newLogs = [
          `[${timestamp}] SCANNING partition_id=delta_${Math.floor(Math.random() * 1000)}`,
          `[${timestamp}] COMPARING record_offsets ${Math.floor(Math.random() * 5000)}..${Math.floor(Math.random() * 10000)}`,
          `[${timestamp}] STATUS: Processing batch through Neural Bridge...`
        ];
        setLogs(prev => [...prev.slice(-20), ...newLogs]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleExecution = () => {
    const newRunningState = !isRunning;
    setIsRunning(newRunningState);
    if (newRunningState) {
      setIsComplete(false);
      setLogs([
        "[SYSTEM] Initializing Fabric Audit Engine...",
        `[INFO] Target Dataset: ${selectedDataset.toUpperCase()}`,
        uploadedFile ? `[INFO] Source: ${uploadedFile.name}` : "[INFO] Source: Default Lakehouse Catalog",
        "[PROCESS] Loading reconciliation logic...",
        "[INFO] Validating schema consistency...",
        "[PROCESS] Execution started. Scanning for delta logs..."
      ]);

      // Simulate completion after 8 seconds
      setTimeout(() => {
        setIsRunning(false);
        setIsComplete(true);
        setReportData({
          totalRows: 12450,
          matches: 12432,
          mismatches: 18,
          accuracy: 99.85,
          mismatchDetails: [
            { id: 'REC_8842', field: 'unit_price', source: '24.50', target: '24.48', risk: 'High' },
            { id: 'REC_9011', field: 'tax_amount', source: '2.10', target: 'NULL', risk: 'Critical' },
            { id: 'REC_9055', field: 'currency_code', source: 'USD', target: 'EUR', risk: 'Medium' }
          ]
        });
      }, 8000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setSelectedDataset(file.name); // Automatically select the uploaded file
      setLogs(prev => [`[INFO] File recognized: ${file.name}`, ...prev]);
    }
  };

  // Helper function to easily navigate with parameters
  const navigate = (page, params = {}) => {
    setActivePage(page);
    setNavParams(params);
  };

  const value = {
    activePage, setActivePage,
    navParams, setNavParams,
    featureState, setFeatureState,
    isSettingsOpen, setIsSettingsOpen,
    isRunning, setIsRunning,
    logs, setLogs,
    showLogs, setShowLogs,
    selectedDataset, setSelectedDataset,
    uploadedFile, setUploadedFile,
    isComplete, setIsComplete,
    reportData, setReportData,
    gridColumns, gridData,
    updateGridCell, addGridRow, deleteGridRow,
    toggleExecution, handleFileUpload,
    navigate
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
