export interface CustomerRecord {
  customerID: string;
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  tenure: number;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
  Churn: string;
  // Computed risk if evaluated
  predictedProbability?: number;
  riskTier?: 'Low' | 'Medium' | 'High';
}

export type CustomerProfile = Omit<CustomerRecord, 'customerID' | 'Churn' | 'predictedProbability' | 'riskTier'>;

export interface ConfusionMatrix {
  tn: number;
  fp: number;
  fn: number;
  tp: number;
}

export interface RocPoint {
  fpr: number;
  tpr: number;
  threshold: number;
}

export interface ModelMetrics {
  name: string;
  description: string;
  accuracy: number; // in %
  precision: number; // in %
  recall: number; // in %
  f1: number; // in %
  auc: number;
  weightInEnsemble?: number;
  confusionMatrix: ConfusionMatrix;
  rocCurve: RocPoint[];
}

export interface DatasetCharacteristics {
  totalSamples: number;
  trainSamples: number;
  testSamples: number;
  churnRate: number; // in %
  averageTenure: number;
  averageMonthlyCharges: number;
  highRiskPercentage: number;
}

export interface FeatureImportance {
  feature: string;
  label: string;
  importance: number; // 0 to 1
  impact: 'positive' | 'negative';
  description: string;
}

export interface AllMetricsResponse {
  logisticRegression: ModelMetrics;
  decisionTree: ModelMetrics;
  gradientBoosting: ModelMetrics;
  ensemble: ModelMetrics;
  datasetCharacteristics: DatasetCharacteristics;
  featureImportances: FeatureImportance[];
}

export interface PredictionBreakdown {
  logisticRegression: number;
  decisionTree: number;
  gradientBoosting: number;
}

export interface PipelineStageResult {
  id: string;
  name: string;
  stageType: 'ingestion' | 'preprocessing' | 'ensemble_scoring' | 'calibration' | 'prescriptive_rules';
  status: 'completed' | 'active' | 'pending';
  durationMs: number;
  description: string;
  inputDataSummary: string;
  outputDataSummary: string;
  metadata?: Record<string, any>;
}

export interface PipelineExecutionTrace {
  pipelineId: string;
  timestamp: string;
  totalDurationMs: number;
  stages: PipelineStageResult[];
  transformedVector: number[];
  ensembleWeights: {
    logisticRegression: number;
    decisionTree: number;
    gradientBoosting: number;
  };
}

export interface PredictionResponse {
  probability: number;
  churnPrediction: 'Yes' | 'No';
  riskTier: 'Low' | 'Medium' | 'High';
  confidence: number;
  modelBreakdown: PredictionBreakdown;
  topRiskFactors: string[];
  mitigationSuggestions: string[];
  pipelineTrace?: PipelineExecutionTrace;
}

export interface PrescriptivePlan {
  summary: string;
  riskAssessment: string;
  immediateInterventions: string[];
  longTermStrategies: string[];
  recommendedOffer: string;
  expectedChurnReduction: string;
  triggeredRules: string[];
  pipelineOrigin: string;
}
