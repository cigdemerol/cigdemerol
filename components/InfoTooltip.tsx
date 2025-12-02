import React from 'react';
import { Info } from 'lucide-react';

interface Props {
  text: string;
}

export const InfoTooltip: React.FC<Props> = ({ text }) => {
  return (
    <div className="group relative inline-flex items-center ml-2 cursor-help">
      <Info size={16} className="text-gray-400 hover:text-blue-500 transition-colors" />
      <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};