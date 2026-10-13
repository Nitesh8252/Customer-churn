import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { ModelComparisonView } from './components/ModelComparisonView.tsx';
import { PredictorView } from './components/PredictorView.tsx';
import { CustomersView } from './components/CustomersView.tsx';
import { PlaybookView } from './components/PlaybookView.tsx';
import { AllMetricsResponse, CustomerRecord, CustomerProfile } from './types.ts';
import { ShieldCheck, Activity, Cpu, Sparkles } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [metrics, setMetrics] = useState<AllMetricsResponse | null>(null);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProfile, setSelectedProfile] = useState<Partial<CustomerProfile> | undefined>(undefined);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [metricsRes, customersRes] = await Promise.all([
          fetch('/api/metrics'),
          fetch('/api/customers?limit=100'),
        ]);

        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          setMetrics(metricsData);
        }

        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(customersData.customers || []);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSelectCustomer = (customer: CustomerRecord) => {
    setSelectedProfile({
      gender: customer.gender,
      SeniorCitizen: customer.SeniorCitizen,
      Partner: customer.Partner,
      Dependents: customer.Dependents,
      tenure: customer.tenure,
      PhoneService: customer.PhoneService,
      MultipleLines: customer.MultipleLines,
      InternetService: customer.InternetService,
      OnlineSecurity: customer.OnlineSecurity,
      OnlineBackup: customer.OnlineBackup,
      DeviceProtection: customer.DeviceProtection,
      TechSupport: customer.TechSupport,
      StreamingTV: customer.StreamingTV,
      StreamingMovies: customer.StreamingMovies,
      Contract: customer.Contract,
      PaperlessBilling: customer.PaperlessBilling,
      PaymentMethod: customer.PaymentMethod,
      MonthlyCharges: customer.MonthlyCharges,
      TotalCharges: customer.TotalCharges,
    });
    setActiveTab('predictor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        datasetStats={
          metrics
            ? {
                totalSamples: metrics.datasetCharacteristics.totalSamples,
                churnRate: metrics.datasetCharacteristics.churnRate,
              }
            : undefined
        }
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {isLoading && !metrics ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
            <p className="text-sm font-medium text-slate-400">Calibrating Ensemble Machine Learning Models...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                metrics={metrics}
                customers={customers}
                onNavigate={setActiveTab}
                onSelectCustomer={handleSelectCustomer}
              />
            )}

            {activeTab === 'models' && <ModelComparisonView metrics={metrics} />}

            {activeTab === 'predictor' && <PredictorView initialProfile={selectedProfile} />}

            {activeTab === 'customers' && (
              <CustomersView
                customers={customers}
                onSelectCustomer={handleSelectCustomer}
              />
            )}

            {activeTab === 'playbook' && <PlaybookView />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">Customer Churn Ensemble Framework</span>
            <span className="text-slate-600">|</span>
            <span>Early Detection for Service Industries</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>LR + CART + Gradient Boosting</span>
            </span>
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Gemini Retention Advisor</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
