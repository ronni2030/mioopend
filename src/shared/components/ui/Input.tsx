/**
 * Input component con diseño glassmorphism
 */

import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-semibold mb-2 text-purple-200">
          {label} {required && '*'}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="
          w-full
          bg-white/10
          backdrop-blur-md
          rounded-xl
          p-3
          text-white
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-purple-500
          focus:bg-white/20
          smooth-transition
          border
          border-white/20
          shadow-inner
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      />
    </div>
  );
};
