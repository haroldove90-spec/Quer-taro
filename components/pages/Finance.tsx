

import React from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { transactions as allTransactions, properties, owners, expenses } from '../../data/mockData';
import { Badge } from '../ui/Badge';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { ICONS } from '../../constants';
import { Transaction, User, UserRole } from '../../types';

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
}

const FinancePage: React.FC<FinancePageProps> = ({ currentUser }) => {

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
      if (ownerProperty) {
          transactions = allTransactions.filter(t => t.propertyId === ownerProperty.id);
      } else {
          transactions = [];
      }
  }


  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'Paid': return <Badge color="green">Pagado</Badge>;
      case 'Pending': return <Badge color="yellow">Pendiente</Badge>;
      case 'Overdue': return <Badge color="red">Vencido</Badge>;
      default: return <Badge color="gray">Desconocido</Badge>;
    }
  };

  const totalIncome = transactions
    .filter(t => t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const accountsReceivable = transactions
    .filter(t => t.status !== 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const netBalance = totalIncome - totalExpenses;

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
            {currentUser.role === UserRole.Admin && <Button leftIcon={ICONS.plus}>Registrar Pago</Button>}
        </div>
        <CardContent>
          <Table headers={['Propiedad', 'Propietario', 'Fecha', 'Tipo', 'Monto', 'Estatus', 'Acciones']}>
            {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(tx => (
              <TableRow key={tx.id}>
                <TableCell>
                  <div className="font-bold text-gray-900 dark:text-white">{getPropertyInfo(tx.propertyId).lot}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-600 dark:text-gray-300">{getPropertyInfo(tx.propertyId).owner}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-600 dark:text-gray-300">{tx.date}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-600 dark:text-gray-300">{tx.type}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-800 dark:text-gray-100">{formatCurrency(tx.amount)}</div>
                </TableCell>
                <TableCell>{getStatusBadge(tx.status)}</TableCell>
                <TableCell>
                  <Button size="sm" variant="secondary" leftIcon={ICONS.receipt}>
                    Ver Recibo
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
      
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