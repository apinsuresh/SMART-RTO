import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, trendValue }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
          <Icon size={24} />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
          <span className="text-slate-500 dark:text-slate-400 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
}
