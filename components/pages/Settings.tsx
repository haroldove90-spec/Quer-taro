
import React, { useState } from 'react';
import { users as initialUsers } from '../../data/mockData';
import { UserRole, User } from '../../types';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';

interface SettingsPageProps {
    currentUser: User | null;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser }) => {
    const [users, setUsers] = useState(initialUsers);

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <Card>
                <CardTitle>Gestión de Roles y Permisos</CardTitle>
                <CardContent>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">Asigna roles a los usuarios para controlar su acceso a las funcionalidades de la aplicación.</p>
                    <Table headers={['Usuario', 'Rol', 'Acciones']}>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                                        <div className="ml-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                            <div className="text-gray-500 dark:text-gray-400">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                                        // Disable changing the current admin's role to prevent lockout
                                        disabled={user.id === currentUser?.id && currentUser?.role === UserRole.Admin}
                                    >
                                        {Object.values(UserRole).map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </TableCell>
                                <TableCell>
                                    <Button size="sm">Guardar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsPage;
