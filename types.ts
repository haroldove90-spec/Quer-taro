
export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  familyMembers: { name: string; age: number }[];
  vehicles: { plate: string; model: string }[];
  pets: string[];
}

export interface Property {
  id: string;
  lotNumber: number;
  address: string;
  model: string;
  sqMeters: number;
  ownerId: string;
  occupationHistory: { ownerId: string; from: string; to: string | null }[];
  documents: { name: string; url: string }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface Transaction {
  id: string;
  propertyId: string;
  date: string;
  type: 'Maintenance Fee' | 'Fine' | 'Extra Service';
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Visitor {
  id:string;
  name: string;
  idNumber: string;
  propertyId: string;
  entryDate: string;
  exitDate: string | null;
  status: 'Expected' | 'Inside' | 'Departed';
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  area: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  submittedDate: string;
}

export interface AmenityBooking {
  id: string;
  amenity: string;
  propertyId: string;
  date: string;
  timeSlot: string;
}

export enum UserRole {
  Admin = 'Administrador',
  Resident = 'Residente',
  Guard = 'Vigilante',
}

export type Page = 'dashboard' | 'properties' | 'residents' | 'communication' | 'finance' | 'security' | 'maintenance' | 'settings';
