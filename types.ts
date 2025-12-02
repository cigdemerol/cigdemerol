export interface MatrixValues {
  tp: number; // True Positive
  tn: number; // True Negative
  fp: number; // False Positive
  fn: number; // False Negative
}

export interface Metrics {
  accuracy: number;
  precision: number;
  recall: number; // Same as TPR
  f1Score: number;
  specificity: number; // 1 - FPR
  fpr: number; // False Positive Rate
  tpr: number; // True Positive Rate
  auc: number; // Area Under Curve
  total: number;
}

export enum ScenarioType {
  BALANCED_GOOD = 'BALANCED_GOOD',
  IMBALANCED_ACCURACY_TRAP = 'IMBALANCED_ACCURACY_TRAP',
  HIGH_PRECISION_NEEDED = 'HIGH_PRECISION_NEEDED',
  HIGH_RECALL_NEEDED = 'HIGH_RECALL_NEEDED'
}