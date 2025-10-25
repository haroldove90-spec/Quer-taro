
import React from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { User, UserRole, Property, Owner, Transaction, MaintenanceRequest, AmenityBooking, Announcement, Package } from '../../types';

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

interface DashboardData {
    properties: Property[];
    owners: Owner[];
    maintenanceRequests: MaintenanceRequest[];
    announcements: Announcement[];
    amenityBookings: AmenityBooking[];
    transactions: Transaction[];
    packages: Package[];
}
interface DashboardProps {
    currentUser: User;
    data: DashboardData;
}


const Dashboard: React.FC<DashboardProps> = ({ currentUser, data }) => {
  const { properties, owners, maintenanceRequests, announcements, amenityBookings, transactions, packages } = data;

  // Admin View
  const AdminDashboard = () => (
    <div className="grid grid-cols-2 gap-6">
        <StatCard title="Total Inmuebles" value={properties.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
        <StatCard title="Total Residentes" value={owners.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 1.803" /></svg>} />
        <StatCard title="Solicitudes Abiertas" value={maintenanceRequests.filter(r => r.status !== 'Completed').length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        <StatCard title="Pagos Pendientes" value={transactions.filter(t => t.status !== 'Paid').length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
    </div>
  );
  
  // Resident View
  const ResidentDashboard = () => {
    const currentOwner = owners.find(o => o.email === currentUser.email);
    const ownerProperty = properties.find(p => p.ownerId === currentOwner?.id);
    
    const myPendingPayments = ownerProperty ? transactions.filter(t => t.propertyId === ownerProperty.id && t.status !== 'Paid').length : 0;
    const myOpenRequests = ownerProperty ? maintenanceRequests.filter(r => (r.propertyId === ownerProperty.id || r.propertyId === 'N/A') && r.status !== 'Completed').length : 0;
    const myPackages = ownerProperty ? packages.filter(p => p.propertyId === ownerProperty.id && p.status === 'Recibido en caseta').length : 0;
    const myNextBooking = ownerProperty ? amenityBookings.find(b => b.propertyId === ownerProperty.id && new Date(b.date) >= new Date()) : null;


    return (
        <div className="grid grid-cols-2 gap-6">
            <StatCard title="Mis Pagos Pendientes" value={myPendingPayments} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
            <StatCard title="Mis Solicitudes Abiertas" value={myOpenRequests} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
            <StatCard title="Paquetes por Recoger" value={myPackages} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>} />
            <Card>
                <div className="flex items-center h-full">
                    <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-300 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Próxima Reservación</p>
                        {myNextBooking ? (
                            <>
                                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{myNextBooking.amenity}</p>
                                <p className="text-xs text-gray-400">{myNextBooking.date}</p>
                            </>
                        ) : (
                             <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">Ninguna</p>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {currentUser.role === UserRole.Admin ? <AdminDashboard /> : <ResidentDashboard />}
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