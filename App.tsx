import React, { useState, useEffect, useCallback } from 'react';
import { MatrixValues, Metrics, ScenarioType } from './types';
import { MetricCard } from './components/MetricCard';
import { RocCurve } from './components/RocCurve';
import { DatasetBalance } from './components/DatasetBalance';
import { getAIAnalysis } from './services/geminiService';
import { Brain, RefreshCw, ChevronRight, Calculator, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const App: React.FC = () => {
  // Initial State: Balanced, decent model
  const [matrix, setMatrix] = useState<MatrixValues>({
    tp: 50,
    tn: 40,
    fp: 10,
    fn: 5
  });

  const [metrics, setMetrics] = useState<Metrics>({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    specificity: 0,
    fpr: 0,
    tpr: 0,
    auc: 0,
    total: 0
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string>("");

  // Calculate metrics whenever matrix changes
  useEffect(() => {
    const { tp, tn, fp, fn } = matrix;
    const total = tp + tn + fp + fn;
    
    // Core Metrics
    const accuracy = total === 0 ? 0 : (tp + tn) / total;
    const precision = (tp + fp) === 0 ? 0 : tp / (tp + fp);
    const recall = (tp + fn) === 0 ? 0 : tp / (tp + fn); // Same as TPR
    const f1Score = (precision + recall) === 0 ? 0 : 2 * (precision * recall) / (precision + recall);
    
    // Advanced / ROC Metrics
    const specificity = (tn + fp) === 0 ? 0 : tn / (tn + fp);
    const fpr = (tn + fp) === 0 ? 0 : fp / (tn + fp); // 1 - Specificity
    const tpr = recall;

    // AUC Calculation (Trapezoidal rule for single point: (1 + TPR - FPR) / 2)
    const auc = (1 + tpr - fpr) / 2;

    setMetrics({
      accuracy,
      precision,
      recall,
      f1Score,
      specificity,
      fpr,
      tpr,
      auc,
      total
    });
    
  }, [matrix]);

  const handleInputChange = (field: keyof MatrixValues, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setMatrix(prev => ({ ...prev, [field]: numValue }));
  };

  const applyScenario = (type: ScenarioType) => {
    setAiExplanation(""); // Clear old explanation
    switch (type) {
      case ScenarioType.BALANCED_GOOD:
        setMatrix({ tp: 80, tn: 85, fp: 10, fn: 10 });
        break;
      case ScenarioType.IMBALANCED_ACCURACY_TRAP:
        // Classic example: 95 negatives, 5 positives. Model predicts everything negative.
        // Accuracy high (95%), but Recall is 0%.
        setMatrix({ tp: 0, tn: 95, fp: 0, fn: 5 }); 
        break;
      case ScenarioType.HIGH_PRECISION_NEEDED:
        // E.g. Spam filter: Better to miss a spam (FN) than to delete a real email (FP).
        setMatrix({ tp: 30, tn: 60, fp: 2, fn: 20 });
        break;
      case ScenarioType.HIGH_RECALL_NEEDED:
        // E.g. Cancer detection: Better to have false alarm (FP) than miss a case (FN).
        setMatrix({ tp: 50, tn: 20, fp: 40, fn: 2 });
        break;
    }
  };

  const handleAIAnalysis = async () => {
    setAiLoading(true);
    const result = await getAIAnalysis(matrix, metrics);
    setAiExplanation(result);
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-lg text-white shadow-lg">
              <Calculator size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Makine Öğrenmesi Metrik Simülatörü</h1>
              <p className="text-slate-500">Confusion Matrix, ROC Eğrisi ve Veri Dengesi Simülasyonu</p>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Controls & Matrix */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Scenarios */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Örnek Senaryolar</h2>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => applyScenario(ScenarioType.BALANCED_GOOD)} className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors text-left">
                  ✅ Dengeli & Başarılı
                </button>
                <button onClick={() => applyScenario(ScenarioType.IMBALANCED_ACCURACY_TRAP)} className="text-xs px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-md transition-colors text-left border border-orange-100">
                  ⚠️ Doğruluk Tuzağı (Dengesiz)
                </button>
                <button onClick={() => applyScenario(ScenarioType.HIGH_PRECISION_NEEDED)} className="text-xs px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors text-left">
                  📧 Spam Filtresi (Yüksek Precision)
                </button>
                <button onClick={() => applyScenario(ScenarioType.HIGH_RECALL_NEEDED)} className="text-xs px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors text-left">
                  🏥 Hastalık Teşhisi (Yüksek Recall)
                </button>
              </div>
            </div>

            {/* Matrix Input */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">Confusion Matrix</h2>
                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">N={metrics.total}</span>
              </div>

              {/* The Grid Visualization */}
              <div className="relative">
                {/* Labels */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-semibold text-slate-500">Tahmin (Prediction)</div>
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-semibold text-slate-500 whitespace-nowrap">Gerçek (Actual)</div>

                <div className="grid grid-cols-2 gap-4 ml-6 mt-2">
                  
                  {/* TP */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex flex-col items-center relative group transition-all hover:border-green-400">
                    <div className="absolute top-2 left-2 flex items-center gap-1 text-green-700 text-xs font-bold uppercase">
                      <CheckCircle2 size={12} /> TP
                    </div>
                    <label className="text-xs text-green-600 mb-1 font-medium">Doğru Pozitif</label>
                    <input 
                      type="number" 
                      value={matrix.tp} 
                      onChange={(e) => handleInputChange('tp', e.target.value)}
                      className="w-full text-center text-3xl font-bold bg-transparent text-green-800 focus:outline-none focus:ring-2 focus:ring-green-300 rounded"
                    />
                  </div>

                  {/* FN - Type 2 Error */}
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex flex-col items-center relative group transition-all hover:border-red-400">
                     <div className="absolute top-2 left-2 flex items-center gap-1 text-red-700 text-xs font-bold uppercase">
                      <AlertTriangle size={12} /> FN
                    </div>
                    <label className="text-xs text-red-600 mb-1 font-medium">Yanlış Negatif</label>
                    <input 
                      type="number" 
                      value={matrix.fn} 
                      onChange={(e) => handleInputChange('fn', e.target.value)}
                      className="w-full text-center text-3xl font-bold bg-transparent text-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
                    />
                  </div>

                  {/* FP - Type 1 Error */}
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex flex-col items-center relative group transition-all hover:border-red-400">
                    <div className="absolute top-2 left-2 flex items-center gap-1 text-red-700 text-xs font-bold uppercase">
                      <AlertTriangle size={12} /> FP
                    </div>
                    <label className="text-xs text-red-600 mb-1 font-medium">Yanlış Pozitif</label>
                    <input 
                      type="number" 
                      value={matrix.fp} 
                      onChange={(e) => handleInputChange('fp', e.target.value)}
                      className="w-full text-center text-3xl font-bold bg-transparent text-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
                    />
                  </div>

                  {/* TN */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex flex-col items-center relative group transition-all hover:border-green-400">
                    <div className="absolute top-2 left-2 flex items-center gap-1 text-green-700 text-xs font-bold uppercase">
                      <CheckCircle2 size={12} /> TN
                    </div>
                    <label className="text-xs text-green-600 mb-1 font-medium">Doğru Negatif</label>
                    <input 
                      type="number" 
                      value={matrix.tn} 
                      onChange={(e) => handleInputChange('tn', e.target.value)}
                      className="w-full text-center text-3xl font-bold bg-transparent text-green-800 focus:outline-none focus:ring-2 focus:ring-green-300 rounded"
                    />
                  </div>

                </div>
              </div>
            </div>

             {/* Dataset Balance (New) */}
             <DatasetBalance 
               positiveCount={matrix.tp + matrix.fn}
               negativeCount={matrix.tn + matrix.fp}
               total={metrics.total}
             />

          </div>

          {/* Right Column: Metrics Dashboard */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard 
                title="Accuracy"
                value={metrics.accuracy}
                formula="(TP+TN)/N"
                description="Doğruluk oranı. Dengesiz veri setlerinde yanıltıcıdır."
                colorClass="text-blue-600"
              />
              <MetricCard 
                title="Precision"
                value={metrics.precision}
                formula="TP/(TP+FP)"
                description="Pozitif tahminlerin ne kadarı doğru?"
                colorClass="text-purple-600"
              />
              <MetricCard 
                title="Recall"
                value={metrics.recall}
                formula="TP/(TP+FN)"
                description="Gerçek pozitiflerin ne kadarı yakalandı?"
                colorClass="text-orange-600"
              />
              <MetricCard 
                title="F1 Score"
                value={metrics.f1Score}
                formula="Harmonik Ort."
                description="Precision ve Recall dengesi."
                colorClass="text-teal-600"
              />
            </div>

            {/* Middle Section: ROC & Visual Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ROC Curve Component */}
              <RocCurve tpr={metrics.tpr} fpr={metrics.fpr} auc={metrics.auc} />

              {/* Visual Explanation Panel */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 mb-4">Metrik Özeti</h3>
                  <div className="space-y-4">
                    <div className="pt-2">
                      <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                        <strong className="text-slate-900 block mb-1">Doğruluk Analizi:</strong>
                        Modeliniz <span className="font-bold">{metrics.total}</span> veriden <span className="font-bold text-green-600">{matrix.tp + matrix.tn}</span> tanesini doğru bildi.
                        (%{(metrics.accuracy * 100).toFixed(1)})
                      </p>
                      
                      <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                         <strong className="text-slate-900 block mb-1">Hata Analizi:</strong>
                         Tip 1 Hata (FP): <span className="text-red-600 font-bold">{matrix.fp}</span> adet (Yalancı Alarm)<br/>
                         Tip 2 Hata (FN): <span className="text-red-600 font-bold">{matrix.fn}</span> adet (Kaçırılan Fırsat)
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Analysis Button Area */}
                <div className="mt-4">
                   <button 
                    onClick={handleAIAnalysis}
                    disabled={aiLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? (
                      <RefreshCw className="animate-spin" size={20} />
                    ) : (
                      <Brain size={20} />
                    )}
                    {aiLoading ? 'Analiz Ediliyor...' : 'Yapay Zeka ile Analiz Et'}
                  </button>
                </div>
              </div>
            </div>

             {/* AI Explanation Result (Full Width) */}
             {aiExplanation && (
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl animate-fade-in shadow-inner">
                <h3 className="text-indigo-900 font-bold mb-3 flex items-center gap-2 text-lg">
                  <Brain size={24} /> Prof. AI Yorumu
                </h3>
                <div className="prose prose-slate text-indigo-900 leading-relaxed whitespace-pre-line max-w-none">
                  {aiExplanation}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;