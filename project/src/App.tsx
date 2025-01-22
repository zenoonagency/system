import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AIAgent } from './pages/AIAgent';
import { Clients } from './pages/Clients';
import { Contacts } from './pages/Contacts';
import { Financial } from './pages/Financial';
import { Contracts } from './pages/Contracts';
import { Messaging } from './pages/Messaging';
import { Team } from './pages/Team';
import { Conversations } from './pages/Conversations';
import { Calendar } from './pages/Calendar';
import { DataTables } from './pages/DataTables';
import { Settings } from './pages/Settings';
import { AuthLayout } from './components/AuthLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { useThemeStore } from './store/themeStore';
import { Plans } from './pages/Plans';

export function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<AuthLayout />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/ai-agent" element={<AIAgent />} />
            <Route path="/dashboard/clients" element={<Clients />} />
            <Route path="/dashboard/contacts" element={<Contacts />} />
            <Route path="/dashboard/financial" element={<Financial />} />
            <Route path="/dashboard/contracts" element={<Contracts />} />
            <Route path="/dashboard/messaging" element={<Messaging />} />
            <Route path="/dashboard/team" element={<Team />} />
            <Route path="/dashboard/conversations" element={<Conversations />} />
            <Route path="/dashboard/calendar" element={<Calendar />} />
            <Route path="/dashboard/data-tables" element={<DataTables />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/plans" element={<Plans />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}