import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
  };
  
  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  return (
    <button 
      className={styles} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};