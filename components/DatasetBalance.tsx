import React from 'react';
import { InfoTooltip } from './InfoTooltip';

interface DatasetBalanceProps {
  positiveCount: number; // TP + FN
  negativeCount: number; // TN + FP
  total: number;
}

export const DatasetBalance: React.FC<DatasetBalanceProps> = ({ positiveCount, negativeCount, total }) => {
  const posRatio = total === 0 ? 0 : positiveCount / total;
  const negRatio = total === 0 ? 0 : negativeCount / total;
  
  // Determine balance status
  let statusText = "Dengeli";
  let statusColor = "bg-green-100 text-green-700 border-green-200";
  
  if (posRatio < 0.3 || posRatio > 0.7) {
    statusText = "Dengesiz";
    statusColor = "bg-orange-100 text-orange-700 border-orange-200";
  }
  
  if (posRatio < 0.1 || posRatio > 0.9) {
    statusText = "Aşırı Dengesiz";
    statusColor = "bg-red-100 text-red-700 border-red-200";
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center">
          Veri Seti Dengesi
          <InfoTooltip text="Karar değişkeninin (sınıfların) dağılımını gösterir. Dengesiz veri setlerinde Accuracy metriği yanıltıcı olabilir." />
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full font-bold border ${statusColor}`}>
          {statusText}
        </span>
      </div>

      <div className="space-y-5">
        {/* Decision Variable 1: Positive */}
        <div className="relative">
          <div className="flex justify-between text-sm mb-1">
            <div>
              <span className="font-bold text-slate-800">Sınıf 1: Pozitif (Positive)</span>
              <span className="block text-xs text-slate-500">Hedeflenen Durum (Aranan Özellik)</span>
            </div>
            <div className="text-right">
              <span className="font-bold block text-blue-600">{positiveCount}</span>
              <span className="text-xs text-slate-400">%{(posRatio * 100).toFixed(1)}</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${posRatio * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-1 italic">
            Örn: Hasta (Tıp), Spam (Email), Kaçak (Finans), Yangın (Alarm)
          </p>
        </div>

        {/* Decision Variable 0: Negative */}
        <div className="relative">
           <div className="flex justify-between text-sm mb-1">
            <div>
              <span className="font-bold text-slate-800">Sınıf 0: Negatif (Negative)</span>
              <span className="block text-xs text-slate-500">Normal Durum (Olağan)</span>
            </div>
            <div className="text-right">
              <span className="font-bold block text-slate-600">{negativeCount}</span>
              <span className="text-xs text-slate-400">%{(negRatio * 100).toFixed(1)}</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-slate-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${negRatio * 100}%` }}
            ></div>
          </div>
           <p className="text-xs text-slate-400 mt-1 italic">
            Örn: Sağlıklı, Normal Posta, Yasal İşlem, Güvenli
          </p>
        </div>
      </div>
    </div>
  );
};