import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, FileText, CheckCircle2, ShieldAlert, BarChart3, 
  Search, Filter, Eye, Check, X, Download, AlertCircle
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('applications');
  
  useEffect(() => {
    if (location.pathname.includes('/admin/applications')) setActiveTab('applications');
    else if (location.pathname.includes('/admin/users')) setActiveTab('users');
    else if (location.pathname.includes('/admin/reports')) setActiveTab('challans');
  }, [location.pathname]);
  
  // States for backend data
  const [stats, setStats] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const [resOverview, resApps, resTrend] = await Promise.all([
        axios.get('https://smart-rto.onrender.com/api/reports/overview', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('https://smart-rto.onrender.com/api/applications', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('https://smart-rto.onrender.com/api/reports/revenue-trend', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const pendingCount = resApps.data.filter(app => app.status === 'Pending' || app.status === 'Under Review').length;

      const statsData = [
        { title: 'Total Revenue (₹)', value: resOverview.data.total_revenue, icon: BarChart3, trend: 'up', trendValue: '5%' },
        { title: 'Pending Applications', value: pendingCount, icon: FileText, trend: 'down', trendValue: '3%' },
        { title: 'Challans Paid', value: resOverview.data.challans_paid, icon: CheckCircle2, trend: 'up', trendValue: '12%' },
        { title: 'Unpaid Challans', value: resOverview.data.unpaid_challans, icon: ShieldAlert, trend: 'up', trendValue: '2%' }
      ];
      
      setStats(statsData);
      setApplications(resApps.data);
      setRevenueData(resTrend.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data. Ensure you have admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Real-time auto-refresh for the "Moving" effect
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        const resTrend = await axios.get('https://smart-rto.onrender.com/api/reports/revenue-trend', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRevenueData(resTrend.data);
      } catch (err) {
        console.error('Auto-refresh failed:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (trackingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://smart-rto.onrender.com/api/applications/${trackingId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh dashboard data
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to update application status.');
    }
  };

  const [revenueData, setRevenueData] = useState([]);

  const appTypeData = React.useMemo(() => {
    if (!applications || applications.length === 0) return [];
    
    const counts = applications.reduce((acc, app) => {
      acc[app.service_type] = (acc[app.service_type] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  }, [applications]);

  const COLORS = ['#dc2626', '#10b981', '#f59e0b', '#8b5cf6'];

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'Approved': return <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 text-xs font-semibold rounded-full">Approved</span>;
      case 'Pending': return <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 text-xs font-semibold rounded-full">Pending</span>;
      case 'Rejected': return <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 text-xs font-semibold rounded-full">Rejected</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-full">{status}</span>;
    }
  };

  const exportToCSV = () => {
    if (!applications || applications.length === 0) {
      alert('No applications data available to export.');
      return;
    }

    // Define CSV headers
    const headers = ['App ID', 'Applicant', 'Type', 'Date', 'Status', 'RTO', 'Address'];
    
    // Convert application objects to CSV rows
    const csvRows = applications.map(app => {
      return [
        `"${app.tracking_id || app._id}"`,
        `"${app.applicant_name}"`,
        `"${app.service_type}"`,
        `" ${new Date(app.submission_date).toISOString().split('T')[0]}"`,
        `"${app.status}"`,
        `"${app.processing_rto || ''}"`,
        `"${app.address ? app.address.replace(/"/g, '""') : ''}"`
      ].join(',');
    });

    // Combine headers and rows
    const csvString = [headers.join(','), ...csvRows].join('\n');
    
    // Create a Blob and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Smart_RTO_Applications_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage applications, verify documents, and view system reports.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <Download size={18} className="mr-2" /> Export Report
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-center space-x-3">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
          </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex -mb-px px-6 block overflow-x-auto hide-scrollbar whitespace-nowrap">
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'applications' ? 'border-red-500 text-red-600 dark:text-red-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
            >
              Recent Applications
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'users' ? 'border-red-500 text-red-600 dark:text-red-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('challans')}
              className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'challans' ? 'border-red-500 text-red-600 dark:text-red-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
            >
              System Reports
            </button>
          </nav>
        </div>

        {activeTab === 'applications' && (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input 
                  type="text" 
                  placeholder="Search by ID or Name..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-transparent dark:text-white"
                />
              </div>
              <button className="flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <Filter size={18} className="mr-2" /> Filter
              </button>
            </div>

            <div className="overflow-x-auto ring-1 ring-slate-200 dark:ring-slate-700 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">App ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applicant</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {Array.isArray(applications) && applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                        {app.tracking_id || (app._id ? app._id.toString().substr(0, 10).toUpperCase() : 'N/A')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{app.applicant_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{app.service_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(app.submission_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button 
                          onClick={() => setSelectedApp(app)} 
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 p-1.5 rounded" title="View Details">
                          <Eye size={18} />
                        </button>
                        {(app.status === 'Pending' || app.status === 'Under Review') && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(app.tracking_id || app._id, 'Approved')}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/30 p-1.5 rounded" title="Approve">
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(app.tracking_id || app._id, 'Rejected')}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 p-1.5 rounded" title="Reject">
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedApp && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl relative border border-slate-200 dark:border-slate-800">
                  <button onClick={() => setSelectedApp(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                  <div className="mb-6">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Application Details</h2>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">ID: {selectedApp.tracking_id || selectedApp._id}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Applicant Name</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{selectedApp.applicant_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Service Type</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{selectedApp.service_type}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Processing RTO</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{selectedApp.processing_rto}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date of Birth</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{new Date(selectedApp.dob).toLocaleDateString()}</p>
                    </div>
                    <div className="col-span-2 border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Permanent Address</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{selectedApp.address}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                     {(selectedApp.status === 'Pending' || selectedApp.status === 'Under Review') && (
                       <>
                         <button onClick={() => { handleStatusUpdate(selectedApp.tracking_id || selectedApp._id, 'Approved'); setSelectedApp(null); }} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition flex items-center gap-2">
                           <Check size={18} /> Approve
                         </button>
                         <button onClick={() => { handleStatusUpdate(selectedApp.tracking_id || selectedApp._id, 'Rejected'); setSelectedApp(null); }} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition flex items-center gap-2">
                           <X size={18} /> Reject
                         </button>
                       </>
                     )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other tabs placeholders */}
        {activeTab === 'users' && (
          <div className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">User Management</h3>
            <p className="mt-1 text-slate-500 dark:text-slate-400">View and manage roles for Citizens and Officers.</p>
          </div>
        )}
        
        {activeTab === 'challans' && (
          <div className="p-6 space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue & Application Insights</h3>
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs font-bold text-red-500 uppercase tracking-tighter">Live Traffic</span>
              </div>
              <select className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm dark:text-white">
                <option>Real-time Feed</option>
                <option>Last 24 Hours</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Area Chart */}
              <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-6 uppercase tracking-wider">Revenue Trend (Real-time Live Feed)</h4>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#dc2626" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center">
                <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider w-full text-left">Applications by Category</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appTypeData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {appTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </>)}
    </div>
  );
}
