import React, { useState } from 'react';
import {
  GitBranch,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  Sliders,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { CustomerProfile, PipelineExecutionTrace, PrescriptivePlan, PredictionResponse } from '../types.ts';
import { executeFullMLPipeline } from '../lib/pipeline.ts';

export const PipelineView: React.FC = () => {
  const [testProfile, setTestProfile] = useState<CustomerProfile>({
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
    MonthlyCharges: 85.5,
    TotalCharges: 171.0,
  });

  const [pipelineResult, setPipelineResult] = useState<{
    prediction: PredictionResponse;
    prescriptivePlan: PrescriptivePlan;
    fullTrace: PipelineExecutionTrace;
  } | null>(() => {
    // Initial run
    const res = executeFullMLPipeline({
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
      MonthlyCharges: 85.5,
      TotalCharges: 171.0,
    });
    return {
      prediction: res.prediction,
      prescriptivePlan: res.prescriptivePlan,
      fullTrace: res.fullTrace,
    };
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);

  const handleRunPipeline = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = executeFullMLPipeline(testProfile);
      setPipelineResult({
        prediction: res.prediction,
        prescriptivePlan: res.prescriptivePlan,
        fullTrace: res.fullTrace,
      });
      setIsRunning(false);
    }, 150);
  };

  const stages = pipelineResult?.fullTrace.stages || [];
  const activeStage = stages[selectedStageIndex] || stages[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Introduction */}
      <div>
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-API-Key Architecture</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
          End-to-End Machine Learning &amp; Decision Pipelines
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
          A fully self-contained, deterministic data processing and inferencing pipeline that requires zero external API keys. Every stage executes locally with sub-millisecond latency.
        </p>
      </div>

      {/* Visual Pipeline Flow Stages */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>5-Stage Continuous Inference Pipeline</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any stage below to inspect intermediate transformation states and vector tensors
            </p>
          </div>

          <button
            onClick={handleRunPipeline}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Executing Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Pipeline Run</span>
              </>
            )}
          </button>
        </div>

        {/* Pipeline Stepper Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {stages.map((stage, idx) => {
            const isSelected = selectedStageIndex === idx;
            return (
              <div
                key={stage.id}
                onClick={() => setSelectedStageIndex(idx)}
                className={`p-4 rounded-xl cursor-pointer border transition-all text-left ${
                  isSelected
                    ? 'bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Stage {idx + 1}
                  </span>
                  <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{stage.durationMs}ms</span>
                  </span>
                </div>

                <div className="font-semibold text-xs text-white line-clamp-1">{stage.name}</div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{stage.description}</p>
              </div>
            );
          })}
        </div>

        {/* Active Stage Inspector Card */}
        {activeStage && (
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Stage {selectedStageIndex + 1} Inspector: {activeStage.name}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Duration: <strong className="text-emerald-400">{activeStage.durationMs}ms</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Stage Input Contract
                </span>
                <p className="text-slate-200 font-mono text-[11px]">{activeStage.inputDataSummary}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                  Stage Output Transformation
                </span>
                <p className="text-slate-200 font-mono text-[11px]">{activeStage.outputDataSummary}</p>
              </div>
            </div>

            {/* Vector Tensor Display for Stage 2 & 3 */}
            {pipelineResult && (selectedStageIndex === 1 || selectedStageIndex === 2) && (
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">
                  Normalized Feature Vector (19 Dimensions)
                </span>
                <div className="flex flex-wrap gap-1 font-mono text-[11px] text-slate-300">
                  {pipelineResult.fullTrace.transformedVector.map((val, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300"
                    >
                      f[{i}]: {val.toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pipeline Input & Execution Results Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Sandbox (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Pipeline Input Sandbox</h3>
            </div>
            <span className="text-xs text-slate-400">Modify attributes &amp; test pipeline</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-medium">Contract Type</label>
              <select
                value={testProfile.Contract}
                onChange={(e) => setTestProfile({ ...testProfile, Contract: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
              >
                <option value="Month-to-month">Month-to-month</option>
                <option value="One year">One year</option>
                <option value="Two year">Two year</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Internet Service</label>
              <select
                value={testProfile.InternetService}
                onChange={(e) => setTestProfile({ ...testProfile, InternetService: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
              >
                <option value="Fiber optic">Fiber optic</option>
                <option value="DSL">DSL</option>
                <option value="No">No Internet</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Tech Support</label>
              <select
                value={testProfile.TechSupport}
                onChange={(e) => setTestProfile({ ...testProfile, TechSupport: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Payment Method</label>
              <select
                value={testProfile.PaymentMethod}
                onChange={(e) => setTestProfile({ ...testProfile, PaymentMethod: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
              >
                <option value="Electronic check">Electronic check</option>
                <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
                <option value="Credit card (automatic)">Credit card (automatic)</option>
                <option value="Mailed check">Mailed check</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">
                Tenure: <strong className="text-indigo-400">{testProfile.tenure} months</strong>
              </label>
              <input
                type="range"
                min="1"
                max="72"
                value={testProfile.tenure}
                onChange={(e) => setTestProfile({ ...testProfile, tenure: parseInt(e.target.value, 10) })}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">
                Monthly Charge: <strong className="text-indigo-400">${testProfile.MonthlyCharges}</strong>
              </label>
              <input
                type="range"
                min="18.5"
                max="119.5"
                step="0.5"
                value={testProfile.MonthlyCharges}
                onChange={(e) => setTestProfile({ ...testProfile, MonthlyCharges: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleRunPipeline}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all mt-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Re-execute Pipeline with Current Inputs</span>
          </button>
        </div>

        {/* Right: Prescriptive Decision Engine Output (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Stage 5: Prescriptive Action Output</h3>
            </div>
            {pipelineResult && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Deterministic (No API Key)
              </span>
            )}
          </div>

          {pipelineResult ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Predicted Risk</span>
                  <div className="text-xl font-bold text-white">
                    {(pipelineResult.prediction.probability * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Risk Tier</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-400 font-bold border border-rose-500/20 text-xs">
                    {pipelineResult.prediction.riskTier}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Executive Summary</span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {pipelineResult.prescriptivePlan.summary}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                <span className="text-[10px] uppercase font-bold text-indigo-300 block mb-1">
                  Targeted Prescriptive Counter-Offer
                </span>
                <p className="text-slate-100 font-semibold">{pipelineResult.prescriptivePlan.recommendedOffer}</p>
                <div className="mt-2 text-[11px] text-emerald-400 font-medium">
                  Expected Churn Reduction: {pipelineResult.prescriptivePlan.expectedChurnReduction}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1.5">
                  Immediate Interventions ({pipelineResult.prescriptivePlan.immediateInterventions.length})
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {pipelineResult.prescriptivePlan.immediateInterventions.map((action, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1.5">
                  Deterministic Rules Triggered ({pipelineResult.prescriptivePlan.triggeredRules.length})
                </span>
                <div className="space-y-1 font-mono text-[10px] text-slate-400">
                  {pipelineResult.prescriptivePlan.triggeredRules.map((rule, idx) => (
                    <div key={idx} className="p-1 rounded bg-slate-950/60 border border-slate-800 truncate">
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs">Execute pipeline to inspect output.</div>
          )}
        </div>
      </div>
    </div>
  );
};
