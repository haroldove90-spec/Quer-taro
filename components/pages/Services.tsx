
import React from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ICONS } from '../../constants';
import { marketplaceItems, localBusinesses, packages as allPackages, owners, properties } from '../../data/mockData';
import { User, UserRole, Package } from '../../types';

interface ServicesPageProps {
  currentUser: User;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ currentUser }) => {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  const getPropertyLot = (propertyId: string) => {
    const prop = properties.find(p => p.id === propertyId);
    return prop ? `Lote ${prop.lotNumber}` : 'N/A';
  };
  
  const getPackageStatusBadge = (status: Package['status']) => {
    switch (status) {
      case 'Recibido en caseta': return <Badge color="blue">En Caseta</Badge>;
      case 'Entregado al residente': return <Badge color="green">Entregado</Badge>;
      default: return <Badge color="gray">Desconocido</Badge>;
    }
  };

  let packages = allPackages;
  if (currentUser.role === UserRole.Resident) {
    const currentOwner = owners.find(o => o.email === currentUser.email);
    const ownerProperty = properties.find(p => p.ownerId === currentOwner?.id);
    packages = ownerProperty ? allPackages.filter(p => p.propertyId === ownerProperty.id) : [];
  }

  const canManagePackages = currentUser.role === UserRole.Admin || currentUser.role === UserRole.Guard;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Package Management */}
      {(canManagePackages || (currentUser.role === UserRole.Resident && packages.length > 0)) && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>Gestión de Paquetería</CardTitle>
            {canManagePackages && <Button leftIcon={ICONS.plus}>Registrar Paquete</Button>}
          </div>
          <CardContent>
            <Table headers={['Propiedad', 'Paquetería', 'Fecha de Recibo', 'Estatus', 'Acciones']}>
              {packages.map(pkg => (
                <TableRow key={pkg.id}>
                  <TableCell>{getPropertyLot(pkg.propertyId)}</TableCell>
                  <TableCell>{pkg.carrier}</TableCell>
                  <TableCell>{pkg.receivedDate}</TableCell>
                  <TableCell>{getPackageStatusBadge(pkg.status)}</TableCell>
                  <TableCell>
                    {canManagePackages && pkg.status === 'Recibido en caseta' && (
                      <Button size="sm" variant="primary">Entregar</Button>
                    )}
                     {currentUser.role === UserRole.Resident && pkg.status === 'Recibido en caseta' && (
                      <p className='text-xs text-gray-500'>Recoger en caseta</p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Second-Hand Market */}
      {currentUser.role !== UserRole.Guard && (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <CardTitle>Mercado de Segunda Mano</CardTitle>
                <Button leftIcon={ICONS.plus}>Publicar Artículo</Button>
            </div>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {marketplaceItems.map(item => (
                        <div key={item.id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover"/>
                            <div className="p-4">
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white">{item.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 h-10 overflow-hidden">{item.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xl font-bold text-primary-600">{formatCurrency(item.price)}</span>
                                    <Button size="sm" variant="secondary">Contactar</Button>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Vendido por: {owners.find(o => o.id === item.sellerId)?.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}

      {/* Local Info & Delivery */}
       {currentUser.role !== UserRole.Guard && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardTitle>Información Local</CardTitle>
                <CardContent>
                    <ul className="space-y-3">
                        {localBusinesses.map(biz => (
                            <li key={biz.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{biz.name} <Badge color="blue">{biz.category}</Badge></p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{biz.address} - {biz.phone}</p>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardTitle>Servicios a Domicilio</CardTitle>
                <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Pide a domicilio de tus servicios favoritos.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <a href="#" className="flex items-center justify-center p-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors">Rappi</a>
                        <a href="#" className="flex items-center justify-center p-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">Uber Eats</a>
                        <a href="#" className="flex items-center justify-center p-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors">Didi Food</a>
                        <a href="#" className="flex items-center justify-center p-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">Superama</a>
                    </div>
                </CardContent>
            </Card>
        </div>
       )}
    </div>
  );
};

export default ServicesPage;
