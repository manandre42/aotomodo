import React from 'react';

interface PopCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  active?: boolean;
  accentColor?: string;
  onClick?: () => void;
}

export const PopCard: React.FC<PopCardProps> = ({ 
  children, 
  title, 
  className = '', 
  active = false,
  accentColor,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative bg-pop-surface border-2 border-pop-border rounded-2xl transition-all duration-200
        ${active ? 'shadow-hard-lg -translate-y-1' : 'shadow-hard'}
        ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-y-0 active:shadow-hard' : ''}
        overflow-hidden
        ${className}
      `}
    >
      {/* Optional decorative header strip */}
      {accentColor && (
        <div 
          className="h-3 w-full border-b-2 border-pop-border" 
          style={{ backgroundColor: accentColor }} 
        />
      )}
      
      <div className="p-5">
        {title && (
          <div className="mb-3 flex items-center justify-between">
             <h3 className={`font-extrabold text-sm uppercase tracking-wide text-pop-text/70`}>
              {title}
            </h3>
            {active && <div className="w-3 h-3 bg-pop-secondary rounded-full border-2 border-pop-border animate-pulse"></div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};