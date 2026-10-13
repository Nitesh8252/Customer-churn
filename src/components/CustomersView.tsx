import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import { CustomerRecord } from '../types.ts';

interface CustomersViewProps {
  customers: CustomerRecord[];
  onSelectCustomer: (customer: CustomerRecord) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onSelectCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedChurn, setSelectedChurn] = useState('all');
  const [sortBy, setSortBy] = useState<'risk' | 'tenure' | 'charges'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedInspectCustomer, setSelectedInspectCustomer] = useState<CustomerRecord | null>(null);

  // Filtered & Sorted items
  const filteredRecords = useMemo(() => {
    let result = customers;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.customerID.toLowerCase().includes(q) ||
          c.InternetService.toLowerCase().includes(q) ||
          c.PaymentMethod.toLowerCase().includes(q)
      );
    }

    if (selectedContract !== 'all') {
      result = result.filter((c) => c.Contract === selectedContract);
    }

    if (selectedRisk !== 'all') {
      result = result.filter((c) => c.riskTier === selectedRisk);
    }

    if (selectedChurn !== 'all') {
      result = result.filter((c) => c.Churn === selectedChurn);
    }

    // Sort
    return [...result].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'risk') {
        const riskA = a.predictedProbability ?? 0;
        const riskB = b.predictedProbability ?? 0;
        comparison = riskA - riskB;
      } else if (sortBy === 'tenure') {
        comparison = a.tenure - b.tenure;
      } else if (sortBy === 'charges') {
        comparison = a.MonthlyCharges - b.MonthlyCharges;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [customers, searchTerm, selectedContract, selectedRisk, selectedChurn, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const handleSortChange = (newSort: 'risk' | 'tenure' | 'charges') => {
    if (sortBy === newSort) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(newSort);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Customer Intelligence Directory</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Accounts Database ({customers.length.toLocaleString()} Records)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Query individual customer accounts, audit risk classifications, and feed individual profiles directly into the simulator.
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            Showing <strong className="text-white">{filteredRecords.length}</strong> matching accounts
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search box */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Customer ID, service, or payment..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>

          {/* Contract Filter */}
          <div>
            <select
              value={selectedContract}
              onChange={(e) => {
                setSelectedContract(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Contract: All</option>
              <option value="Month-to-month">Month-to-month</option>
              <option value="One year">One year</option>
              <option value="Two year">Two year</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Predicted Risk: All</option>
              <option value="High">High Risk (&gt;65%)</option>
              <option value="Medium">Medium Risk (35-65%)</option>
              <option value="Low">Low Risk (&lt;35%)</option>
            </select>
          </div>

          {/* Churn Filter */}
          <div>
            <select
              value={selectedChurn}
              onChange={(e) => {
                setSelectedChurn(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Historical Churn: All</option>
              <option value="Yes">Churned (Yes)</option>
              <option value="No">Retained (No)</option>
            </select>
          </div>
        </div>

        {/* Sort Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">Sort by:</span>
            <button
              onClick={() => handleSortChange('risk')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
                sortBy === 'risk'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>Predicted Risk</span>
              {sortBy === 'risk' && <ArrowUpDown className="w-3 h-3 ml-1" />}
            </button>
            <button
              onClick={() => handleSortChange('tenure')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
                sortBy === 'tenure'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>Tenure</span>
              {sortBy === 'tenure' && <ArrowUpDown className="w-3 h-3 ml-1" />}
            </button>
            <button
              onClick={() => handleSortChange('charges')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
                sortBy === 'charges'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>Monthly Charge</span>
              {sortBy === 'charges' && <ArrowUpDown className="w-3 h-3 ml-1" />}
            </button>
          </div>

          <div className="flex items-center space-x-2 text-slate-400">
            <span>Per page:</span>
            {[25, 50, 100].map((size) => (
              <button
                key={size}
                onClick={() => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded text-xs ${
                  pageSize === size ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Customer ID</th>
                <th className="py-3.5 px-4 font-semibold">Tenure</th>
                <th className="py-3.5 px-4 font-semibold">Contract</th>
                <th className="py-3.5 px-4 font-semibold">Internet Service</th>
                <th className="py-3.5 px-4 font-semibold">Monthly Charge</th>
                <th className="py-3.5 px-4 font-semibold">Payment Method</th>
                <th className="py-3.5 px-4 font-semibold">Predicted Churn</th>
                <th className="py-3.5 px-4 font-semibold">Actual Churn</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No customers found matching the search criteria.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((c) => {
                  const prob = Math.round((c.predictedProbability ?? 0) * 100);
                  const isHigh = c.riskTier === 'High';
                  const isMed = c.riskTier === 'Medium';
                  return (
                    <tr key={c.customerID} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-indigo-300">
                        {c.customerID}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">{c.tenure} mo</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            c.Contract === 'Month-to-month'
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                              : c.Contract === 'One year'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          }`}
                        >
                          {c.Contract}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <div className="flex items-center space-x-1.5">
                          <span>{c.InternetService}</span>
                          {c.TechSupport === 'Yes' && (
                            <span className="text-[10px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300" title="Tech Support Active">
                              Support
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-100">${c.MonthlyCharges.toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-[140px]" title={c.PaymentMethod}>
                        {c.PaymentMethod}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-14 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${
                                isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${prob}%` }}
                            ></div>
                          </div>
                          <span
                            className={`font-bold ${
                              isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {prob}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {c.Churn === 'Yes' ? (
                          <span className="inline-flex items-center space-x-1 text-rose-400 text-xs font-semibold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Churned</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Retained</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedInspectCustomer(c)}
                            title="Inspect details"
                            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectCustomer(c)}
                            title="Load into Simulator"
                            className="px-2.5 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 font-semibold transition-all text-[11px] flex items-center space-x-1"
                          >
                            <span>Test</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length} accounts
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-slate-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Quick Inspect Drawer/Modal */}
      {selectedInspectCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Audit</span>
                <h3 className="text-lg font-bold text-white font-mono">{selectedInspectCustomer.customerID}</h3>
              </div>
              <button
                onClick={() => setSelectedInspectCustomer(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Contract</span>
                <span className="font-semibold text-white">{selectedInspectCustomer.Contract}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Tenure</span>
                <span className="font-semibold text-white">{selectedInspectCustomer.tenure} months</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Monthly Charges</span>
                <span className="font-semibold text-indigo-400">${selectedInspectCustomer.MonthlyCharges.toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Total Lifetime Paid</span>
                <span className="font-semibold text-white">${selectedInspectCustomer.TotalCharges.toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Internet Service</span>
                <span className="font-semibold text-white">{selectedInspectCustomer.InternetService}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Tech Support</span>
                <span className="font-semibold text-white">{selectedInspectCustomer.TechSupport}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Payment Method</span>
                <span className="font-semibold text-white">{selectedInspectCustomer.PaymentMethod}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Predicted Risk</span>
                <span className="font-bold text-rose-400">
                  {Math.round((selectedInspectCustomer.predictedProbability ?? 0) * 100)}% ({selectedInspectCustomer.riskTier})
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedInspectCustomer(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = selectedInspectCustomer;
                  setSelectedInspectCustomer(null);
                  onSelectCustomer(target);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5"
              >
                <span>Simulate in Predictor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
