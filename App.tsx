

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
import { Page, User, UserRole, Property, Owner, Transaction, Visitor, MaintenanceRequest, Package, MarketplaceItem } from './types';
import * as mockData from './data/mockData';
import AIAssistant from './components/AIAssistant';

// --- Notification Helper ---
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log("This browser does not support desktop notification");
    return;
  }
  if (Notification.permission !== 'denied') {
    await Notification.requestPermission();
  }
};

export const showNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
};


// --- Main App Component ---
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  // --- Centralized State Management ---
  const [appData, setAppData] = useState(() => {
    try {
      const savedData = localStorage.getItem('condoData');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error("Error reading from localStorage", error);
    }
    return {
        properties: mockData.properties,
        owners: mockData.owners,
        announcements: mockData.announcements,
        transactions: mockData.transactions,
        visitors: mockData.visitors,
        maintenanceRequests: mockData.maintenanceRequests,
        amenityBookings: mockData.amenityBookings,
        expenses: mockData.expenses,
        providers: mockData.providers,
        marketplaceItems: mockData.marketplaceItems,
        localBusinesses: mockData.localBusinesses,
        packages: mockData.packages,
    };
  });
  
  useEffect(() => {
    try {
      localStorage.setItem('condoData', JSON.stringify(appData));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [appData]);

  // --- Data Mutation Functions ---
  const createHandler = <T,>(dataType: keyof typeof appData, notificationTitle: string) => (newItem: T) => {
    setAppData(prevData => ({
      ...prevData,
      [dataType]: [...prevData[dataType], newItem]
    }));
    showNotification(notificationTitle, `Se ha registrado un nuevo elemento.`);
  };

  const addProperty = createHandler<Property>('properties', 'Nuevo Inmueble Registrado');
  const addOwner = createHandler<Owner>('owners', 'Nuevo Residente Registrado');
  const addTransaction = createHandler<Transaction>('transactions', 'Nueva Transacción Registrada');
  const addVisitor = createHandler<Visitor>('visitors', 'Nueva Visita Registrada');
  const addMaintenanceRequest = createHandler<MaintenanceRequest>('maintenanceRequests', 'Nueva Solicitud de Mantenimiento');
  const addPackage = createHandler<Package>('packages', 'Nuevo Paquete Registrado');
  const addMarketplaceItem = createHandler<MarketplaceItem>('marketplaceItems', 'Nuevo Artículo Publicado');


  useEffect(() => {
    // PWA install prompt handler
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Request notification permission on load
    requestNotificationPermission();

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleLogin = (role: UserRole) => {
    const user = mockData.users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      setActivePage(role === UserRole.Guard ? 'security' : 'dashboard');
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
  }

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      setInstallPrompt(null);
    });
  };

  const renderPage = () => {
    if (!currentUser) return null;
    switch (activePage) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} data={appData} />;
      case 'properties':
        return <PropertiesPage properties={appData.properties} owners={appData.owners} addProperty={addProperty} />;
      case 'residents':
        return <ResidentsPage owners={appData.owners} properties={appData.properties} addOwner={addOwner}/>;
      case 'communication':
        return <Communication />;
      case 'finance':
        return <FinancePage currentUser={currentUser} transactions={appData.transactions} properties={appData.properties} owners={appData.owners} expenses={appData.expenses} addTransaction={addTransaction} />;
      case 'security':
        return <SecurityPage currentUser={currentUser} visitors={appData.visitors} properties={appData.properties} owners={appData.owners} addVisitor={addVisitor} />;
      case 'maintenance':
        return <MaintenancePage currentUser={currentUser} maintenanceRequests={appData.maintenanceRequests} amenityBookings={appData.amenityBookings} providers={appData.providers} properties={appData.properties} owners={appData.owners} addMaintenanceRequest={addMaintenanceRequest} />;
      case 'services':
        return <ServicesPage currentUser={currentUser} marketplaceItems={appData.marketplaceItems} localBusinesses={appData.localBusinesses} packages={appData.packages} owners={appData.owners} properties={appData.properties} addPackage={addPackage} addMarketplaceItem={addMarketplaceItem} />;
      case 'settings':
        return <SettingsPage currentUser={currentUser} />;
      default:
        return <Dashboard currentUser={currentUser} data={appData} />;
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-primary-950 text-gray-800 dark:text-gray-200">
      <Sidebar 
        activePage={activePage} 
        setActivePage={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
        }}
        isSidebarOpen={isSidebarOpen} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 sm:ml-64`}>
        {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-30 sm:hidden"></div>}
        <Header 
          activePage={activePage} 
          toggleSidebar={toggleSidebar} 
          currentUser={currentUser}
          installPrompt={installPrompt}
          onInstallClick={handleInstallClick}
        />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      <AIAssistant />
    </div>
  );
};

export default App;