import React from 'react';

interface PopSliderProps {
  value: number;
  onChange: (val: number) => void;
  label?: string;
  min?: number;
  max?: number;
}

export const PopSlider: React.FC<PopSliderProps> = ({ 
  value, 
  onChange, 
  label, 
  min = 0, 
  max = 100 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full py-2">
      {label && (
        <div className="flex justify-between mb-2 font-bold text-sm text-pop-text">
          <span>{label}</span>
          <span className="bg-pop-text text-white px-2 rounded-md text-xs py-0.5">{value}%</span>
        </div>
      )}
      <div className="relative h-8 flex items-center cursor-pointer group">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full opacity-0 z-20 cursor-pointer h-full"
        />
        {/* Track Background */}
        <div className="w-full h-4 bg-white border-2 border-pop-border rounded-full relative z-0 overflow-hidden shadow-hard-sm">
          {/* Active Track */}
          <div 
            className="h-full bg-pop-primary absolute top-0 left-0 border-r-2 border-pop-border" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Thumb */}
        <div 
          className="absolute h-6 w-6 bg-pop-warning border-2 border-pop-border rounded-full z-10 pointer-events-none transition-transform shadow-sm"
          style={{ left: `calc(${percentage}% - 12px)` }}
        />
      </div>
    </div>
  );
};