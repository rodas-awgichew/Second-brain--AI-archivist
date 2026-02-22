
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-bold uppercase tracking-wider mb-2 text-brand-text-light">
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-brand-white border border-brand-gray-dark rounded-soft p-3 transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-brand-black"
        {...props}
      />
    </div>
  );
};

export default Input;
