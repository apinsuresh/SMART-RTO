import React from 'react';
import { CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';

export default function ActivityTimeline({ activities }) {
  const getIcon = (type) => {
    switch (type) {
      case 'approved': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'pending': return <Clock className="text-amber-500" size={20} />;
      case 'rejected': return <XCircle className="text-red-500" size={20} />;
      default: return <FileText className="text-red-500" size={20} />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
      
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={index} className="flex">
            <div className="flex flex-col items-center mr-4">
              <div className="rounded-full bg-slate-100 dark:bg-slate-700 p-2">
                {getIcon(activity.status)}
              </div>
              {index !== activities.length - 1 && (
                <div className="flex-1 w-px bg-slate-200 dark:bg-slate-700 my-2"></div>
              )}
            </div>
            <div className="pb-6">
              <p className="font-medium text-slate-900 dark:text-slate-100">{activity.title}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{activity.description}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{activity.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
