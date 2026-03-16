import React, { useState } from 'react';
import axios from 'axios';
import { Search, Car, Calendar, MapPin, User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VehicleLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setVehicleData(null); // Clear previous data on new search
    
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.get(`https://smart-rto.onrender.com/api/vehicles/${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` } // Corrected Authorization header format
      });
      setVehicleData(response.data);
    } catch (err) {
      console.error("Error fetching vehicle data:", err);
      setError(true);
      setVehicleData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vehicle Information Lookup</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Search for comprehensive vehicle registration details using a registration number.</p>
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
              placeholder="Enter Registration No (e.g. MH02AB1234)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            {loading ? 'Searching...' : 'Search Vehicle'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-center space-x-3">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">Could not find vehicle details. Please check the registration number and try again.</p>
        </div>
      )}

      {vehicleData && !loading && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
                <Car size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{vehicleData.reg_no}</h3>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                  <CheckCircle2 size={14} className="mr-1" />
                  {vehicleData.status} Registration
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="text-slate-400 mt-0.5 mr-3" size={18} />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Owner Name</p>
                  <p className="font-medium text-slate-900 dark:text-white text-base">{vehicleData.owner_name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Car className="text-slate-400 mt-0.5 mr-3" size={18} />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Vehicle Class</p>
                  <p className="font-medium text-slate-900 dark:text-white text-base">{vehicleData.vehicle_class}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="text-slate-400 mt-0.5 mr-3" size={18} />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Registering Authority</p>
                  <p className="font-medium text-slate-900 dark:text-white text-base">{vehicleData.rto_location}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="text-slate-400 mt-0.5 mr-3" size={18} />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Registration Date</p>
                  <p className="font-medium text-slate-900 dark:text-white text-base">{new Date(vehicleData.registration_date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="text-slate-400 mt-0.5 mr-3" size={18} />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Fitness Valid Upto</p>
                  <p className="font-medium text-slate-900 dark:text-white text-base">{new Date(vehicleData.fitness_validity).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Car className="text-slate-400 mt-0.5 mr-3" size={18} />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Maker / Model</p>
                  <p className="font-medium text-slate-900 dark:text-white text-base">{vehicleData.maker_model}</p>
                </div>
              </div>

              <div className="flex items-start">
                <AlertCircle className="text-slate-400 mt-0.5 mr-3" size={18} />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Fuel Type</p>
                  <p className="font-medium text-slate-900 dark:text-white text-base">{vehicleData.fuel_type}</p>
                  <div className="flex space-x-3 mt-1">
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
