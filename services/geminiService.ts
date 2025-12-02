import { GoogleGenAI } from "@google/genai";
import { MatrixValues, Metrics } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAnalysis = async (matrix: MatrixValues, metrics: Metrics): Promise<string> => {
  try {
    const positiveCount = matrix.tp + matrix.fn;
    const negativeCount = matrix.tn + matrix.fp;
    const posRatio = metrics.total > 0 ? positiveCount / metrics.total : 0;
    
    let balanceContext = "Veri seti dengeli görünüyor.";
    if (posRatio < 0.3 || posRatio > 0.7) balanceContext = "Veri seti dengesiz (imbalanced).";
    if (posRatio < 0.1 || posRatio > 0.9) balanceContext = "Veri seti aşırı dengesiz.";

    const prompt = `
      Sen bir Makine Öğrenmesi (Machine Learning) profesörüsün. Karşında lisans öğrencileri var.
      Aşağıdaki Confusion Matrix (Karmaşıklık Matrisi) değerlerine ve hesaplanan metriklere dayanarak, 
      bu modelin durumunu öğrencilerinin anlayacağı basit ve net bir dille Türkçe olarak yorumla.
      
      Veri Seti Durumu:
      - Toplam Veri: ${metrics.total}
      - Pozitif Sınıf (Karar Değişkeni 1): ${positiveCount} adet
      - Negatif Sınıf (Karar Değişkeni 0): ${negativeCount} adet
      - Denge Durumu: ${balanceContext}

      Confusion Matrix:
      - True Positive (Doğru Pozitif): ${matrix.tp}
      - True Negative (Doğru Negatif): ${matrix.tn}
      - False Positive (Yanlış Pozitif): ${matrix.fp}
      - False Negative (Yanlış Negatif): ${matrix.fn}
      
      Metrikler:
      - Accuracy (Doğruluk): %${(metrics.accuracy * 100).toFixed(2)}
      - Precision (Kesinlik): %${(metrics.precision * 100).toFixed(2)}
      - Recall (Duyarlılık / TPR): %${(metrics.recall * 100).toFixed(2)}
      - False Positive Rate (FPR): %${(metrics.fpr * 100).toFixed(2)}
      - F1 Score: %${(metrics.f1Score * 100).toFixed(2)}
      - AUC (Area Under Curve): ${metrics.auc.toFixed(2)}
      
      Lütfen şunlara odaklan:
      1. Model genel olarak başarılı mı? AUC değeri (${metrics.auc.toFixed(2)}) ve ROC konumu (TPR: ${metrics.tpr.toFixed(2)}, FPR: ${metrics.fpr.toFixed(2)}) ne ifade ediyor?
      2. Veri seti dengesi göz önüne alındığında Accuracy yanıltıcı mı?
      3. Karar değişkeninin dağılımı (Pozitif/Negatif oranı) modelin öğrenmesini nasıl etkilemiş?
      4. Hangi hata türü (Tip 1 vs Tip 2) daha kritik? (Kısa bir senaryo ile örneklendir)
      
      Cevabını maksimum 3 kısa paragraf ve madde işaretleri kullanarak, akademik ama anlaşılır bir dille yaz.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analiz alınamadı.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Şu anda yapay zeka analizi yapılamıyor. Lütfen API anahtarınızı kontrol edin veya daha sonra tekrar deneyin.";
  }
};