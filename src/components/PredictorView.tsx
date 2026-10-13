import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Bot,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  Percent,
} from 'lucide-react';
import { CustomerProfile, PredictionResponse, AIAdvisorRecommendation } from '../types.ts';

interface PredictorViewProps {
  initialProfile?: Partial<CustomerProfile>;
}

const DEFAULT_PROFILE: CustomerProfile = {
  gender: 'Female',
  SeniorCitizen: 0,
  Partner: 'No',
  Dependents: 'No',
  tenure: 2,
  PhoneService: 'Yes',
  MultipleLines: 'No',
  InternetService: 'Fiber optic',
  OnlineSecurity: 'No',
  OnlineBackup: 'No',
  DeviceProtection: 'No',
  TechSupport: 'No',
  StreamingTV: 'Yes',
  StreamingMovies: 'No',
  Contract: 'Month-to-month',
  PaperlessBilling: 'Yes',
  PaymentMethod: 'Electronic check',
  MonthlyCharges: 79.5,
  TotalCharges: 159.0,
};

const PERSONAS: { name: string; description: string; profile: CustomerProfile }[] = [
  {
    name: 'High-Risk Fiber Attrition',
    description: 'Month-to-month contract, no tech support, high monthly charge, paying by electronic check.',
    profile: {
      gender: 'Female',
      SeniorCitizen: 0,
      Partner: 'No',
      Dependents: 'No',
      tenure: 2,
      PhoneService: 'Yes',
      MultipleLines: 'No',
      InternetService: 'Fiber optic',
      OnlineSecurity: 'No',
      OnlineBackup: 'No',
      DeviceProtection: 'No',
      TechSupport: 'No',
      StreamingTV: 'Yes',
      StreamingMovies: 'Yes',
      Contract: 'Month-to-month',
      PaperlessBilling: 'Yes',
      PaymentMethod: 'Electronic check',
      MonthlyCharges: 92.5,
      TotalCharges: 185.0,
    },
  },
  {
    name: 'Loyal Multi-Year Account',
    description: 'Two-year commitment, full security suite, auto credit card, 60+ months tenure.',
    profile: {
      gender: 'Male',
      SeniorCitizen: 0,
      Partner: 'Yes',
      Dependents: 'Yes',
      tenure: 62,
      PhoneService: 'Yes',
      MultipleLines: 'Yes',
      InternetService: 'DSL',
      OnlineSecurity: 'Yes',
      OnlineBackup: 'Yes',
      DeviceProtection: 'Yes',
      TechSupport: 'Yes',
      StreamingTV: 'No',
      StreamingMovies: 'No',
      Contract: 'Two year',
      PaperlessBilling: 'No',
      PaymentMethod: 'Credit card (automatic)',
      MonthlyCharges: 58.2,
      TotalCharges: 3608.4,
    },
  },
  {
    name: 'Vulnerable Senior Citizen',
    description: 'Senior citizen, month-to-month DSL, manual mailed check, moderate tenure.',
    profile: {
      gender: 'Male',
      SeniorCitizen: 1,
      Partner: 'No',
      Dependents: 'No',
      tenure: 14,
      PhoneService: 'Yes',
      MultipleLines: 'No',
      InternetService: 'DSL',
      OnlineSecurity: 'No',
      OnlineBackup: 'No',
      DeviceProtection: 'No',
      TechSupport: 'No',
      StreamingTV: 'No',
      StreamingMovies: 'No',
      Contract: 'Month-to-month',
      PaperlessBilling: 'No',
      PaymentMethod: 'Electronic check',
      MonthlyCharges: 48.0,
      TotalCharges: 672.0,
    },
  },
];

