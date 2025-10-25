

import { Property, Owner, Announcement, Transaction, Visitor, MaintenanceRequest, AmenityBooking, UserRole, Expense, User, Provider, MarketplaceItem, LocalBusiness, Package } from '../types';

export const owners: Owner[] = [
  {
    id: 'owner-1',
    name: 'Carlos Hernandez',
    email: 'carlos@example.com',
    phone: '442-123-4567',
    avatar: 'https://i.pravatar.cc/150?u=owner-1',
    familyMembers: [{ name: 'Ana Hernandez', age: 38 }, { name: 'Luis Hernandez', age: 12 }],
    vehicles: [{ plate: 'UKN-56-78', model: 'Honda CRV' }, { plate: 'GTM-12-34', model: 'VW Jetta' }],
    pets: ['Golden Retriever "Max"'],
  },
  {
    id: 'owner-2',
    name: 'Sofia Rodriguez',
    email: 'sofia@example.com',
    phone: '442-765-4321',
    avatar: 'https://i.pravatar.cc/150?u=owner-2',
    familyMembers: [],
    vehicles: [{ plate: 'UML-99-01', model: 'Kia Rio' }],
    pets: [],
  },
  {
    id: 'owner-3',
    name: 'Mariana Lopez',
    email: 'mariana@example.com',
    phone: '442-555-8899',
    avatar: 'https://i.pravatar.cc/150?u=owner-3',
    familyMembers: [{ name: 'Javier Gomez', age: 45 }],
    vehicles: [],
    pets: ['Gato Siamés "Milo"', 'Pug "Rocky"'],
  },
  {
    id: 'owner-4',
    name: 'Jorge Martinez',
    email: 'jorge@example.com',
    phone: '442-222-1133',
    avatar: 'https://i.pravatar.cc/150?u=owner-4',
    familyMembers: [
        { name: 'Laura Martinez', age: 40 }, 
        { name: 'Sofia Martinez', age: 15 },
        { name: 'Mateo Martinez', age: 10 }
    ],
    vehicles: [{ plate: 'HJK-45-77', model: 'Toyota Highlander' }],
    pets: [],
  },
];

