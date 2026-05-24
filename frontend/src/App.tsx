import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { MetricsPage } from './pages/MetricsPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { LogsPage } from './pages/LogsPage';
import { DeploymentsPage } from './pages/DeploymentsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="metrics" element={<MetricsPage />} />
        <Route path="incidents" element={<IncidentsPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="deployments" element={<DeploymentsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
