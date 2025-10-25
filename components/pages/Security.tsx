
import React from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ICONS } from '../../constants';
import { visitors, properties, owners } from '../../data/mockData';
import { Visitor, User, UserRole } from '../../types';

const getStatusBadge = (status: Visitor['status']) => {
    switch (status) {
      case 'Inside': return <Badge color="green">Adentro</Badge>;
      case 'Expected': return <Badge color="blue">Esperado</Badge>;
      case 'Departed': return <Badge color="gray">Salió</Badge>;
      default: return <Badge color="gray">Desconocido</Badge>;
    }
};

const getPropertyInfo = (propertyId: string) => {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return 'Área Común';
    const owner = owners.find(o => o.id === prop.ownerId);
    return `Lote ${prop.lotNumber} (${owner?.name || 'N/A'})`;
};

interface SecurityPageProps {
    currentUser: User;
}

const SecurityPage: React.FC<SecurityPageProps> = ({ currentUser }) => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <CardTitle>Historial de Visitantes</CardTitle>
                        <Button leftIcon={ICONS.plus}>Registrar Visita</Button>
                    </div>
                    <CardContent>
                        <Table headers={['Visitante', 'Propiedad', 'Entrada', 'Salida', 'Estatus']}>
                            {visitors.map(v => (
                                <TableRow key={v.id}>
                                    <TableCell>
                                        <div className="font-medium text-gray-900 dark:text-white">{v.name}</div>
                                        <div className="text-gray-500 dark:text-gray-400 text-xs">ID: {v.idNumber}</div>
                                    </TableCell>
                                    <TableCell>{getPropertyInfo(v.propertyId)}</TableCell>
                                    <TableCell>{v.entryDate}</TableCell>
                                    <TableCell>{v.exitDate || 'N/A'}</TableCell>
                                    <TableCell>{getStatusBadge(v.status)}</TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                {currentUser.role === UserRole.Resident && (
                    <Card>
                        <CardTitle>Mi Acceso Digital</CardTitle>
                        <CardContent className="text-center">
                            <p className="mb-4 text-gray-600 dark:text-gray-400">Muestra este código QR en la entrada para un acceso rápido.</p>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UserID-Resident-12345-BosquesEncinos" alt="QR Code" className="mx-auto rounded-lg" />
                        </CardContent>
                    </Card>
                )}
                 <Card>
                    <CardTitle>Botón de Pánico</CardTitle>
                    <CardContent>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">Usa este botón solo en caso de una emergencia real para alertar a seguridad.</p>
                        <Button variant="danger" className="w-full py-4 text-lg">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            EMERGENCIA
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>

        <Card>
            <CardTitle>Cámaras de Seguridad (En vivo)</CardTitle>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
                        <img src="https://placehold.co/600x400/000000/FFFFFF/png?text=Entrada+Principal" alt="Cámara 1" className="object-cover w-full h-full rounded-lg" />
                        <p className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Cámara 1: Entrada Principal</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
                        <img src="https://placehold.co/600x400/000000/FFFFFF/png?text=Alberca" alt="Cámara 2" className="object-cover w-full h-full rounded-lg" />
                        <p className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Cámara 2: Alberca</p>
                    </div>
                     <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
                        <img src="https://placehold.co/600x400/000000/FFFFFF/png?text=Cancha+de+Padel" alt="Cámara 3" className="object-cover w-full h-full rounded-lg" />
                        <p className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Cámara 3: Cancha de Padel</p>
                    </div>
                     <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
                        <img src="https://placehold.co/600x400/000000/FFFFFF/png?text=Salida" alt="Cámara 4" className="object-cover w-full h-full rounded-lg" />
                        <p className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Cámara 4: Salida</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export default SecurityPage;