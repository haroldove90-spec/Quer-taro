

import React, { useState } from 'react';
import { Owner, Property } from '../../types';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ICONS } from '../../constants';

interface ResidentsPageProps {
  owners: Owner[];
  properties: Property[];
  addOwner: (owner: Owner) => void;
}

const ResidentsPage: React.FC<ResidentsPageProps> = ({ owners, properties, addOwner }) => {
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOwner, setNewOwner] = useState({ name: '', email: '', phone: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOwner(prev => ({...prev, [name]: value}));
  };

  const handleAddOwner = (e: React.FormEvent) => {
    e.preventDefault();
    const ownerToAdd: Owner = {
      id: `owner-${Date.now()}`,
      name: newOwner.name,
      email: newOwner.email,
      phone: newOwner.phone,
      avatar: `https://i.pravatar.cc/150?u=owner-${Date.now()}`,
      familyMembers: [],
      vehicles: [],
      pets: [],
    };
    addOwner(ownerToAdd);
    setIsAddModalOpen(false);
    setNewOwner({ name: '', email: '', phone: '' });
  };

  const getPropertyInfo = (ownerId: string) => {
    const prop = properties.find(p => p.ownerId === ownerId);
    return prop ? `Lote ${prop.lotNumber}` : 'N/A';
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
            <CardTitle>Listado de Residentes</CardTitle>
            <Button leftIcon={ICONS.plus} onClick={() => setIsAddModalOpen(true)}>Registrar Residente</Button>
        </div>
        <CardContent>
          <Table headers={['Nombre', 'Contacto', 'Inmueble', 'Acciones']}>
            {owners.map(owner => (
              <TableRow key={owner.id}>
                <TableCell>
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full" src={owner.avatar} alt="" />
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 dark:text-white">{owner.name}</div>
                      <div className="text-gray-500 dark:text-gray-400">{owner.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-600 dark:text-gray-300">{owner.phone}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-600 dark:text-gray-300">{getPropertyInfo(owner.id)}</div>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="secondary" onClick={() => setSelectedOwner(owner)}>
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Resident Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Registrar Nuevo Residente"
        footer={
            <>
                <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddOwner}>Guardar</Button>
            </>
        }
       >
        <form onSubmit={handleAddOwner} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
                <input type="text" name="name" value={newOwner.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600 shadow-sm" required/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
                <input type="email" name="email" value={newOwner.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600 shadow-sm" required/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                <input type="tel" name="phone" value={newOwner.phone} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600 shadow-sm" required/>
            </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      {selectedOwner && (
        <Modal 
            isOpen={!!selectedOwner} 
            onClose={() => setSelectedOwner(null)}
            title={`Detalles de ${selectedOwner.name}`}
            footer={<Button variant="secondary" onClick={() => setSelectedOwner(null)}>Cerrar</Button>}
        >
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">Núcleo Familiar</h4>
                    {selectedOwner.familyMembers.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2">
                            {selectedOwner.familyMembers.map(member => (
                                <li key={member.name}>{member.name} ({member.age} años)</li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-500 dark:text-gray-400 mt-2">No hay miembros familiares registrados.</p>}
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">Vehículos Registrados</h4>
                    {selectedOwner.vehicles.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2">
                            {selectedOwner.vehicles.map(v => (
                                <li key={v.plate}><strong>{v.plate}</strong> - {v.model}</li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-500 dark:text-gray-400 mt-2">No hay vehículos registrados.</p>}
                </div>
                 <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">Mascotas</h4>
                    {selectedOwner.pets.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2">
                           {selectedOwner.pets.map((pet, index) => <li key={index}>{pet}</li>)}
                        </ul>
                    ) : <p className="text-gray-500 dark:text-gray-400 mt-2">No hay mascotas registradas.</p>}
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default ResidentsPage;