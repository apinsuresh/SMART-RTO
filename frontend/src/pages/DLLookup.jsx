import React, { useState } from 'react';
import axios from 'axios';
import { Search, UserCircle, Calendar, ShieldCheck, MapPin, FileCheck2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function DLLookup() {
  const [dlNumber, setDlNumber] = useState('');
  const [dob, setDob] = useState('');
  const [dlData, setDlData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // Added error state

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false); // Reset error on new search
    
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.post(`https://smart-rto.onrender.com/api/licenses/lookup`, 
        { dl_number: dlNumber, dob: dob }, // Use dlNumber from state
        { headers: { Authorization: `Bearer ${token}` } } // Correct Authorization header format
      );
      setDlData(response.data);
    } catch (err) {
      console.error("DL lookup failed:", err);
      setError(true); // Set error state
      setDlData(null); // Clear DL data on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Driving License Lookup</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Verify and view details of a driving license by providing DL number and Date of Birth.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm dark:bg-slate-700 dark:text-white uppercase"
              placeholder="DL Number (e.g. KA0120180012345)"
              value={dlNumber}
              onChange={(e) => setDlNumber(e.target.value)}
              required
            />
          </div>
          
          <div className="flex-1 relative">
             <input
              type="date"
              className="block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm dark:bg-slate-700 dark:text-white"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            {loading ? 'Searching...' : 'Search DL'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400 p-4 rounded-xl flex items-center space-x-3">
          <AlertTriangle size={20} className="shrink-0" />
          <p className="text-sm font-medium">Could not find a driving license with the provided details. Please check the DL number and Date of Birth.</p>
        </div>
      )}

      {dlData && !loading && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{dlData.dl_number}</h3>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                  <CheckCircle2 size={14} className="mr-1" />
                  {dlData.status} License
                </p>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${dlData.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800'}`}>
              VALID
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <UserCircle className="text-slate-400 mt-0.5 mr-3" size={18} />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Holder Name</p>
                  <p className="font-medium text-slate-900 dark:text-white text-base">{dlData.holder_name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="text-slate-400 mt-0.5 mr-3" size={18} />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Date of Birth</p>
                  <p className="font-medium text-slate-900 dark:text-white text-base">{dlData.dob}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="text-slate-400 mt-0.5 mr-3" size={18} />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">RTO Location</p>
                  <p className="font-medium text-slate-900 dark:text-white text-base">{dlData.rto_location}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="text-slate-400 mt-0.5 mr-3" size={18} />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Valid Till (Non-Transport)</p>
                  <p className="font-medium text-slate-900 dark:text-white text-base">{new Date(dlData.validity).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="text-slate-400 mt-1 mr-3 shrink-0" size={20} />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Issuing Authority (RTO)</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{dlData.rto_name}</p>
                </div>
              </div>

              <div className="flex items-start sm:col-span-2 mt-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <FileCheck2 className="text-slate-400 mt-1 mr-3 shrink-0" size={20} />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Class of Vehicle(s)</p>
                  <div className="flex flex-wrap gap-2">
                    {dlData.vehicle_classes.map((vClass, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-sm font-semibold border border-slate-200 dark:border-slate-600">
                        {vClass}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
