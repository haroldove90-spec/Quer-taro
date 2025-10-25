
import React from 'react';
import { APP_NAME, NAV_ITEMS, ICONS } from '../../constants';
import { Page, UserRole, User } from '../../types';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  isSidebarOpen: boolean;
  installPrompt: any;
  onInstallClick: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isSidebarOpen, installPrompt, onInstallClick, currentUser, onLogout }) => {
  const visibleNavItems = NAV_ITEMS.filter(item => 
    !item.adminOnly || (item.adminOnly && currentUser?.role === UserRole.Admin)
  );

  return (
    <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 bg-secondary`}>
      <div className="h-full px-3 py-4 overflow-y-auto flex flex-col">
        <div className="flex items-center pl-2.5 mb-5">
            <span className="text-2xl font-bold text-white tracking-wider">{APP_NAME}</span>
        </div>
        <ul className="space-y-2 font-medium flex-grow">
          {visibleNavItems.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(item.id);
                }}
                className={`flex items-center p-2 rounded-lg group transition-colors duration-200 ${
                  activePage === item.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
            {installPrompt && (
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onInstallClick();
                    }}
                    className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white group"
                >
                    {ICONS.install}
                    <span className="ml-3 font-medium">Instalar App</span>
                </a>
            )}
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onLogout();
                }}
                className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white group"
            >
                {ICONS.logout}
                <span className="ml-3 font-medium">Cerrar Sesión</span>
            </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
