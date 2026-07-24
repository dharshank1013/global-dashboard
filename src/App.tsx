import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { WorldMap } from './components/map/WorldMap';
import { Dashboard } from './components/dashboard/Dashboard';
import { Statistics } from './components/statistics/Statistics';
import { SettingsModal } from './components/ui/SettingsModal';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function AppContent() {
  useEffect(() => {
    // Enforce dark mode permanently
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/map" replace />} />
          <Route path="/map" element={<WorldMap />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </Layout>
      <SettingsModal />
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
