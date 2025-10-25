
import { Property, Owner, Announcement, Transaction, Visitor, MaintenanceRequest, AmenityBooking, UserRole } from '../types';

export const owners: Owner[] = [
  {
    id: 'owner-1',
    name: 'Carlos Hernandez',
    email: 'carlos@example.com',
    phone: '442-123-4567',
    avatar: 'https://picsum.photos/seed/owner1/100/100',
    familyMembers: [{ name: 'Ana Hernandez', age: 38 }, { name: 'Luis Hernandez', age: 12 }],
    vehicles: [{ plate: 'UKN-56-78', model: 'Honda CRV' }],
    pets: ['Golden Retriever'],
  },
  {
    id: 'owner-2',
    name: 'Sofia Rodriguez',
    email: 'sofia@example.com',
    phone: '442-765-4321',
    avatar: 'https://picsum.photos/seed/owner2/100/100',
    familyMembers: [],
    vehicles: [{ plate: 'UML-99-01', model: 'Kia Rio' }],
    pets: [],
  },
];

export const properties: Property[] = [
  {
    id: 'prop-1',
    lotNumber: 15,
    address: 'Av. del Llama 15, Querétaro',
    model: 'Zafiro',
    sqMeters: 180,
    ownerId: 'owner-1',
    occupationHistory: [{ ownerId: 'owner-1', from: '2020-01-15', to: null }],
    documents: [{ name: 'Escritura.pdf', url: '#' }, { name: 'Plano.pdf', url: '#' }],
  },
  {
    id: 'prop-2',
    lotNumber: 22,
    address: 'Av. del Llama 22, Querétaro',
    model: 'Esmeralda',
    sqMeters: 210,
    ownerId: 'owner-2',
    occupationHistory: [{ ownerId: 'owner-2', from: '2021-06-20', to: null }],
    documents: [{ name: 'Contrato.pdf', url: '#' }],
  },
];

export const announcements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Mantenimiento de Alberca',
    content: 'Se informa que la alberca estará en mantenimiento el próximo Sábado de 9 AM a 3 PM. Agradecemos su comprensión.',
    date: '2023-10-20',
    author: 'Administración',
  },
  {
    id: 'ann-2',
    title: 'Junta Vecinal Trimestral',
    content: 'Recordatorio de nuestra junta vecinal el día 30 de Octubre a las 7 PM en el salón de eventos. ¡No falten!',
    date: '2023-10-15',
    author: 'Administración',
  }
];

export const transactions: Transaction[] = [
    { id: 'txn-1', propertyId: 'prop-1', date: '2023-10-01', type: 'Maintenance Fee', amount: 1200, status: 'Paid' },
    { id: 'txn-2', propertyId: 'prop-2', date: '2023-10-01', type: 'Maintenance Fee', amount: 1500, status: 'Paid' },
    { id: 'txn-3', propertyId: 'prop-1', date: '2023-09-01', type: 'Maintenance Fee', amount: 1200, status: 'Paid' },
    { id: 'txn-4', propertyId: 'prop-2', date: '2023-09-01', type: 'Maintenance Fee', amount: 1500, status: 'Pending' },
    { id: 'txn-5', propertyId: 'prop-2', date: '2023-08-15', type: 'Fine', amount: 500, status: 'Overdue' },
];

export const visitors: Visitor[] = [
    { id: 'vis-1', name: 'Juan Perez', idNumber: '123456789', propertyId: 'prop-1', entryDate: '2023-10-21 10:00', exitDate: '2023-10-21 12:30', status: 'Departed' },
    { id: 'vis-2', name: 'Maria Garcia', idNumber: '987654321', propertyId: 'prop-2', entryDate: '2023-10-21 14:00', exitDate: null, status: 'Inside' },
    { id: 'vis-3', name: 'Pedro Gomez', idNumber: '555444333', propertyId: 'prop-1', entryDate: '2023-10-22 11:00', exitDate: null, status: 'Expected' },
];

export const maintenanceRequests: MaintenanceRequest[] = [
    { id: 'req-1', propertyId: 'prop-1', area: 'Jardín frontal', description: 'Fuga en sistema de riego.', status: 'Completed', submittedDate: '2023-10-10' },
    { id: 'req-2', propertyId: 'prop-2', area: 'Alberca', description: 'Luz de la alberca no enciende.', status: 'In Progress', submittedDate: '2023-10-18' },
    { id: 'req-3', propertyId: 'N/A', area: 'Área Común - Cancha de Padel', description: 'Red de la cancha está rota.', status: 'Pending', submittedDate: '2023-10-20' },
];

export const amenityBookings: AmenityBooking[] = [
    { id: 'book-1', amenity: 'Salón de Eventos', propertyId: 'prop-2', date: '2023-11-04', timeSlot: '14:00 - 22:00' },
    { id: 'book-2', amenity: 'Asador #1', propertyId: 'prop-1', date: '2023-10-29', timeSlot: '13:00 - 16:00' },
];

export const currentUser = {
    name: 'Admin Llama',
    role: UserRole.Admin,
    avatar: 'https://picsum.photos/seed/admin/100/100'
};
