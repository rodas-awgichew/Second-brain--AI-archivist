
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyles = 'px-6 py-3 font-bold text-sm uppercase tracking-wider border rounded-soft transition-all duration-200 ease-in-out flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-black active:scale-[0.98]';

  const variantStyles = {
    primary: 'bg-brand-black text-brand-white border-brand-black hover:bg-brand-text hover:border-brand-text',
    secondary: 'bg-brand-white text-brand-text border-brand-gray-dark hover:bg-brand-gray-light hover:border-brand-text',
    inverted: 'bg-brand-white text-brand-black border-brand-black hover:bg-brand-black hover:text-brand-white',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
