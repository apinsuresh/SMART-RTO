import React, { useState } from 'react';
import { 
  Search, 
  Info, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  FileText,
  Car,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';

export default function CitizenDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Indhu S", "role": "citizen"}');
  const firstName = (user.name || 'Indhu S').split(' ')[0];

  const stats = [
    { title: 'Total Applications', value: '12', trend: '+20%', trendColor: 'text-green-600 bg-green-50', icon: FileText },
    { title: 'Pending', value: '02', trend: '0%', trendColor: 'text-slate-500 bg-slate-50', icon: Clock },
    { title: 'Approved', value: '10', trend: '-5%', trendColor: 'text-red-500 bg-red-50', icon: CheckCircle2 },
  ];

  const activities = [
    { title: 'DL Renewal Approved', desc: 'Your driving license renewal application (APP-88291) has been approved. Digital copy is now available.', time: 'YESTERDAY, 4:30 PM', type: 'approved', icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
    { title: 'Application Submitted', desc: 'Address change application for vehicle KA 01 MG 5678 was successfully submitted.', time: 'OCT 12, 10:15 AM', type: 'submitted', icon: FileText, color: 'text-red-600 bg-red-50' },
    { title: 'Challan Payment', desc: 'Payment of ₹500 for traffic violation challan #CH-00129 has been processed.', time: 'OCT 10, 2:45 PM', type: 'payment', icon: CreditCard, color: 'text-orange-600 bg-orange-50' },
  ];

  const registrations = [
    { 
      id: 'KA 01 MG 5678', 
      model: 'Toyota Innova Hycross • White', 
      status: 'Active', 
      validity: 'Valid till Aug 2037',
      statusClass: 'bg-green-100 text-green-700'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Welcome back, {firstName}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Everything you need to manage your vehicle registrations and licenses is right here.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
                <stat.icon size={22} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${stat.trendColor}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{stat.title}</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Area (2/3) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Vehicle Quick Lookup */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Search className="text-red-600" size={20} />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Vehicle Quick Lookup</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Vehicle Registration Number</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      placeholder="e.g. KA 01 AB 1234" 
                      className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    />
                    <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 dark:shadow-none flex items-center justify-center space-x-2 transition-all active:scale-95">
                      <Search size={18} />
                      <span>Lookup</span>
                    </button>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl flex items-start space-x-3 border border-red-100 dark:border-red-900/30">
                  <Info className="text-red-600 dark:text-red-400 mt-0.5" size={18} />
                  <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed font-medium">
                    Search for registration details, insurance validity, and pollution certificate status for any vehicle across the country.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Registrations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Registrations</h2>
              <button className="text-sm font-bold text-red-600 dark:text-red-400 hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {registrations.map((reg, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-red-200 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                      <Car size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{reg.id}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{reg.model}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${reg.statusClass}`}>
                      {reg.status}
                    </span>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">{reg.validity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Activity (1/3) */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Clock className="text-red-600" size={20} />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
          </div>

          <div className="relative pl-8 space-y-10 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
            {activities.map((act, i) => (
              <div key={i} className="relative group">
                {/* Dot */}
                <div className={`absolute -left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center z-10 ${act.color} ring-4 ring-white dark:ring-slate-900 shadow-sm`}>
                  <act.icon size={14} />
                </div>
                
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-red-600 transition-colors">{act.title}</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {act.desc}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-3 tracking-tight">
                    {act.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-4 text-sm font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mt-4">
            Show More Activity
          </button>
        </div>
      </div>
    </div>
  );
}
