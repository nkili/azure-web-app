import React from 'react';
import { AppProvider, useAppContext } from './contexts';
import { AppMenu, DangerousWritingApp, TaskPrioritizerApp } from './components';
import { availableApps } from './config';

const AppContent: React.FC = () => {
  const { selectedApp, selectApp } = useAppContext();

  const renderSelectedApp = () => {
    switch (selectedApp) {
      case 'dangerous-writing':
        return <DangerousWritingApp />;
      case 'task-prioritizer':
        return <TaskPrioritizerApp />;
      default:
        return (
          <AppMenu 
            apps={availableApps} 
            onSelectApp={selectApp} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderSelectedApp()}
    </div>
  );
};

export const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};
