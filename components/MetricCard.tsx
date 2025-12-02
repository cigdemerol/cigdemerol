import React from 'react';
import { InfoTooltip } from './InfoTooltip';

interface MetricCardProps {
  title: string;
  value: number;
  formula: string;
  description: string;
  colorClass: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, formula, description, colorClass }) => {
  const percentage = isNaN(value) ? 0 : Math.round(value * 100);
  const displayValue = isNaN(value) ? "0.00" : value.toFixed(2);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center">
            {title}
            <InfoTooltip text={description} />
          </h3>
          <span className={`text-2xl font-bold ${colorClass}`}>
            %{percentage}
          </span>
        </div>
        <div className="text-xs text-slate-400 font-mono mb-4 bg-slate-50 p-1 rounded px-2 inline-block">
          {formula}
        </div>
      </div>
      
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${colorClass.replace('text-', 'bg-')}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="mt-2 text-xs text-slate-500">
        Değer: <span className="font-medium text-slate-700">{displayValue}</span>
      </div>
    </div>
  );
};