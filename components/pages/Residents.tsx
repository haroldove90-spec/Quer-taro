
import React, { useState } from 'react';
import { owners, properties } from '../../data/mockData';
import { Owner } from '../../types';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ICONS } from '../../constants';

const ResidentsPage: React.FC = () => {
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  const getPropertyInfo = (ownerId: string) => {
    const prop = properties.find(p => p.ownerId === ownerId);
    return prop ? `Lote ${prop.lotNumber}` : 'N/A';
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
            <CardTitle>Listado de Residentes</CardTitle>
            <Button leftIcon={ICONS.plus}>Registrar Residente</Button>
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
