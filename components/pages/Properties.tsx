
import React, { useState } from 'react';
import { properties, owners } from '../../data/mockData';
import { Property } from '../../types';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ICONS } from '../../constants';

const PropertiesPage: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const getOwnerName = (ownerId: string) => {
    return owners.find(o => o.id === ownerId)?.name || 'Sin Asignar';
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
            <CardTitle>Listado de Inmuebles</CardTitle>
            <Button leftIcon={ICONS.plus}>Registrar Inmueble</Button>
        </div>
        <CardContent>
          <Table headers={['Lote', 'Dirección', 'Modelo', 'Propietario', 'Acciones']}>
            {properties.map(prop => (
              <TableRow key={prop.id}>
                <TableCell>
                  <div className="font-bold text-gray-900 dark:text-white">{prop.lotNumber}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-600 dark:text-gray-300">{prop.address}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-600 dark:text-gray-300">{prop.model}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-600 dark:text-gray-300">{getOwnerName(prop.ownerId)}</div>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="secondary" onClick={() => setSelectedProperty(prop)}>
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>

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
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2">
                       {selectedProperty.documents.map(doc => (
                           <li key={doc.name}>
                               <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{doc.name}</a>
                           </li>
                       ))}
                    </ul>
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