export const PredictorView: React.FC<PredictorViewProps> = ({ initialProfile }) => {
  const [profile, setProfile] = useState<CustomerProfile>(() => ({
    ...DEFAULT_PROFILE,
    ...(initialProfile ?? {}),
  }));

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [advisorState, setAdvisorState] = useState<{
    loading: boolean;
    data: AIAdvisorRecommendation | null;
  }>({ loading: false, data: null });

  // Update when initialProfile prop changes
  useEffect(() => {
    if (initialProfile) {
      setProfile((prev) => ({ ...prev, ...initialProfile }));
    }
  }, [initialProfile]);

  // Real-time calculation on profile changes
  useEffect(() => {
    let isCancelled = false;
    async function runPrediction() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        });
        if (res.ok) {
          const data: PredictionResponse = await res.json();
          if (!isCancelled) {
            setPrediction(data);
          }
        }
      } catch (err) {
        console.error('Prediction request error:', err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    runPrediction();
    return () => {
      isCancelled = true;
    };
  }, [profile]);

  const updateField = <K extends keyof CustomerProfile>(key: K, value: CustomerProfile[K]) => {
    setProfile((prev) => {
      const updated = { ...prev, [key]: value };
      // Auto-update TotalCharges proportionally if tenure or monthly changes
      if (key === 'tenure' || key === 'MonthlyCharges') {
        updated.TotalCharges = Math.round(updated.MonthlyCharges * updated.tenure * 100) / 100;
      }
      return updated;
    });
    // Invalidate stale advisor output
    setAdvisorState({ loading: false, data: null });
  };

  const handleGenerateAdvisor = async () => {
    if (!prediction) return;
    setAdvisorState({ loading: true, data: null });
    try {
      const res = await fetch('/api/retention-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, prediction }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdvisorState({ loading: false, data });
      } else {
        setAdvisorState({ loading: false, data: null });
      }
    } catch (e) {
      console.error('Advisor error:', e);
      setAdvisorState({ loading: false, data: null });
    }
  };

  const probPercent = prediction ? Math.round(prediction.probability * 100) : 0;
  const isHighRisk = prediction?.riskTier === 'High';
  const isMediumRisk = prediction?.riskTier === 'Medium';

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Presets Bar */}
      <div className="space-y-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Percent className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Simulator &amp; What-If Engine</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Real-Time Churn Propensity Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Adjust customer attributes below to observe instant blended predictions from the three machine learning models and request an AI-generated retention strategy.
          </p>
        </div>

        {/* Persona quick buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
          {PERSONAS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setProfile(p.profile);
                setAdvisorState({ loading: false, data: null });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={() => {
              setProfile(DEFAULT_PROFILE);
              setAdvisorState({ loading: false, data: null });
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-400 flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Contract & Tenure */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-2">
              <span>1. Commitment &amp; Tenure Structure</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Contract Agreement
                </label>
                <select
                  value={profile.Contract}
                  onChange={(e) => updateField('Contract', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Month-to-month">Month-to-month (High Risk)</option>
                  <option value="One year">One year (Moderate)</option>
                  <option value="Two year">Two year (Protected)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Payment Method
                </label>
                <select
                  value={profile.PaymentMethod}
                  onChange={(e) => updateField('PaymentMethod', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Electronic check">Electronic check (Manual Friction)</option>
                  <option value="Mailed check">Mailed check</option>
                  <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
                  <option value="Credit card (automatic)">Credit card (automatic)</option>
                </select>
              </div>
            </div>

            {/* Sliders: Tenure & Monthly Charges */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Customer Tenure:</span>
                  <span className="font-bold text-indigo-400">{profile.tenure} months</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="72"
                  value={profile.tenure}
                  onChange={(e) => updateField('tenure', parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>1 month (New)</span>
                  <span>36 months (Mid)</span>
                  <span>72 months (Long)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Monthly Bill Amount:</span>
                  <span className="font-bold text-indigo-400">${profile.MonthlyCharges.toFixed(2)}/mo</span>
                </div>
                <input
                  type="range"
                  min="18.5"
                  max="119.5"
                  step="0.5"
                  value={profile.MonthlyCharges}
                  onChange={(e) => updateField('MonthlyCharges', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>$18.50 (Basic)</span>
                  <span>$70.00 (Standard)</span>
                  <span>$119.50 (Premium)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Connectivity & Support Add-ons */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center space-x-2">
              <span>2. Connectivity &amp; High-Stickiness Add-ons</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Internet Service</label>
                <select
                  value={profile.InternetService}
                  onChange={(e) => updateField('InternetService', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Fiber optic">Fiber optic (Gigabit)</option>
                  <option value="DSL">DSL (Broadband)</option>
                  <option value="No">No Internet</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Tech Support</label>
                <select
                  value={profile.TechSupport}
                  onChange={(e) => updateField('TechSupport', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="No">No (Vulnerable)</option>
                  <option value="Yes">Yes (Sticky)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Online Security</label>
                <select
                  value={profile.OnlineSecurity}
                  onChange={(e) => updateField('OnlineSecurity', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Online Backup</label>
                <select
                  value={profile.OnlineBackup}
                  onChange={(e) => updateField('OnlineBackup', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Device Protection</label>
                <select
                  value={profile.DeviceProtection}
                  onChange={(e) => updateField('DeviceProtection', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Streaming TV</label>
                <select
                  value={profile.StreamingTV}
                  onChange={(e) => updateField('StreamingTV', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Streaming Movies</label>
                <select
                  value={profile.StreamingMovies}
                  onChange={(e) => updateField('StreamingMovies', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card: Account Demographics */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              3. Demographic &amp; Household Profile
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Senior Citizen</label>
                <select
                  value={profile.SeniorCitizen}
                  onChange={(e) => updateField('SeniorCitizen', parseInt(e.target.value, 10))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Partner</label>
                <select
                  value={profile.Partner}
                  onChange={(e) => updateField('Partner', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Dependents</label>
                <select
                  value={profile.Dependents}
                  onChange={(e) => updateField('Dependents', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Paperless Bill</label>
                <select
                  value={profile.PaperlessBilling}
                  onChange={(e) => updateField('PaperlessBilling', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Output & AI Retention Strategist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Prediction Gauge Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Ensemble Forecast</span>
                <h3 className="text-lg font-bold text-white">Churn Propensity</h3>
              </div>

              {prediction && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isHighRisk
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : isMediumRisk
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {prediction.riskTier} Risk
                </span>
              )}
            </div>

            {/* Circular Gauge / Stat */}
            <div className="flex items-center justify-center py-3">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG Radial Meter */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth="9"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={isHighRisk ? '#ef4444' : isMediumRisk ? '#f59e0b' : '#10b981'}
                    strokeWidth="9"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * probPercent) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>

                <div className="absolute text-center flex flex-col items-center">
                  <span className="text-4xl font-black text-white tracking-tight">{probPercent}%</span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                    {prediction?.churnPrediction === 'Yes' ? 'Defection Imminent' : 'Likely Retained'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-model Breakdown Bars */}
            {prediction && (
              <div className="space-y-2.5 pt-3 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block">Sub-Model Consensus</span>

                {/* Logistic Regression */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-blue-400">Logistic Regression (35% wt)</span>
                    <span className="font-semibold text-slate-200">
                      {Math.round(prediction.modelBreakdown.logisticRegression * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(prediction.modelBreakdown.logisticRegression * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Decision Tree */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-emerald-400">Decision Tree (30% wt)</span>
                    <span className="font-semibold text-slate-200">
                      {Math.round(prediction.modelBreakdown.decisionTree * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(prediction.modelBreakdown.decisionTree * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Gradient Boosting */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-amber-400">Gradient Boosting (35% wt)</span>
                    <span className="font-semibold text-slate-200">
                      {Math.round(prediction.modelBreakdown.gradientBoosting * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(prediction.modelBreakdown.gradientBoosting * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Identified Risk Factors */}
            {prediction && prediction.topRiskFactors.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Primary Risk Drivers Identified</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {prediction.topRiskFactors.map((rf, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA: Request AI Retention Strategy */}
            <div className="pt-2">
              <button
                onClick={handleGenerateAdvisor}
                disabled={advisorState.loading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {advisorState.loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Formulating Retention Strategy...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Generate AI Retention Action Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Retention Advisor Output Card */}
          {advisorState.data && (
            <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Executive Retention Directive
                  </span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Expected Lift: -{advisorState.data.expectedChurnReduction}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {advisorState.data.summary}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-900/30 border border-indigo-500/20 text-xs">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                  Targeted Counter-Offer
                </span>
                <p className="text-slate-100 font-semibold">{advisorState.data.recommendedOffer}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-300 block mb-1.5">Immediate Interventions (Next 48 Hours)</span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {advisorState.data.immediateInterventions.map((action, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-300 block mb-1.5">Long-Term Ecosystem Stickiness</span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {advisorState.data.longTermStrategies.map((strat, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{strat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
