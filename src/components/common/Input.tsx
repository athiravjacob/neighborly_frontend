// src/components/common/Input.tsx
import React from 'react';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  [key: string]: any; // For additional props
}

const Input: React.FC<InputProps> = ({ value, onChange, placeholder, className, ...props }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 ${className}`}
    {...props}
  />
);

export default Input;