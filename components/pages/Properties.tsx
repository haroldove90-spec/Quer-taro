

import React, { useState } from 'react';
import { Property, Owner } from '../../types';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ICONS } from '../../constants';

interface PropertiesPageProps {
  properties: Property[];
  owners: Owner[];
  addProperty: (property: Property) => void;
}

const PropertiesPage: React.FC<PropertiesPageProps> = ({ properties, owners, addProperty }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({ lotNumber: '', address: '', model: '', sqMeters: '', ownerId: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const propertyToAdd: Property = {
        id: `prop-${Date.now()}`,
        lotNumber: parseInt(newProperty.lotNumber, 10),
        address: newProperty.address,
        model: newProperty.model,
        sqMeters: parseInt(newProperty.sqMeters, 10),
        ownerId: newProperty.ownerId,
        occupationHistory: newProperty.ownerId ? [{ ownerId: newProperty.ownerId, from: new Date().toISOString().split('T')[0], to: null }] : [],
        documents: [],
    };
    addProperty(propertyToAdd);
    setIsAddModalOpen(false);
    setNewProperty({ lotNumber: '', address: '', model: '', sqMeters: '', ownerId: '' });
  };

  const getOwnerName = (ownerId: string) => {
    return owners.find(o => o.id === ownerId)?.name || 'Sin Asignar';
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
            <CardTitle>Listado de Inmuebles</CardTitle>
            <Button leftIcon={ICONS.plus} onClick={() => setIsAddModalOpen(true)}>Registrar Inmueble</Button>
        </div>
        <CardContent>
          <div className="overflow-x-auto">
            <Table headers={['Lote', 'Dirección', 'Modelo', 'Propietario', 'Acciones']}>
              {properties.map(prop => (
                <TableRow key={prop.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-bold text-gray-900 dark:text-white">{prop.lotNumber}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-gray-600 dark:text-gray-300">{prop.address}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-gray-600 dark:text-gray-300">{prop.model}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-gray-600 dark:text-gray-300">{getOwnerName(prop.ownerId)}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Button size="sm" variant="secondary" onClick={() => setSelectedProperty(prop)}>
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Property Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Registrar Nuevo Inmueble"
        footer={
            <>
                <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddProperty}>Guardar</Button>
            </>
        }
      >
        <form onSubmit={handleAddProperty} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Lote</label>
                    <input type="number" name="lotNumber" value={newProperty.lotNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600 shadow-sm" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Modelo</label>
                    <input type="text" name="model" value={newProperty.model} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600 shadow-sm" required/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dirección</label>
                <input type="text" name="address" value={newProperty.address} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600 shadow-sm" required/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Metros Cuadrados</label>
                    <input type="number" name="sqMeters" value={newProperty.sqMeters} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600 shadow-sm" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Propietario</label>
                    <select name="ownerId" value={newProperty.ownerId} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600 shadow-sm">
                        <option value="">Sin Asignar</option>
                        {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                </div>
            </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      {selectedProperty && (
        <Modal 
            isOpen={!!selectedProperty} 
            onClose={() => setSelectedProperty(null)}
            title={`Detalles del Lote ${selectedProperty.lotNumber}`}
            footer={<Button variant="secondary" onClick={() => setSelectedProperty(null)}>Cerrar</Button>}
        >
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">Información General</h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2">
                        <li><strong>Dirección:</strong> {selectedProperty.address}</li>
                        <li><strong>Modelo:</strong> {selectedProperty.model}</li>
                        <li><strong>Metros Cuadrados:</strong> {selectedProperty.sqMeters} m²</li>
                        <li><strong>Propietario Actual:</strong> {getOwnerName(selectedProperty.ownerId)}</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">Documentación</h4>
                    {selectedProperty.documents.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2">
                        {selectedProperty.documents.map(doc => (
                            <li key={doc.name}>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{doc.name}</a>
                            </li>
                        ))}
                        </ul>
                    ) : <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No hay documentos.</p>}
                </div>
                 <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">Historial de Ocupación</h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2">
                       {selectedProperty.occupationHistory.map((hist, index) => (
                           <li key={index}>
                               <strong>{getOwnerName(hist.ownerId) || 'Propietario Anterior'}:</strong> {hist.from} - {hist.to || 'Actual'}
                           </li>
                       ))}
                    </ul>
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default PropertiesPage;