import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [navParams, setNavParams] = useState({});
  const [featureState, setFeatureState] = useState('');

  // Helper function to easily navigate with parameters
  const navigate = (page, params = {}) => {
    setActivePage(page);
    setNavParams(params);
  };

  const value = {
    activePage, setActivePage,
    navParams, setNavParams,
    featureState, setFeatureState,
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
