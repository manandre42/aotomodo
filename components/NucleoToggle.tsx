import React from 'react';

interface PopToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const PopToggle: React.FC<PopToggleProps> = ({ checked, onChange, label }) => {
  return (
    <div 
      className="flex items-center justify-between py-3 cursor-pointer group" 
      onClick={() => onChange(!checked)}
    >
      {label && <span className="font-bold text-pop-text text-sm">{label}</span>}
      
      <div 
        className={`
          w-14 h-8 border-2 border-pop-border rounded-full flex items-center px-1 transition-colors duration-200 relative shadow-hard-sm
          ${checked ? 'bg-pop-secondary' : 'bg-gray-200'}
        `}
      >
        <div 
          className={`
            w-6 h-6 bg-white border-2 border-pop-border rounded-full transform transition-transform duration-200 shadow-sm
            ${checked ? 'translate-x-6' : 'translate-x-0'}
          `}
        />
      </div>
    </div>
  );
};