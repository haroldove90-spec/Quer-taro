
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants';
import { currentUser } from '../../data/mockData';
import { Page } from '../../types';

interface HeaderProps {
  activePage: Page;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, toggleSidebar }) => {
  const pageTitle = activePage.charAt(0).toUpperCase() + activePage.slice(1);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setInstallPrompt(null);
    });
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="sm:hidden text-gray-500 dark:text-gray-400 mr-4">
          {ICONS.menu}
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{pageTitle}</h1>
      </div>
      <div className="flex items-center space-x-4">
        {installPrompt && (
          <button 
              onClick={handleInstallClick}
              className="flex items-center space-x-2 bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              aria-label="Install App"
          >
              {ICONS.install}
              <span className="hidden sm:inline">Instalar</span>
          </button>
        )}
        <button className="relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          {ICONS.notification}
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center">
          <img className="h-10 w-10 rounded-full object-cover" src={currentUser.avatar} alt="User avatar" />
          <div className="ml-3 text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;