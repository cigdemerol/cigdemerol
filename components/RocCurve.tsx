import React from 'react';
import { InfoTooltip } from './InfoTooltip';

interface RocCurveProps {
  tpr: number; // True Positive Rate (Sensitivity/Recall)
  fpr: number; // False Positive Rate (1 - Specificity)
  auc: number; // Area Under Curve
}

export const RocCurve: React.FC<RocCurveProps> = ({ tpr, fpr, auc }) => {
  const size = 200;
  const padding = 20;
  const graphSize = size - padding * 2;

  // Coordinate calculations (0,0 is bottom-left in graph terms, but top-left in SVG)
  const x = padding + fpr * graphSize;
  const y = size - padding - (tpr * graphSize);

  // Random guess line (0,0 to 1,1)
  const startX = padding;
  const startY = size - padding;
  const endX = size - padding;
  const endY = padding;

  // Linear path for AUC area (Trapezoidal)
  // Path: Start(0,0) -> Point(FPR,TPR) -> End(1,1) -> Corner(1,0) -> Start(0,0)
  const areaPath = `
    M ${startX} ${startY} 
    L ${x} ${y} 
    L ${endX} ${endY} 
    L ${endX} ${startY} 
    Z
  `;

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center">
          ROC Eğrisi & AUC
          <InfoTooltip text="Receiver Operating Characteristic. Sol üst köşeye ne kadar yakınsa model o kadar iyidir. Taralı alan AUC değerini gösterir." />
        </h3>
        <span className={`text-sm font-bold px-2 py-1 rounded ${auc >= 0.8 ? 'bg-green-100 text-green-700' : auc >= 0.6 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
          AUC: {auc.toFixed(2)}
        </span>
      </div>

      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* Grid Background */}
          <rect x={padding} y={padding} width={graphSize} height={graphSize} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          
          {/* AUC Filled Area */}
          <path d={areaPath} fill="#eff6ff" stroke="none" />
          
          {/* Axis Labels */}
          <text x={size / 2} y={size + 15} textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">False Positive Rate (FPR)</text>
          <text x={10} y={size / 2} textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold" transform={`rotate(-90, 10, ${size / 2})`}>True Positive Rate (TPR)</text>

          {/* Random Guess Line (Diagonal) */}
          <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
          <text x={size/2 + 10} y={size/2 - 10} fontSize="9" fill="#94a3b8" transform={`rotate(-45, ${size/2}, ${size/2})`}>Rastgele</text>

          {/* Connected Linear Line (Model Performance Curve Approximation) */}
          <path d={`M ${startX} ${startY} L ${x} ${y} L ${endX} ${endY}`} fill="none" stroke="#3b82f6" strokeWidth="2" />

          {/* Current Model Point */}
          <circle cx={x} cy={y} r="6" fill="#3b82f6" stroke="white" strokeWidth="2" className="shadow-lg filter drop-shadow-md transition-all duration-500" />
          
          {/* Guidelines to axes */}
          <line x1={x} y1={y} x2={x} y2={size-padding} stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
          <line x1={x} y1={y} x2={padding} y2={y} stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
        </svg>

        {/* Labels for Point */}
        <div className="absolute top-0 right-0 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-100 shadow-sm">
          <div>TPR: %{(tpr * 100).toFixed(0)}</div>
          <div>FPR: %{(fpr * 100).toFixed(0)}</div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-slate-500 text-center w-full">
        <div className="flex justify-around items-center">
          <div>
             <span className="block font-bold text-slate-700 text-lg">{auc.toFixed(2)}</span>
             AUC Değeri
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="text-left">
            <span className="block text-slate-700 font-medium">İdeal:</span>
            Sol Üst Köşe
          </div>
        </div>
      </div>
    </div>
  );
};