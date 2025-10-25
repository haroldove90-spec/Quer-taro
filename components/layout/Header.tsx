import React from 'react';
import { ICONS } from '../../constants';
import { currentUser } from '../../data/mockData';
import { Page } from '../../types';

interface HeaderProps {
  activePage: Page;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, toggleSidebar }) => {
  const pageTitle = activePage.charAt(0).toUpperCase() + activePage.slice(1);
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="sm:hidden text-gray-500 dark:text-gray-400 mr-4">
          {ICONS.menu}
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{pageTitle}</h1>
      </div>
      <div className="flex items-center space-x-4">
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