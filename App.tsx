

import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import PropertiesPage from './components/pages/Properties';
import ResidentsPage from './components/pages/Residents';
import Communication from './components/pages/Communication';
import FinancePage from './components/pages/Finance';
import SecurityPage from './components/pages/Security';
import MaintenancePage from './components/pages/Maintenance';
import SettingsPage from './components/pages/Settings';
import ServicesPage from './components/pages/Services';
import LoginPage from './components/pages/Login';
import { Page, User, UserRole } from './types';
import { users } from './data/mockData';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleLogin = (role: UserRole) => {
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      // Default page depends on role
      setActivePage(role === UserRole.Guard ? 'security' : 'dashboard');
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
  }

  const handleInstallClick = () => {
    if (!installPrompt) {
      return;
    }
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
    });
  };

  const renderPage = () => {
    if (!currentUser) return null;
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
        return <FinancePage currentUser={currentUser}/>;
      case 'security':
        return <SecurityPage currentUser={currentUser} />;
      case 'maintenance':
        return <MaintenancePage currentUser={currentUser}/>;
      case 'services':
        return <ServicesPage currentUser={currentUser} />;
      case 'settings':
        return <SettingsPage currentUser={currentUser} />;
      default:
        return <Dashboard />;
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        activePage={activePage} 
        setActivePage={(page) => {
            setActivePage(page);
            setSidebarOpen(false); // Close sidebar on navigation on mobile
        }}
        isSidebarOpen={isSidebarOpen} 
        installPrompt={installPrompt}
        onInstallClick={() => {
          handleInstallClick();
          setSidebarOpen(false);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 sm:ml-64`}>
        {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-30 sm:hidden"></div>}
        <Header activePage={activePage} toggleSidebar={toggleSidebar} currentUser={currentUser}/>
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      <AIAssistant />
    </div>
  );
};

export default App;