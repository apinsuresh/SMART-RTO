import React, { useState } from 'react';
import axios from 'axios';
import { Search, CheckCircle2, RefreshCw, Circle, AlertCircle, HelpCircle, Headphones } from 'lucide-react';

const MOCK_DATA = {
  id: 'MH12-2023-0001234',
  serviceType: 'Driving License Renewal',
  lastUpdated: 'Oct 24, 2023 • 02:30 PM',
  status: 'IN PROGRESS',
  steps: [
    { label: 'Pending', date: 'Oct 20, 2023', state: 'done' },
    { label: 'Under Review', date: null, state: 'active', subtitle: 'Active Stage' },
    { label: 'Approved/Rejected', date: null, state: 'pending', subtitle: 'Pending Result' },
  ],
  statusNote: `Your application for "Driving License Renewal" is currently being reviewed by the RTO verifying officer. This process typically takes 3-5 business days. You will receive an SMS notification once the review is complete.`,
};

export default function ApplicationTracking() {
  const [appId, setAppId] = useState('');
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Show mock data for demo IDs, otherwise try the real API
    if (appId.toUpperCase() === 'MH12-2023-0001234') {
      setTimeout(() => {
        setAppData(MOCK_DATA);
        setLoading(false);
      }, 700);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:5001/api/applications/${appId}`, {
        headers: { Authorization: token }
      });

      // Map real API response to our shape
      const raw = response.data;
      setAppData({
        id: raw.id,
        serviceType: raw.service_type,
        lastUpdated: new Date(raw.last_updated || raw.submission_date).toLocaleString(),
        status: raw.status === 'Approved' ? 'APPROVED' : raw.status === 'Rejected' ? 'REJECTED' : 'IN PROGRESS',
        steps: raw.steps || [],
        statusNote: raw.status === 'Under Review'
          ? `Your application is currently being reviewed by the RTO verifying officer. This process typically takes 3-5 business days.`
          : raw.status === 'Approved'
            ? 'Your application has been approved. You can download the relevant documents from the portal.'
            : 'Your application has been submitted and is pending review.',
      });
    } catch (err) {
      console.error(err);
      setError(true);
      setAppData(null);
    } finally {
      setLoading(false);
    }
  };

  const statusBadgeClass = (s) => {
    if (s === 'APPROVED') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'REJECTED') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-red-50 text-red-600 border-red-200';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="text-center mb-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Track Your Application</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Check the real-time status of your driving license, vehicle registration, or permit application.
        </p>
      </div>

      {/* Search Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
          Application Tracking ID
        </label>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
              placeholder="MH12-2023-0001234"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-95 whitespace-nowrap"
          >
            {loading ? 'Checking...' : 'Track Status'}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">Application not found. Please check the ID and try again.</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
        </div>
      )}

      {/* Results Card */}
      {appData && !loading && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Application Details</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Last updated: {appData.lastUpdated}</p>
            </div>
            <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${statusBadgeClass(appData.status)}`}>
              {appData.status}
            </span>
          </div>

          {/* 3-Step Progress Tracker */}
          <div className="flex items-start justify-between relative">
            {/* connector line */}
            <div className="absolute top-5 left-[calc(16.67%)] right-[calc(16.67%)] h-0.5 bg-slate-200 dark:bg-slate-700 z-0"></div>

            {appData.steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center flex-1 relative z-10">
                {/* Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm
                  ${step.state === 'done' ? 'bg-red-600 text-white' : ''}
                  ${step.state === 'active' ? 'bg-red-600 text-white' : ''}
                  ${step.state === 'pending' ? 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-400' : ''}
                `}>
                  {step.state === 'done' && <CheckCircle2 size={20} />}
                  {step.state === 'active' && <RefreshCw size={18} />}
                  {step.state === 'pending' && <Circle size={18} />}
                </div>
                {/* Label */}
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-2 text-center">{step.label}</p>
                {/* Sub-label */}
                {step.date && <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">{step.date}</p>}
                {step.subtitle && (
                  <p className={`text-[10px] font-semibold text-center ${step.state === 'active' ? 'text-red-600' : 'text-slate-400'}`}>
                    {step.subtitle}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Current Status Note */}
          {appData.statusNote && (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
              <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Current Status Note:</h5>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{appData.statusNote}</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Help Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex items-start space-x-4">
          <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-400">
            <HelpCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Delayed?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              If your application status hasn't updated in 7+ days, please reach out to our support desk.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex items-start space-x-4">
          <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-400">
            <Headphones size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Contact Support</h4>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Email: support@smartrto.gov.in</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Helpline: 1800 RTO SMART</p>
          </div>
        </div>
      </div>
    </div>
  );
}
