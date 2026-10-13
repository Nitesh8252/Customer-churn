import React from 'react';
import {
  Users,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AllMetricsResponse, CustomerRecord } from '../types.ts';

interface DashboardViewProps {
  metrics: AllMetricsResponse | null;
  customers: CustomerRecord[];
  onNavigate: (tab: string) => void;
  onSelectCustomer: (customer: CustomerRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  customers,
  onNavigate,
  onSelectCustomer,
}) => {
  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const { datasetCharacteristics, ensemble } = metrics;

  // Calculate cohort counts
  const highRiskCustomers = customers.filter((c) => c.riskTier === 'High');
  const mediumRiskCustomers = customers.filter((c) => c.riskTier === 'Medium');
  const lowRiskCustomers = customers.filter((c) => c.riskTier === 'Low');

  // Revenue at risk (Monthly charges sum of High Risk customers)
  const monthlyRevenueAtRisk = highRiskCustomers.reduce((acc, c) => acc + c.MonthlyCharges, 0);

  // Contract churn breakdown
  const contractStats = [
    { name: 'Month-to-month', total: 0, churned: 0 },
    { name: 'One year', total: 0, churned: 0 },
    { name: 'Two year', total: 0, churned: 0 },
  ];
  customers.forEach((c) => {
    const item = contractStats.find((s) => s.name === c.Contract);
    if (item) {
      item.total++;
      if (c.Churn === 'Yes') item.churned++;
    }
  });
  const contractChartData = contractStats.map((s) => ({
    contract: s.name,
    churnRate: s.total > 0 ? Math.round((s.churned / s.total) * 100) : 0,
    total: s.total,
  }));

  // Internet service churn breakdown
  const internetStats = [
    { name: 'Fiber optic', total: 0, churned: 0 },
    { name: 'DSL', total: 0, churned: 0 },
    { name: 'No Internet', total: 0, churned: 0 },
  ];
  customers.forEach((c) => {
    const key = c.InternetService === 'No' ? 'No Internet' : c.InternetService;
    const item = internetStats.find((s) => s.name === key);
    if (item) {
      item.total++;
      if (c.Churn === 'Yes') item.churned++;
    }
  });
  const internetChartData = internetStats.map((s) => ({
    service: s.name,
    churnRate: s.total > 0 ? Math.round((s.churned / s.total) * 100) : 0,
  }));

  // Risk distribution pie data
  const riskPieData = [
    { name: 'Low Risk (<35%)', value: lowRiskCustomers.length, color: '#10b981' },
    { name: 'Medium Risk (35-65%)', value: mediumRiskCustomers.length, color: '#f59e0b' },
    { name: 'High Risk (>65%)', value: highRiskCustomers.length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Production-Calibrated Machine Learning Ensemble</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Customer Churn Early Detection Framework
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Synthesizing Logistic Regression, CART Decision Trees, and Gradient Boosting into a high-precision soft-voting ensemble for proactive retention in subscription service industries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('models')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition-all"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Inspect Models</span>
            </button>
            <button
              onClick={() => onNavigate('predictor')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Test Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monitored Accounts */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Customer Base</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {datasetCharacteristics.totalSamples.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-medium">accounts</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Historical Churn Rate:{' '}
            <span className="text-rose-400 font-semibold">{datasetCharacteristics.churnRate}%</span>
          </p>
        </div>

        {/* Ensemble Accuracy & AUC */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Ensemble Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {ensemble.accuracy}%
            </span>
            <span className="text-xs text-emerald-400 font-medium">AUC {ensemble.auc}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            F1-Score: <span className="text-slate-200 font-semibold">{ensemble.f1}%</span> (Precision {ensemble.precision}%)
          </p>
        </div>

        {/* High Risk Accounts */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>High Risk Accounts</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-400">
              {highRiskCustomers.length}
            </span>
            <span className="text-xs text-rose-300 font-medium">
              ({datasetCharacteristics.highRiskPercentage}% of base)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Predicted probability &gt; 65%</p>
        </div>

        {/* Monthly Revenue at Risk */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Monthly MRR At Risk</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              ${Math.round(monthlyRevenueAtRisk).toLocaleString()}
            </span>
            <span className="text-xs text-amber-400 font-medium">/mo</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Annualized: <span className="text-amber-300 font-semibold">${Math.round(monthlyRevenueAtRisk * 12).toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Risk Tier Cohorts</h3>
                <p className="text-xs text-slate-400">Predicted customer probability breakdown</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-4 border-t border-slate-800/80 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Low Risk (&lt;35%)</span>
              </span>
              <span className="font-semibold text-white">{lowRiskCustomers.length} ({Math.round((lowRiskCustomers.length/customers.length)*100)}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Medium Risk (35-65%)</span>
              </span>
              <span className="font-semibold text-white">{mediumRiskCustomers.length} ({Math.round((mediumRiskCustomers.length/customers.length)*100)}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>High Risk (&gt;65%)</span>
              </span>
              <span className="font-semibold text-white">{highRiskCustomers.length} ({Math.round((highRiskCustomers.length/customers.length)*100)}%)</span>
            </div>
          </div>
        </div>

        {/* Churn Rate by Contract Commitment */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Contract Vulnerability</h3>
              <p className="text-xs text-slate-400">Churn rate by commitment structure</p>
            </div>
            <TrendingDown className="w-5 h-5 text-rose-400" />
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contractChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="contract" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} unit="%" tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Churn Rate']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="churnRate" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 mt-2">
            <span className="text-amber-400 font-semibold">Insight:</span> Month-to-month contracts have nearly 4x higher churn vulnerability than multi-year commitments.
          </div>
        </div>

        {/* Churn Rate by Service Type */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Service Type Churn</h3>
              <p className="text-xs text-slate-400">Churn rate by internet connectivity</p>
            </div>
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={internetChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="service" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} unit="%" tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Churn Rate']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="churnRate" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 mt-2">
            <span className="text-sky-400 font-semibold">Insight:</span> Fiber customers face elevated expectations; absence of dedicated tech support drives churn.
          </div>
        </div>
      </div>

      {/* Imminent High Risk Accounts Table Preview */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <h3 className="text-base font-semibold text-white">Immediate Intervention Targets</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Top accounts requiring proactive retention outreach</p>
          </div>

          <button
            onClick={() => onNavigate('customers')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>View All 1,000 Accounts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-medium">Customer ID</th>
                <th className="py-3 px-4 font-medium">Tenure</th>
                <th className="py-3 px-4 font-medium">Contract</th>
                <th className="py-3 px-4 font-medium">Internet</th>
                <th className="py-3 px-4 font-medium">Monthly Charge</th>
                <th className="py-3 px-4 font-medium">Predicted Risk</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {highRiskCustomers.slice(0, 6).map((c) => (
                <tr key={c.customerID} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-indigo-300">{c.customerID}</td>
                  <td className="py-3 px-4 text-slate-300">{c.tenure} mo</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 font-medium">
                      {c.Contract}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{c.InternetService}</td>
                  <td className="py-3 px-4 font-semibold text-slate-200">${c.MonthlyCharges.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-rose-500 h-1.5 rounded-full"
                          style={{ width: `${Math.round((c.predictedProbability ?? 0.8) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-rose-400">
                        {Math.round((c.predictedProbability ?? 0.8) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectCustomer(c)}
                      className="px-2.5 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 font-medium transition-all"
                    >
                      Audit &amp; Advise
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
