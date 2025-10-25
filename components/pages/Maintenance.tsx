

import React, { useState } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ICONS } from '../../constants';
import { MaintenanceRequest, User, UserRole, Property, AmenityBooking, Provider, Owner } from '../../types';
import { Modal } from '../ui/Modal';

const getStatusBadge = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'Completed': return <Badge color="green">Completado</Badge>;
      case 'In Progress': return <Badge color="primary">En Progreso</Badge>;
      case 'Pending': return <Badge color="yellow">Pendiente</Badge>;
      default: return <Badge color="gray">Desconocido</Badge>;
    }
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-500'}>
                {ICONS.star}
            </span>
        ))}
    </div>
);

interface MaintenancePageProps {
  currentUser: User;
  maintenanceRequests: MaintenanceRequest[];
  amenityBookings: AmenityBooking[];
  providers: Provider[];
  properties: Property[];
  owners: Owner[];
  addMaintenanceRequest: (req: MaintenanceRequest) => void;
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({ currentUser, maintenanceRequests: allMaintenanceRequests, amenityBookings: allAmenityBookings, providers, properties, owners, addMaintenanceRequest }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({ area: '', description: '', propertyId: '' });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({...prev, [name]: value}));
  };
  
  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const currentOwner = owners.find(o => o.email === currentUser.email);
    const ownerProperty = properties.find(p => p.ownerId === currentOwner?.id);
    
    // If admin is creating, use the selected property. If resident, use their own.
    let propId = newRequest.propertyId;
    if(currentUser.role === UserRole.Resident && ownerProperty) {
      propId = ownerProperty.id;
    }
    
    const requestToAdd: MaintenanceRequest = {
        id: `req-${Date.now()}`,
        area: newRequest.area,
        description: newRequest.description,
        propertyId: propId === 'common' ? 'N/A' : propId,
        status: 'Pending',
        submittedDate: new Date().toISOString().split('T')[0],
    };
    addMaintenanceRequest(requestToAdd);
    setIsAddModalOpen(false);
    setNewRequest({ area: '', description: '', propertyId: '' });
  };
  
  const getPropertyLot = (propertyId: string) => {
    if (propertyId === 'N/A') return 'Área Común';
    const prop = properties.find(p => p.id === propertyId);
    return prop ? `Lote ${prop.lotNumber}` : 'N/A';
  };
  
  let maintenanceRequests = allMaintenanceRequests;
  let amenityBookings = allAmenityBookings;

  if (currentUser.role === UserRole.Resident) {
      const currentOwner = owners.find(o => o.email === currentUser.email);
      const ownerProperty = properties.find(p => p.ownerId === currentOwner?.id);
      if (ownerProperty) {
          maintenanceRequests = allMaintenanceRequests.filter(r => r.propertyId === ownerProperty.id || r.propertyId === 'N/A');
          amenityBookings = allAmenityBookings.filter(b => b.propertyId === ownerProperty.id);
      } else {
          maintenanceRequests = allMaintenanceRequests.filter(r => r.propertyId === 'N/A');
          amenityBookings = [];
      }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <CardTitle>Solicitudes de Mantenimiento</CardTitle>
                    <Button leftIcon={ICONS.plus} onClick={() => setIsAddModalOpen(true)}>Nuevo Reporte</Button>
                </div>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table headers={['Área', 'Propiedad', 'Fecha', 'Descripción', 'Estatus']}>
                            {maintenanceRequests.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()).map(req => (
                                <TableRow key={req.id}>
                                    <TableCell className="whitespace-nowrap"><div className="font-medium text-gray-900 dark:text-white">{req.area}</div></TableCell>
                                    <TableCell className="whitespace-nowrap">{getPropertyLot(req.propertyId)}</TableCell>
                                    <TableCell className="whitespace-nowrap">{req.submittedDate}</TableCell>
                                    <TableCell className="whitespace-nowrap"><p>{req.description}</p></TableCell>
                                    <TableCell className="whitespace-nowrap">{getStatusBadge(req.status)}</TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Nuevo Reporte de Mantenimiento"
                footer={<><Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button><Button onClick={handleAddRequest}>Enviar Reporte</Button></>}
            >
                <form onSubmit={handleAddRequest} className="space-y-4">
                    {currentUser.role === UserRole.Admin && (
                        <div>
                            <label className="block text-sm font-medium">Propiedad</label>
                            <select name="propertyId" value={newRequest.propertyId} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required>
                                <option value="">Seleccione...</option>
                                <option value="common">Área Común</option>
                                {properties.map(p => <option key={p.id} value={p.id}>{`Lote ${p.lotNumber}`}</option>)}
                            </select>
                        </div>
                    )}
                     <div>
                        <label className="block text-sm font-medium">Área Específica</label>
                        <input type="text" name="area" value={newRequest.area} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" placeholder="Ej: Jardín frontal, Baño principal" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Descripción del Problema</label>
                        <textarea name="description" value={newRequest.description} onChange={handleInputChange} rows={4} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required></textarea>
                    </div>
                </form>
            </Modal>

            <Card>
                <CardTitle>Reservación de Amenidades</CardTitle>
                <CardContent>
                     <ul className="space-y-4">
                        {amenityBookings.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(booking => (
                            <li key={booking.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 dark:bg-primary-800/50 rounded-lg">
                            <div className="mb-2 sm:mb-0">
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{booking.amenity}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Reservado por: {getPropertyLot(booking.propertyId)}</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400 flex items-center">
                                    {ICONS.calendar}
                                    <span className="ml-2">{new Date(booking.date).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{booking.timeSlot}</p>
                            </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1">
            <Card>
                <CardTitle>Directorio de Proveedores</CardTitle>
                <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Servicios recomendados y calificados por la comunidad.</p>
                    <ul className="space-y-4">
                        {providers.map(p => (
                            <li key={p.id} className="p-3 border dark:border-primary-700 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{p.name}</p>
                                        <p className="text-sm text-primary-600 dark:text-primary-400">{p.service}</p>
                                    </div>
                                    <StarRating rating={p.rating} />
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">{p.phone}</p>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;