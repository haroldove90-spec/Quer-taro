
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  leftIcon?: React.ReactElement;
  size?: 'sm' | 'md';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', leftIcon, size = 'md', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center border border-transparent font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
  }

  const variantClasses = {
    primary: 'text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-400 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      type="button"
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2 -ml-1 h-5 w-5">{leftIcon}</span>}
      {children}
    </button>
  );
};
