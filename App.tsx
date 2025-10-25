import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import Communication from './components/pages/Communication';
import { Page } from './types';
import AIAssistant from './components/AIAssistant';

// Placeholder components for other pages
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Funcionalidad en construcción.</p>
    </div>
);
const PropertiesPage = () => <PlaceholderPage title="Gestión de Inmuebles" />;
const ResidentsPage = () => <PlaceholderPage title="Gestión de Residentes" />;
const FinancePage = () => <PlaceholderPage title="Finanzas y Contabilidad" />;
const SecurityPage = () => <PlaceholderPage title="Seguridad y Control de Acceso" />;
const MaintenancePage = () => <PlaceholderPage title="Mantenimiento y Servicios" />;
const SettingsPage = () => <PlaceholderPage title="Ajustes y Permisos" />;

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'properties':
        return <PropertiesPage />;
      case 'residents':
        return <ResidentsPage />;
      case 'communication':
        return <Communication />;
      case 'finance':
        return <FinancePage />;
      case 'security':
        return <SecurityPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        activePage={activePage} 
        setActivePage={(page) => {
            setActivePage(page);
            setSidebarOpen(false); // Close sidebar on navigation on mobile
        }}
        isSidebarOpen={isSidebarOpen} 
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 sm:ml-64`}>
        {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-30 sm:hidden"></div>}
        <Header activePage={activePage} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      <AIAssistant />
    </div>
  );
};

export default App;