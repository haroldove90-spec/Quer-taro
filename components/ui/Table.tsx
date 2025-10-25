
import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="w-full">
      <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-primary-700">
        <thead className="bg-gray-50 dark:bg-primary-800">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-primary-900 divide-y divide-gray-200 dark:divide-primary-700">
          {children}
        </tbody>
      </table>
    </div>
  );
};

interface TableRowProps {
    children: React.ReactNode;
    className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({children, className}) => <tr className={className}>{children}</tr>;

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({children, className}) => <td className={`px-3 md:px-6 py-4 text-sm align-top break-words ${className}`}>{children}</td>;