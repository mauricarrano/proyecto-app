import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { useAppContext } from './hooks/useAppContext';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/layout/MainLayout';

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

const AppContent: React.FC = () => {
    const { user } = useAppContext();

    if (!user) {
        return <LoginPage />;
    }

    return <MainLayout />;
};


export default App;
