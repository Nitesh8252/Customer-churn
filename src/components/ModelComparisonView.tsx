import React, { useState } from 'react';
import {
  Layers,
  Award,
  CheckCircle,
  HelpCircle,
  Activity,
  LineChart as LineChartIcon,
  ShieldCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AllMetricsResponse, ModelMetrics } from '../types.ts';

interface ModelComparisonViewProps {
  metrics: AllMetricsResponse | null;
}

export const ModelComparisonView: React.FC<ModelComparisonViewProps> = ({ metrics }) => {
  const [selectedModelKey, setSelectedModelKey] = useState<string>('ensemble');

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const { logisticRegression, decisionTree, gradientBoosting, ensemble } = metrics;

  const modelsList: { key: string; data: ModelMetrics; badgeColor: string; weight: string }[] = [
    {
      key: 'logisticRegression',
      data: logisticRegression,
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      weight: '35% weight',
    },
    {
      key: 'decisionTree',
      data: decisionTree,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      weight: '30% weight',
    },
    {
      key: 'gradientBoosting',
      data: gradientBoosting,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      weight: '35% weight',
    },
    {
      key: 'ensemble',
      data: ensemble,
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      weight: 'Champion Blended',
    },
  ];

  // Merge ROC data for side-by-side plotting
  const rocPlotData = ensemble.rocCurve.map((pt, i) => ({
    fpr: pt.fpr,
    ensemble: pt.tpr,
    logisticRegression: logisticRegression.rocCurve[i]?.tpr ?? pt.tpr,
    decisionTree: decisionTree.rocCurve[i]?.tpr ?? pt.tpr,
    gradientBoosting: gradientBoosting.rocCurve[i]?.tpr ?? pt.tpr,
    randomBaseline: pt.fpr,
  }));

  const activeModel =
    selectedModelKey === 'ensemble'
      ? ensemble
      : selectedModelKey === 'logisticRegression'
      ? logisticRegression
      : selectedModelKey === 'decisionTree'
      ? decisionTree
      : gradientBoosting;

  const cm = activeModel.confusionMatrix;
  const totalCases = cm.tp + cm.tn + cm.fp + cm.fn;
  const specificity = cm.tn + cm.fp > 0 ? Math.round((cm.tn / (cm.tn + cm.fp)) * 100) : 0;
  const sensitivity = activeModel.recall;

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Introduction */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          <span>Cross-Model Benchmark &amp; Validation</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Ensemble Learning vs. Individual Sub-Models
        </h2>
        <p className="text-sm text-slate-300 max-w-3xl">
          By unifying regularized linear probabilities (Logistic Regression), orthogonal partition boundaries (Decision Tree), and residual-minimizing additive stumps (Gradient Boosting), the Ensemble achieves superior generalization on unseen customer cohorts.
        </p>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modelsList.map((m) => {
          const isSelected = selectedModelKey === m.key;
          const isEnsemble = m.key === 'ensemble';
          return (
            <div
              key={m.key}
              onClick={() => setSelectedModelKey(m.key)}
              className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${m.badgeColor}`}>
                  {m.weight}
                </span>
                {isEnsemble && <Award className="w-4 h-4 text-amber-400" />}
              </div>

              <h3 className="text-base font-semibold text-white">{m.data.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{m.data.description}</p>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Accuracy</span>
                  <span className="text-lg font-bold text-white">{m.data.accuracy}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">AUC-ROC</span>
                  <span className="text-lg font-bold text-indigo-400">{m.data.auc}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">F1-Score</span>
                  <span className="text-sm font-semibold text-slate-200">{m.data.f1}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Recall</span>
                  <span className="text-sm font-semibold text-emerald-400">{m.data.recall}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Comparison Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Model Metrics Matrix (Test Set Validation)</h3>
            <p className="text-xs text-slate-400">Evaluated on a 20% hold-out test split (200 records)</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            Ensemble Leads in AUC &amp; F1
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Algorithm</th>
                <th className="py-3.5 px-4 font-semibold">Paradigm</th>
                <th className="py-3.5 px-4 font-semibold">Accuracy</th>
                <th className="py-3.5 px-4 font-semibold">Precision</th>
                <th className="py-3.5 px-4 font-semibold">Recall</th>
                <th className="py-3.5 px-4 font-semibold">F1-Score</th>
                <th className="py-3.5 px-4 font-semibold">AUC-ROC</th>
                <th className="py-3.5 px-4 font-semibold">Ensemble Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-5 font-semibold text-blue-300">Logistic Regression</td>
                <td className="py-3.5 px-4 text-slate-300">Generalized Linear / Logit</td>
                <td className="py-3.5 px-4 font-medium text-white">{logisticRegression.accuracy}%</td>
                <td className="py-3.5 px-4 text-slate-300">{logisticRegression.precision}%</td>
                <td className="py-3.5 px-4 text-slate-300">{logisticRegression.recall}%</td>
                <td className="py-3.5 px-4 text-slate-300">{logisticRegression.f1}%</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-blue-400">{logisticRegression.auc}</td>
                <td className="py-3.5 px-4 text-slate-400">Calibrated linear log-odds (35%)</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-5 font-semibold text-emerald-300">Decision Tree (CART)</td>
                <td className="py-3.5 px-4 text-slate-300">Gini Recursive Splitting</td>
                <td className="py-3.5 px-4 font-medium text-white">{decisionTree.accuracy}%</td>
                <td className="py-3.5 px-4 text-slate-300">{decisionTree.precision}%</td>
                <td className="py-3.5 px-4 text-slate-300">{decisionTree.recall}%</td>
                <td className="py-3.5 px-4 text-slate-300">{decisionTree.f1}%</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">{decisionTree.auc}</td>
                <td className="py-3.5 px-4 text-slate-400">Non-linear feature thresholding (30%)</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-5 font-semibold text-amber-300">Gradient Boosting</td>
                <td className="py-3.5 px-4 text-slate-300">Sequential Residual Minimization</td>
                <td className="py-3.5 px-4 font-medium text-white">{gradientBoosting.accuracy}%</td>
                <td className="py-3.5 px-4 text-slate-300">{gradientBoosting.precision}%</td>
                <td className="py-3.5 px-4 text-slate-300">{gradientBoosting.recall}%</td>
                <td className="py-3.5 px-4 text-slate-300">{gradientBoosting.f1}%</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-amber-400">{gradientBoosting.auc}</td>
                <td className="py-3.5 px-4 text-slate-400">Adaptive hard-example corrections (35%)</td>
              </tr>
              <tr className="bg-indigo-950/20 hover:bg-indigo-950/30 font-semibold border-t-2 border-indigo-500/40">
                <td className="py-4 px-5 text-indigo-300 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-indigo-400 inline" />
                  <span>Ensemble Soft Voting</span>
                </td>
                <td className="py-4 px-4 text-indigo-200">Weighted Blended Framework</td>
                <td className="py-4 px-4 text-emerald-400 font-bold">{ensemble.accuracy}%</td>
                <td className="py-4 px-4 text-indigo-200">{ensemble.precision}%</td>
                <td className="py-4 px-4 text-indigo-200">{ensemble.recall}%</td>
                <td className="py-4 px-4 text-indigo-200">{ensemble.f1}%</td>
                <td className="py-4 px-4 font-mono font-extrabold text-indigo-300">{ensemble.auc}</td>
                <td className="py-4 px-4 text-indigo-300">Optimally weighted champion</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ROC Curves Chart & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROC Curves Plot */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">ROC Characteristics (Receiver Operating Curve)</h3>
              <p className="text-xs text-slate-400">True Positive Rate vs. False Positive Rate across thresholds</p>
            </div>
            <LineChartIcon className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocPlotData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis
                  dataKey="fpr"
                  stroke="#64748b"
                  fontSize={11}
                  domain={[0, 1]}
                  unit=""
                  label={{ value: 'False Positive Rate (FPR)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  domain={[0, 1]}
                  label={{ value: 'True Positive Rate (TPR)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '11px',
                  }}
                />
                <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="ensemble"
                  name="Ensemble (AUC 0.854)"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="gradientBoosting"
                  name="Gradient Boosting"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="logisticRegression"
                  name="Logistic Reg."
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="decisionTree"
                  name="Decision Tree"
                  stroke="#10b981"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  dot={false}
                />
                <Line
                  type="linear"
                  dataKey="randomBaseline"
                  name="Random Baseline (AUC 0.50)"
                  stroke="#475569"
                  strokeWidth={1}
                  strokeDasharray="6 6"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confusion Matrix Visualizer */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-semibold text-white">Confusion Matrix Visualizer</h3>
                <p className="text-xs text-slate-400">
                  Showing classification performance for: <span className="text-indigo-400 font-semibold">{activeModel.name}</span>
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            {/* Model Selector Pill */}
            <div className="flex flex-wrap gap-1.5 my-3">
              {modelsList.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setSelectedModelKey(m.key)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    selectedModelKey === m.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {m.data.name}
                </button>
              ))}
            </div>

            {/* Matrix 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* True Negative */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
                  <span className="font-semibold">True Negatives (TN)</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-300">{cm.tn}</div>
                <p className="text-[11px] text-slate-400 mt-1">Correctly identified Loyal customers</p>
              </div>

              {/* False Positive */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
                  <span className="font-semibold">False Positives (FP)</span>
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-300">{cm.fp}</div>
                <p className="text-[11px] text-slate-400 mt-1">Loyal customers flagged as Churn (Type I)</p>
              </div>

              {/* False Negative */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <div className="flex items-center justify-between text-xs text-rose-400 mb-1">
                  <span className="font-semibold">False Negatives (FN)</span>
                  <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="text-2xl font-black text-rose-300">{cm.fn}</div>
                <p className="text-[11px] text-slate-400 mt-1">Missed Churners (Type II Risk)</p>
              </div>

              {/* True Positive */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                <div className="flex items-center justify-between text-xs text-indigo-400 mb-1">
                  <span className="font-semibold">True Positives (TP)</span>
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-indigo-300">{cm.tp}</div>
                <p className="text-[11px] text-slate-400 mt-1">Accurately captured churners</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400">Specificity (True Negative Rate):</span>
              <span className="ml-2 font-bold text-emerald-400">{specificity}%</span>
            </div>
            <div>
              <span className="text-slate-400">Sensitivity (True Positive Rate):</span>
              <span className="ml-2 font-bold text-indigo-400">{sensitivity}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
