import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextValue {
  selectedApp: string | null;
  selectApp: (appId: string) => void;
  goBackToMenu: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const selectApp = (appId: string) => {
    setSelectedApp(appId);
  };

  const goBackToMenu = () => {
    setSelectedApp(null);
  };

  const value: AppContextValue = {
    selectedApp,
    selectApp,
    goBackToMenu,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
