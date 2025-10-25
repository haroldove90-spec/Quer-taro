
import React from 'react';
import { UserRole } from '../../types';
import { APP_NAME, ICONS } from '../../constants';
import { Button } from '../ui/Button';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="text-center">
            <div className="inline-block p-4 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                 <svg className="h-12 w-12 text-primary-600" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="currentColor"/><path d="M79.5 52.83V79H20.5V52.83L50 29.5l29.5 23.33zM73 72.5V55.42L50 37.25 27 55.42V72.5h14.67v-12h16.66v12H73z" fill="#fff"/></svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{APP_NAME}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Panel de Administración</p>
        </div>
        <div className="space-y-4">
            <h2 className="font-semibold text-center text-gray-700 dark:text-gray-300">Selecciona un rol para ingresar</h2>
            <Button className="w-full" onClick={() => onLogin(UserRole.Admin)} leftIcon={ICONS.settings}>
                Ingresar como Administrador
            </Button>
            <Button className="w-full" variant="secondary" onClick={() => onLogin(UserRole.Resident)} leftIcon={ICONS.residents}>
                Ingresar como Residente
            </Button>
            <Button className="w-full" variant="secondary" onClick={() => onLogin(UserRole.Guard)} leftIcon={ICONS.security}>
                Ingresar como Vigilante
            </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
