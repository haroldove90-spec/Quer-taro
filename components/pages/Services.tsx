

import React, { useState } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ICONS } from '../../constants';
import { User, UserRole, Package, MarketplaceItem, LocalBusiness, Owner, Property } from '../../types';
import { Modal } from '../ui/Modal';

interface ServicesPageProps {
  currentUser: User;
  marketplaceItems: MarketplaceItem[];
  localBusinesses: LocalBusiness[];
  packages: Package[];
  owners: Owner[];
  properties: Property[];
  addPackage: (pkg: Package) => void;
  addMarketplaceItem: (item: MarketplaceItem) => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ currentUser, marketplaceItems, localBusinesses, packages: allPackages, owners, properties, addPackage, addMarketplaceItem }) => {
  const [isPackageModalOpen, setPackageModalOpen] = useState(false);
  const [isMarketModalOpen, setMarketModalOpen] = useState(false);
  const [newPackage, setNewPackage] = useState({ propertyId: '', carrier: '' });
  const [newItem, setNewItem] = useState({ title: '', description: '', price: '' });
  
  const handlePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pkgToAdd: Package = {
        id: `pkg-${Date.now()}`,
        propertyId: newPackage.propertyId,
        carrier: newPackage.carrier,
        receivedDate: new Date().toLocaleString('es-MX'),
        status: 'Recibido en caseta',
        pickedUpDate: null,
    };
    addPackage(pkgToAdd);
    setPackageModalOpen(false);
    setNewPackage({ propertyId: '', carrier: '' });
  };

  const handleMarketItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentOwner = owners.find(o => o.email === currentUser.email);
    if (!currentOwner) return; // Should not happen

    const itemToAdd: MarketplaceItem = {
        id: `mkt-${Date.now()}`,
        title: newItem.title,
        description: newItem.description,
        price: parseFloat(newItem.price),
        imageUrl: `https://placehold.co/600x400/34d399/FFFFFF/png?text=${newItem.title.replace(' ', '+')}`,
        sellerId: currentOwner.id,
        datePosted: new Date().toISOString().split('T')[0],
    };
    addMarketplaceItem(itemToAdd);
    setMarketModalOpen(false);
    setNewItem({ title: '', description: '', price: '' });
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  const getPropertyLot = (propertyId: string) => {
    const prop = properties.find(p => p.id === propertyId);
    return prop ? `Lote ${prop.lotNumber}` : 'N/A';
  };
  
  const getPackageStatusBadge = (status: Package['status']) => {
    switch (status) {
      case 'Recibido en caseta': return <Badge color="primary">En Caseta</Badge>;
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
      
      {(canManagePackages || (currentUser.role === UserRole.Resident && packages.length > 0)) && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>Gestión de Paquetería</CardTitle>
            {canManagePackages && <Button leftIcon={ICONS.plus} onClick={() => setPackageModalOpen(true)}>Registrar Paquete</Button>}
          </div>
          <CardContent>
            <div className="overflow-x-auto">
              <Table headers={['Propiedad', 'Paquetería', 'Fecha de Recibo', 'Estatus', 'Acciones']}>
                {packages.map(pkg => (
                  <TableRow key={pkg.id}>
                    <TableCell className="whitespace-nowrap">{getPropertyLot(pkg.propertyId)}</TableCell>
                    <TableCell className="whitespace-nowrap">{pkg.carrier}</TableCell>
                    <TableCell className="whitespace-nowrap">{pkg.receivedDate}</TableCell>
                    <TableCell className="whitespace-nowrap">{getPackageStatusBadge(pkg.status)}</TableCell>
                    <TableCell className="whitespace-nowrap">
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
            </div>
          </CardContent>
        </Card>
      )}

      {currentUser.role !== UserRole.Guard && (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <CardTitle>Mercado de Segunda Mano</CardTitle>
                <Button leftIcon={ICONS.plus} onClick={() => setMarketModalOpen(true)}>Publicar Artículo</Button>
            </div>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {marketplaceItems.map(item => (
                        <div key={item.id} className="border dark:border-primary-700 rounded-lg overflow-hidden">
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

       {currentUser.role !== UserRole.Guard && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardTitle>Información Local</CardTitle>
                <CardContent>
                    <ul className="space-y-3">
                        {localBusinesses.map(biz => (
                            <li key={biz.id} className="p-3 bg-gray-50 dark:bg-primary-800/50 rounded-lg">
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{biz.name} <Badge color="primary">{biz.category}</Badge></p>
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

      <Modal isOpen={isPackageModalOpen} onClose={() => setPackageModalOpen(false)} title="Registrar Paquete" footer={<><Button variant='secondary' onClick={() => setPackageModalOpen(false)}>Cancelar</Button><Button onClick={handlePackageSubmit}>Registrar</Button></>}>
        <form onSubmit={handlePackageSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Propiedad</label>
                <select name="propertyId" value={newPackage.propertyId} onChange={(e) => setNewPackage({...newPackage, propertyId: e.target.value})} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required>
                    <option value="">Seleccione Lote</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{`Lote ${p.lotNumber} - ${owners.find(o => o.id === p.ownerId)?.name}`}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium">Paquetería</label>
                <input type="text" name="carrier" value={newPackage.carrier} onChange={(e) => setNewPackage({...newPackage, carrier: e.target.value})} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" placeholder="Ej: Amazon, Mercado Libre" required />
            </div>
        </form>
      </Modal>

      <Modal isOpen={isMarketModalOpen} onClose={() => setMarketModalOpen(false)} title="Publicar Artículo" footer={<><Button variant='secondary' onClick={() => setMarketModalOpen(false)}>Cancelar</Button><Button onClick={handleMarketItemSubmit}>Publicar</Button></>}>
        <form onSubmit={handleMarketItemSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Título del Artículo</label>
                <input type="text" name="title" value={newItem.title} onChange={(e) => setNewItem({...newItem, title: e.target.value})} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required />
            </div>
            <div>
                <label className="block text-sm font-medium">Precio (MXN)</label>
                <input type="number" name="price" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required />
            </div>
             <div>
                <label className="block text-sm font-medium">Descripción</label>
                <textarea name="description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} rows={3} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required></textarea>
            </div>
        </form>
      </Modal>

    </div>
  );
};

export default ServicesPage;