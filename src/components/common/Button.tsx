// src/components/common/Button.tsx
import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({ type = 'button', className, children, ...props }) => (
  <button
    type={type}
    className={`px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;