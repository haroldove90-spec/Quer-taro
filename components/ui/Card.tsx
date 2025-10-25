
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${className}`}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

interface CardTitleProps {
    children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
    return <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{children}</h3>;
}

interface CardContentProps {
    children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ children }) => {
    return <div className="text-gray-600 dark:text-gray-300">{children}</div>;
}
