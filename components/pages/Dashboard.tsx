import React from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { properties, owners, maintenanceRequests, announcements, amenityBookings, transactions } from '../../data/mockData';
import { Badge } from '../ui/Badge';

// FIX: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement }> = ({ title, value, icon }) => (
  <Card>
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-300 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Inmuebles" value={properties.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
        <StatCard title="Total Residentes" value={owners.length} icon={<svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 1.803" /></svg>} />
        <StatCard title="Solicitudes Abiertas" value={maintenanceRequests.filter(r => r.status !== 'Completed').length} icon={<svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        <StatCard title="Pagos Pendientes" value={transactions.filter(t => t.status !== 'Paid').length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Anuncios Recientes</CardTitle>
          <CardContent>
            <ul className="space-y-4">
              {announcements.slice(0, 3).map(ann => (
                <li key={ann.id} className="p-3 bg-gray-50 dark:bg-primary-800 rounded-lg">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{ann.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{ann.content}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{ann.date} - {ann.author}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardTitle>Próximas Reservaciones</CardTitle>
          <CardContent>
            <ul className="space-y-4">
              {amenityBookings.slice(0,3).map(booking => (
                <li key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-primary-800 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{booking.amenity}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Reserva: Lote {properties.find(p => p.id === booking.propertyId)?.lotNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{booking.date}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{booking.timeSlot}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;