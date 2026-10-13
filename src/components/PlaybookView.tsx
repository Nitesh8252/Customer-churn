import React, { useState } from 'react';
import {
  BookOpen,
  DollarSign,
  CheckCircle,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Award,
} from 'lucide-react';

export const PlaybookView: React.FC = () => {
  // ROI Calculator states
  const [customerBase, setCustomerBase] = useState<number>(10000);
  const [churnRate, setChurnRate] = useState<number>(27);
  const [retentionLift, setRetentionLift] = useState<number>(35);
  const [averageLtv, setAverageLtv] = useState<number>(1200);

  // Calculations
  const annualChurnedAccounts = Math.round((customerBase * churnRate) / 100);
  const accountsSaved = Math.round((annualChurnedAccounts * retentionLift) / 100);
  const annualRevenueRetained = accountsSaved * averageLtv;

  const playbooks = [
    {
      id: 'contract-conversion',
      title: 'Month-to-Month Contract Conversion Campaign',
      target: 'Month-to-Month Subscribers with Tenure > 3 months',
      featureDriver: 'Contract Commitment (Importance: 28%)',
      impact: 'High',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      description:
        'Month-to-month contracts experience 4.2x higher churn rates than term commitments. Transitioning accounts into 12 or 24-month loyalty plans eliminates monthly cancellation triggers.',
      tactics: [
        'Offer a 15% rate lock discount in exchange for a 12-month agreement commitment.',
        'Include complimentary premium streaming or cybersecurity bundle (perceived value $15/mo, actual cost $2/mo).',
        'Deploy automated email & SMS sequence triggered when monthly churn propensity crosses 50%.',
      ],
      expectedOutcome: '35% - 48% reduction in cohort defection within 90 days.',
    },
    {
      id: 'fiber-support',
      title: 'Fiber Optic Service Safeguard Initiative',
      target: 'Fiber Optic Customers without Tech Support Add-On',
      featureDriver: 'Tech Support & Internet Service (Importance: 21%)',
      impact: 'Critical',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      description:
        'Fiber optic subscribers pay higher ARPU ($85-115/mo) and possess zero tolerance for unaddressed latency or Wi-Fi coverage issues. Without proactive Tech Support, minor friction cascades into rapid cancellation.',
      tactics: [
        'Automatically provision 6 months of complimentary 24/7 VIP Tech Support for high-value fiber accounts.',
        'Implement proactive telemetry monitoring: trigger outbound support calls if packet loss exceeds 2% over 48 hours.',
        'Provide single-touch Wi-Fi mesh optimization diagnostics via mobile customer portal.',
      ],
      expectedOutcome: '40% decrease in early cancellation requests among gigabit fiber subscribers.',
    },
    {
      id: 'autopay-modernization',
      title: 'Auto-Pay Modernization & Friction Removal',
      target: 'Electronic Check & Mailed Check Payers',
      featureDriver: 'Payment Method Friction (Importance: 8%)',
      impact: 'Medium',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      description:
        'Manual payment methods force the customer to re-evaluate their service cost every month. Automatic ACH or credit card billing converts the relationship to background passive utility mode.',
      tactics: [
        'Launch a "$10 Immediate Bill Credit + $5/month ongoing discount" incentive for enabling Auto-Pay.',
        'Integrate friction-free one-click ACH linking via Plaid in the account billing portal.',
        'Eliminate paperless billing fee surcharge when paired with automatic payment method.',
      ],
      expectedOutcome: '22% reduction in recurring billing attrition and late-payment suspensions.',
    },
    {
      id: 'onboarding-90-day',
      title: '90-Day Onboarding & Early Warning Program',
      target: 'New Accounts (Tenure 1 - 6 Months)',
      featureDriver: 'Tenure Vulnerability (Importance: 22%)',
      impact: 'High',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description:
        'Customers who survive the first 12 months show an 82% multi-year retention rate. The first 90 days constitute the "golden retention window" where customer habits solidify.',
      tactics: [
        'Day 7: Automated installation and speed verification survey with instant escalation callback if satisfaction < 8/10.',
        'Day 30: Educational walkthrough of customer portal, self-service tools, and bundled features.',
        'Day 75: Proactive account review offering free add-on trial before first contract decision point.',
      ],
      expectedOutcome: '30% improvement in first-year account survival rate.',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Strategic Interventions &amp; Economics</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
          Retention Playbooks &amp; ROI Simulator
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
          Actionable, data-backed operational playbooks calibrated from the ensemble model feature importances, accompanied by a financial ROI impact model.
        </p>
      </div>

      {/* ROI Financial Impact Calculator */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Retention Economics &amp; ROI Calculator</h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Quantify the bottom-line financial value of deploying early ensemble churn detection
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center space-x-1.5 self-start md:self-auto">
            <TrendingUp className="w-4 h-4" />
            <span>High ROI Leverage</span>
          </div>
        </div>

        {/* Sliders & Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
          {/* Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Total Subscriber Base:</span>
                <span className="font-bold text-white">{customerBase.toLocaleString()} accounts</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={customerBase}
                onChange={(e) => setCustomerBase(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Annual Baseline Churn Rate:</span>
                <span className="font-bold text-rose-400">{churnRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={churnRate}
                onChange={(e) => setChurnRate(parseInt(e.target.value, 10))}
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Expected Retention Intervention Lift:</span>
                <span className="font-bold text-emerald-400">{retentionLift}% saved</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={retentionLift}
                onChange={(e) => setRetentionLift(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Average Customer Lifetime Value (LTV):</span>
                <span className="font-bold text-indigo-400">${averageLtv.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="400"
                max="3000"
                step="50"
                value={averageLtv}
                onChange={(e) => setAverageLtv(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Computed Results (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Estimated Annual Retained Revenue
              </span>
              <div className="text-3xl font-black text-emerald-400 tracking-tight mt-1">
                ${annualRevenueRetained.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Direct recurring cash-flow preserved from defecting accounts
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 block">Accounts Saved:</span>
                <span className="text-base font-bold text-white">
                  {accountsSaved.toLocaleString()} / year
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Churn Reduced to:</span>
                <span className="text-base font-bold text-emerald-400">
                  {((churnRate * (100 - retentionLift)) / 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Playbook Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playbooks.map((pb) => (
          <div
            key={pb.id}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${pb.badgeColor}`}>
                  {pb.impact} Impact
                </span>
                <span className="text-xs text-indigo-400 font-medium">{pb.featureDriver}</span>
              </div>

              <h3 className="text-base font-bold text-white mt-2">{pb.title}</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">Target: {pb.target}</p>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">{pb.description}</p>

              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-200 block uppercase tracking-wider">
                  Tactical Implementation
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {pb.tactics.map((t, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Expected Outcome:</span>
              <span className="font-semibold text-emerald-400">{pb.expectedOutcome}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