export const properties: Property[] = [
  {
    id: 'prop-1',
    lotNumber: 15,
    address: 'Av. de los Encinos 15, Querétaro',
    model: 'Zafiro',
    sqMeters: 180,
    ownerId: 'owner-1',
    occupationHistory: [{ ownerId: 'owner-1', from: '2020-01-15', to: null }],
    documents: [{ name: 'Escritura_Lote_15.pdf', url: '#' }, { name: 'Plano_Arquitectonico.pdf', url: '#' }, { name: 'Reglamento_Firmado.pdf', url: '#' }],
  },
  {
    id: 'prop-2',
    lotNumber: 22,
    address: 'Av. de los Encinos 22, Querétaro',
    model: 'Esmeralda',
    sqMeters: 210,
    ownerId: 'owner-2',
    occupationHistory: [{ ownerId: 'owner-2', from: '2021-06-20', to: null }],
    documents: [{ name: 'Contrato_CompraVenta.pdf', url: '#' }],
  },
  {
    id: 'prop-3',
    lotNumber: 8,
    address: 'Av. de los Encinos 8, Querétaro',
    model: 'Zafiro',
    sqMeters: 180,
    ownerId: 'owner-3',
    occupationHistory: [
        { ownerId: 'prev-owner-A', from: '2019-03-10', to: '2022-08-01' },
        { ownerId: 'owner-3', from: '2022-08-02', to: null }
    ],
    documents: [{ name: 'Acta_Entrega.pdf', url: '#' }],
  },
  {
    id: 'prop-4',
    lotNumber: 31,
    address: 'Av. de los Encinos 31, Querétaro',
    model: 'Rubí',
    sqMeters: 250,
    ownerId: 'owner-4',
    occupationHistory: [{ ownerId: 'owner-4', from: '2018-11-11', to: null }],
    documents: [{ name: 'Escritura_Lote_31.pdf', url: '#' }],
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
    { id: 'txn-6', propertyId: 'prop-3', date: '2023-10-01', type: 'Maintenance Fee', amount: 1200, status: 'Paid' },
    { id: 'txn-7', propertyId: 'prop-4', date: '2023-10-01', type: 'Maintenance Fee', amount: 1800, status: 'Overdue' },
    { id: 'txn-8', propertyId: 'prop-3', date: '2023-09-01', type: 'Maintenance Fee', amount: 1200, status: 'Overdue' },
    { id: 'txn-9', propertyId: 'prop-4', date: '2023-09-01', type: 'Maintenance Fee', amount: 1800, status: 'Paid' },
    { id: 'txn-10', propertyId: 'prop-1', date: '2023-10-15', type: 'Extra Service', amount: 350, status: 'Paid' },
    { id: 'txn-11', propertyId: 'prop-3', date: '2023-10-20', type: 'Fine', amount: 250, status: 'Pending' },
];

export const expenses: Expense[] = [
    { id: 'exp-1', date: '2023-10-05', category: 'Mantenimiento', description: 'Reparación bomba de alberca', amount: 3500 },
    { id: 'exp-2', date: '2023-10-10', category: 'Servicios', description: 'Pago de CFE áreas comunes', amount: 2800 },
    { id: 'exp-3', date: '2023-10-15', category: 'Personal', description: 'Nómina personal de seguridad', amount: 18000 },
    { id: 'exp-4', date: '2023-10-18', category: 'Mantenimiento', description: 'Compra de cloro y químicos para alberca', amount: 1200 },
    { id: 'exp-5', date: '2023-10-20', category: 'Administrativo', description: 'Papelería y consumibles de oficina', amount: 450 },
];

export const visitors: Visitor[] = [
    { id: 'vis-1', name: 'Juan Perez (Uber)', idNumber: '123456789', propertyId: 'prop-1', entryDate: '2023-10-21 10:00', exitDate: '2023-10-21 12:30', status: 'Departed' },
    { id: 'vis-2', name: 'Maria Garcia (Familia)', idNumber: '987654321', propertyId: 'prop-2', entryDate: '2023-10-21 14:00', exitDate: null, status: 'Inside' },
    { id: 'vis-3', name: 'Pedro Gomez (Servicio)', idNumber: '555444333', propertyId: 'prop-1', entryDate: '2023-10-22 11:00', exitDate: null, status: 'Expected' },
    { id: 'vis-4', name: 'Ana Torres (Amiga)', idNumber: '111222333', propertyId: 'prop-4', entryDate: '2023-10-22 18:00', exitDate: null, status: 'Expected' },
    { id: 'vis-5', name: 'Luis Ramirez (Proveedor)', idNumber: 'A4B5C6D7', propertyId: 'N/A', entryDate: '2023-10-20 09:00', exitDate: '2023-10-20 11:00', status: 'Departed' },
];

export const maintenanceRequests: MaintenanceRequest[] = [
    { id: 'req-1', propertyId: 'prop-1', area: 'Jardín frontal', description: 'Fuga en sistema de riego.', status: 'Completed', submittedDate: '2023-10-10' },
    { id: 'req-2', propertyId: 'prop-2', area: 'Alberca', description: 'Luz de la alberca no enciende.', status: 'In Progress', submittedDate: '2023-10-18' },
    { id: 'req-3', propertyId: 'N/A', area: 'Área Común - Cancha de Padel', description: 'Red de la cancha está rota.', status: 'Pending', submittedDate: '2023-10-20' },
    { id: 'req-4', propertyId: 'prop-4', area: 'Fachada', description: 'Mancha de humedad en pared exterior.', status: 'Pending', submittedDate: '2023-10-21' },
];

export const amenityBookings: AmenityBooking[] = [
    { id: 'book-1', amenity: 'Salón de Eventos', propertyId: 'prop-2', date: '2023-11-04', timeSlot: '14:00 - 22:00' },
    { id: 'book-2', amenity: 'Asador #1', propertyId: 'prop-1', date: '2023-10-29', timeSlot: '13:00 - 16:00' },
    { id: 'book-3', amenity: 'Cancha de Padel', propertyId: 'prop-4', date: '2023-10-28', timeSlot: '18:00 - 19:00' },
];

export const users: User[] = [
    { id: 'user-1', name: 'Admin Bosques', email: 'admin@bosquesencinos.com', role: UserRole.Admin, avatar: 'https://i.pravatar.cc/150?u=admin' },
    { id: 'user-2', name: 'Carlos Hernandez', email: 'carlos@example.com', role: UserRole.Resident, avatar: 'https://i.pravatar.cc/150?u=owner-1' },
    { id: 'user-3', name: 'Guardia A', email: 'guardia_a@bosquesencinos.com', role: UserRole.Guard, avatar: 'https://i.pravatar.cc/150?u=guard-1' },
    { id: 'user-4', name: 'Sofia Rodriguez', email: 'sofia@example.com', role: UserRole.Resident, avatar: 'https://i.pravatar.cc/150?u=owner-2' },
];

export const providers: Provider[] = [
    { id: 'prov-1', name: 'Plomería Express', service: 'Plomería', phone: '442-333-4455', rating: 5 },
    { id: 'prov-2', name: 'El Rayo Eléctrico', service: 'Electricista', phone: '442-987-6543', rating: 4 },
    { id: 'prov-3', name: 'Jardines de Querétaro', service: 'Jardinería', phone: '442-111-2233', rating: 5 },
    { id: 'prov-4', name: 'Limpieza Total', service: 'Limpieza de Interiores', phone: '442-555-9900', rating: 4 },
];

export const marketplaceItems: MarketplaceItem[] = [
    { id: 'mkt-1', title: 'Bicicleta de Montaña', description: 'Poco uso, excelentes condiciones. Rodada 26.', price: 2500, imageUrl: 'https://placehold.co/600x400/34d399/FFFFFF/png?text=Bicicleta', sellerId: 'owner-1', datePosted: '2023-10-20' },
    { id: 'mkt-2', title: 'Sillón de 3 Plazas', description: 'Cómodo sillón color gris, ideal para sala.', price: 4000, imageUrl: 'https://placehold.co/600x400/6ee7b7/FFFFFF/png?text=Sillón', sellerId: 'owner-4', datePosted: '2023-10-18' },
    { id: 'mkt-3', title: 'Lámpara de Escritorio LED', description: 'Moderna y funcional, con varios niveles de intensidad.', price: 350, imageUrl: 'https://placehold.co/600x400/a7f3d0/FFFFFF/png?text=Lámpara', sellerId: 'owner-2', datePosted: '2023-10-22' },
];

export const localBusinesses: LocalBusiness[] = [
    { id: 'biz-1', name: 'Taquería "El Llama Veloz"', category: 'Restaurante', phone: '442-123-1234', address: 'Av. Principal 123' },
    { id: 'biz-2', name: 'Farmacia La Salud', category: 'Salud', phone: '442-456-4567', address: 'Calle Secundaria 45' },
    { id: 'biz-3', name: 'Lavandería "Clean Fast"', category: 'Servicios', phone: '442-789-7890', address: 'Plaza Comercial Llama' },
];

export const packages: Package[] = [
    { id: 'pkg-1', propertyId: 'prop-1', carrier: 'Mercado Libre', receivedDate: '2023-10-22 11:00', status: 'Recibido en caseta', pickedUpDate: null },
    { id: 'pkg-2', propertyId: 'prop-2', carrier: 'Amazon', receivedDate: '2023-10-21 15:30', status: 'Entregado al residente', pickedUpDate: '2023-10-21 18:00' },
    { id: 'pkg-3', propertyId: 'prop-4', carrier: 'DHL', receivedDate: '2023-10-22 09:15', status: 'Recibido en caseta', pickedUpDate: null },
];