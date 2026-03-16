import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, AlertCircle, CreditCard, CheckCircle2, FileText, Download } from 'lucide-react';

export default function EChallan() {
  const [vehicleNo, setVehicleNo] = useState('');
  const [challanData, setChallanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:5001/api/challans/vehicle/${vehicleNo}`, {
        headers: { Authorization: token }
      });
      setChallanData(response.data);
    } catch (err) {
      console.error(err);
      setChallanData([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (challanId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://127.0.0.1:5001/api/challans/pay/${challanId}`, {}, {
        headers: { Authorization: token }
      });
      
      setPaymentSuccess(true);
      
      // Update state locally
      const updatedData = challanData.map(c => {
        if (c.challan_id === challanId) {
          return { ...c, status: 'Paid' };
        }
        return c;
      });
      setChallanData(updatedData);
    } catch (err) {
      console.error(err);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">e-Challan System</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Check pending traffic fines, view violations, and make online payments securely.</p>
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
              placeholder="Enter Vehicle Registration No (e.g. MH02AB1234)"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            {loading ? 'Fetching Details...' : 'Get Challan Details'}
          </button>
        </form>
      </div>

      {loading && !paymentSuccess && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      )}

      {paymentSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-300">Payment Successful</p>
              <p className="text-sm text-green-700 dark:text-green-400">Your e-Challan has been paid. Transaction ID: TXN-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
            </div>
          </div>
          <button className="flex items-center px-4 py-2 border border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 rounded hover:bg-green-100 dark:hover:bg-green-900/40 transition text-sm font-medium">
            <Download size={16} className="mr-2" /> Receipt
          </button>
        </div>
      )}

      {challanData && challanData.length === 0 && !loading && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
          <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-900/40 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Pending Challans</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 hover:underline">Great job! There are no traffic violations reported for {vehicleNo.toUpperCase()}.</p>
        </div>
      )}

      {challanData && challanData.length > 0 && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Challan Details for {vehicleNo.toUpperCase()}</h3>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700">
              {challanData.length} records found
            </span>
          </div>

          <div className="grid gap-6">
            {challanData.map((challan) => (
              <div key={challan.challan_id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2">
                
                {/* Left side details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{challan.challan_id}</span>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{challan.violation}</h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        challan.status === 'Paid' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {challan.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <MapPin className="text-slate-400 mt-0.5 mr-2 shrink-0" size={16} />
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Place of Offence</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{challan.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <AlertCircle className="text-slate-400 mt-0.5 mr-2 shrink-0" size={16} />
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Date & Time</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{new Date(challan.date).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex space-x-4">
                    <button className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center transition-colors">
                      <FileText size={16} className="mr-1.5" /> View Evidence
                    </button>
                    {challan.status === 'Paid' && (
                      <button className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center transition-colors">
                        <Download size={16} className="mr-1.5" /> Download Receipt
                      </button>
                    )}
                  </div>
                </div>

                {/* Right side payment section */}
                <div className={`p-6 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 flex flex-col justify-center w-full md:w-64 ${challan.status === 'Paid' ? 'bg-slate-50 dark:bg-slate-900/20' : 'bg-red-50/50 dark:bg-red-900/10'}`}>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center mb-1">Fine Amount</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-6">₹{challan.amount}</p>
                  
                  {challan.status === 'Unpaid' ? (
                    <button 
                      onClick={() => handlePayment(challan.challan_id)}
                      className="w-full flex items-center justify-center py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm font-medium transition-colors"
                    >
                      <CreditCard size={18} className="mr-2" /> Pay Now
                    </button>
                  ) : (
                    <div className="w-full flex justify-center text-green-600 dark:text-green-500 font-medium">
                      <CheckCircle2 size={24} className="mr-2" /> Paid
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
