

import React, { useState } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { ICONS } from '../../constants';
import { Transaction, User, UserRole, Property, Owner, Expense } from '../../types';
import { Modal } from '../ui/Modal';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement; helpText?: string }> = ({ title, value, icon, helpText }) => (
  <Card>
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-300 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        {helpText && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{helpText}</p>}
      </div>
    </div>
  </Card>
);

interface FinancePageProps {
  currentUser: User;
  transactions: Transaction[];
  properties: Property[];
  owners: Owner[];
  expenses: Expense[];
  addTransaction: (transaction: Transaction) => void;
}

const FinancePage: React.FC<FinancePageProps> = ({ currentUser, transactions: allTransactions, properties, owners, expenses, addTransaction }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({ propertyId: '', type: 'Maintenance Fee', amount: '', status: 'Pending' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTx(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const txToAdd: Transaction = {
      id: `txn-${Date.now()}`,
      propertyId: newTx.propertyId,
      date: new Date().toISOString().split('T')[0],
      type: newTx.type as Transaction['type'],
      amount: parseFloat(newTx.amount),
      status: newTx.status as Transaction['status'],
    };
    addTransaction(txToAdd);
    setIsAddModalOpen(false);
    setNewTx({ propertyId: '', type: 'Maintenance Fee', amount: '', status: 'Pending' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };
  
  const getPropertyInfo = (propertyId: string) => {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return { lot: 'N/A', owner: 'N/A' };
    const owner = owners.find(o => o.id === prop.ownerId);
    return {
      lot: `Lote ${prop.lotNumber}`,
      owner: owner?.name || 'Sin Asignar'
    };
  };
  
  let transactions = allTransactions;
  if (currentUser.role === UserRole.Resident) {
      const currentOwner = owners.find(o => o.email === currentUser.email);
      const ownerProperty = properties.find(p => p.ownerId === currentOwner?.id);
      transactions = ownerProperty ? allTransactions.filter(t => t.propertyId === ownerProperty.id) : [];
  }


  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'Paid': return <Badge color="green">Pagado</Badge>;
      case 'Pending': return <Badge color="yellow">Pendiente</Badge>;
      case 'Overdue': return <Badge color="red">Vencido</Badge>;
      default: return <Badge color="gray">Desconocido</Badge>;
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6">
       {currentUser.role === UserRole.Admin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Ingresos Totales" value={formatCurrency(allTransactions.filter(t => t.status === 'Paid').reduce((s, t) => s + t.amount, 0))} icon={ICONS.finance} helpText="Suma de todos los pagos recibidos." />
            <StatCard title="Cuentas por Cobrar" value={formatCurrency(allTransactions.filter(t => t.status !== 'Paid').reduce((s, t) => s + t.amount, 0))} icon={ICONS.notification} helpText="Suma de pagos pendientes y vencidos." />
            <StatCard title="Gastos Totales" value={formatCurrency(totalExpenses)} icon={ICONS.maintenance} helpText="Suma de todos los gastos registrados." />
            <StatCard title="Balance Neto" value={formatCurrency(allTransactions.filter(t => t.status === 'Paid').reduce((s, t) => s + t.amount, 0) - totalExpenses)} icon={ICONS.dashboard} helpText="Ingresos menos gastos." />
        </div>
       )}

      <Card>
        <div className="flex justify-between items-center mb-4">
            <CardTitle>Historial de Transacciones</CardTitle>
            {currentUser.role === UserRole.Admin && <Button leftIcon={ICONS.plus} onClick={() => setIsAddModalOpen(true)}>Registrar Transacción</Button>}
        </div>
        <CardContent>
          <div className="overflow-x-auto">
            <Table headers={['Propiedad', 'Propietario', 'Fecha', 'Tipo', 'Monto', 'Estatus', 'Acciones']}>
              {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(tx => (
                <TableRow key={tx.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-bold text-gray-900 dark:text-white">{getPropertyInfo(tx.propertyId).lot}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-gray-600 dark:text-gray-300">{getPropertyInfo(tx.propertyId).owner}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-gray-600 dark:text-gray-300">{tx.date}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-gray-600 dark:text-gray-300">{tx.type}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium text-gray-800 dark:text-gray-100">{formatCurrency(tx.amount)}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{getStatusBadge(tx.status)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Button size="sm" variant="secondary" leftIcon={ICONS.receipt}>
                      Ver Recibo
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Registrar Nueva Transacción"
        footer={<><Button variant='secondary' onClick={() => setIsAddModalOpen(false)}>Cancelar</Button><Button onClick={handleAddTransaction}>Guardar</Button></>}
      >
        <form onSubmit={handleAddTransaction} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Propiedad</label>
                <select name="propertyId" value={newTx.propertyId} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required>
                    <option value="">Seleccione una propiedad</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{`Lote ${p.lotNumber} - ${getPropertyInfo(p.id).owner}`}</option>)}
                </select>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Tipo</label>
                    <select name="type" value={newTx.type} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required>
                        <option>Maintenance Fee</option>
                        <option>Fine</option>
                        <option>Extra Service</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Monto (MXN)</label>
                    <input type="number" name="amount" value={newTx.amount} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required/>
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium">Estatus</label>
                <select name="status" value={newTx.status} onChange={handleInputChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required>
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Overdue</option>
                </select>
            </div>
        </form>
      </Modal>
      
      { currentUser.role === UserRole.Admin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardTitle>Registro de Gastos</CardTitle>
                <CardContent>
                    <ul className="space-y-3">
                        {expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(exp => (
                            <li key={exp.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-primary-800/50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{exp.description}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{exp.date} - <Badge color="primary">{exp.category}</Badge></p>
                                </div>
                                <p className="font-bold text-red-600 dark:text-red-400">{formatCurrency(exp.amount)}</p>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardTitle>Reportes Financieros</CardTitle>
                <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Genera reportes para un análisis detallado de las finanzas.</p>
                    <div className="space-y-3">
                        <Button className="w-full" variant="secondary">Estado de Cuenta por Propietario</Button>
                        <Button className="w-full" variant="secondary">Reporte de Ingresos y Egresos</Button>
                        <Button className="w-full" variant="secondary">Reporte de Morosidad</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}

    </div>
  );
};

export default FinancePage;