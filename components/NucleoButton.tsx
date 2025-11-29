import React from 'react';

interface PopButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const PopButton: React.FC<PopButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading,
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative font-bold text-sm tracking-tight px-6 py-3 border-2 border-pop-border rounded-full transition-all duration-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-pop-primary text-white shadow-hard hover:-translate-y-0.5 hover:translate-x-[-0.5px] hover:shadow-hard-lg",
    secondary: "bg-pop-secondary text-pop-text shadow-hard hover:-translate-y-0.5 hover:translate-x-[-0.5px] hover:shadow-hard-lg",
    danger: "bg-pop-accent text-white shadow-hard hover:-translate-y-0.5 hover:translate-x-[-0.5px] hover:shadow-hard-lg",
    ghost: "bg-transparent border-transparent text-pop-text hover:bg-pop-border/5 shadow-none"
  };

  const loadingStyles = isLoading ? "opacity-80 cursor-wait translate-y-[2px] translate-x-[2px] shadow-none" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${loadingStyles} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
    </button>
  );
};