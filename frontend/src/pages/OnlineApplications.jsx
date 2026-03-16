import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, Upload, CheckCircle2, ChevronRight, AlertCircle, Calendar, User, MapPin, ShieldAlert } from 'lucide-react';

export default function OnlineApplications() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState(null); 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    bloodGroup: '',
    processingRto: 'Pune RTO (MH12)'
  });

  const [isAiScanning, setIsAiScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');

  const simulateAiScan = (type) => {
    setIsAiScanning(true);
    setScanStatus(`AI Analyzing ${type}...`);
    setTimeout(() => {
      setScanStatus(`Verified: ${type} Authentic`);
      setTimeout(() => setIsAiScanning(false), 1500);
    }, 2000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const serviceMap = {
      'll': 'Learner License',
      'dl': 'Permanent License',
      'vr': 'Vehicle Registration'
    };

    const payload = {
      service_type: serviceMap[selectedService],
      applicant_name: `${formData.firstName} ${formData.lastName}`,
      dob: formData.dob,
      address: formData.address,
      processing_rto: formData.processingRto
    };
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://127.0.0.1:5001/api/applications`, payload, {
        headers: { Authorization: token }
      });
      
      setSubmittedAppId(response.data.tracking_id);
      setStep(4);
    } catch (err) {
      console.error(err);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const services = [
    { id: 'll', title: 'Learner License', desc: 'Apply for a new Learner License' },
    { id: 'dl', title: 'Permanent License', desc: 'Apply for Permanent Driving License' },
    { id: 'vr', title: 'Vehicle Registration', desc: 'Register a new vehicle with RTO' },
  ];

  if (submittedAppId && step === 4) {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center shadow-sm">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application Submitted!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Your application has been successfully submitted to the RTO for verification.</p>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6 max-w-md mx-auto border border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tracking ID</p>
            <p className="text-2xl font-mono font-bold text-red-600 dark:text-red-400">{submittedAppId}</p>
          </div>
          
          <div className="mt-8 space-x-4">
            <button 
              onClick={() => { setSubmittedAppId(null); setStep(1); setSelectedService(''); }}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Start New Application
            </button>
            <button 
              onClick={() => navigate('/citizen/tracking')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition"
            >
              Track Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Online Application System</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Submit your details and securely upload documents to apply for RTO services.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        
        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
          <div className={`flex items-center ${step >= 1 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 1 ? 'border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/30' : 'border-slate-300 dark:border-slate-600'}`}>1</div>
            <span className="ml-3 font-medium hidden sm:block">Select Service</span>
          </div>
          <div className={`flex-1 mx-4 h-0.5 ${step >= 2 ? 'bg-red-600 dark:bg-red-400' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 2 ? 'border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/30' : 'border-slate-300 dark:border-slate-600'}`}>2</div>
            <span className="ml-3 font-medium hidden sm:block">Applicant Details</span>
          </div>
          <div className={`flex-1 mx-4 h-0.5 ${step >= 3 ? 'bg-red-600 dark:bg-red-400' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
          <div className={`flex items-center ${step >= 3 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 3 ? 'border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/30' : 'border-slate-300 dark:border-slate-600'}`}>3</div>
            <span className="ml-3 font-medium hidden sm:block">Upload Docs</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">What do you want to apply for?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((svc) => (
                  <div 
                    key={svc.id}
                    onClick={() => setSelectedService(svc.id)}
                    className={`cursor-pointer border rounded-xl p-6 transition-all ${
                      selectedService === svc.id 
                        ? 'border-red-600 bg-red-50 dark:bg-red-900/20 dark:border-red-500 ring-1 ring-red-600' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700'
                    }`}
                  >
                    <FileText className={`mb-4 w-8 h-8 ${selectedService === svc.id ? 'text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <h4 className={`font-semibold text-lg mb-1 ${selectedService === svc.id ? 'text-red-700 dark:text-red-300' : 'text-slate-900 dark:text-white'}`}>{svc.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{svc.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  type="button" 
                  disabled={!selectedService}
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition flex items-center"
                >
                  Continue <ChevronRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Personal Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                  <select name="bloodGroup" required value={formData.bloodGroup} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-700 dark:text-white">
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Processing RTO</label>
                  <select name="processingRto" required value={formData.processingRto} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-700 dark:text-white">
                    <option value="Pune RTO (MH12)">Pune RTO (MH12)</option>
                    <option value="Mumbai South (MH01)">Mumbai South (MH01)</option>
                    <option value="Bangalore Central (KA01)">Bangalore Central (KA01)</option>
                    <option value="Delhi Central (DL01)">Delhi Central (DL01)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Permanent Address</label>
                  <textarea name="address" required rows="3" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-700 dark:text-white"></textarea>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  Back
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    if (!formData.firstName || !formData.lastName || !formData.dob || !formData.address || !formData.bloodGroup) {
                      alert('Please fill out all required fields before continuing.');
                      return;
                    }
                    setStep(3);
                  }} 
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center"
                >
                  Continue <ChevronRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Upload clear, scanned copies. Max size 5MB per file (PDF, JPG, PNG).
                  </p>
                </div>
              </div>

              {isAiScanning && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 p-6 rounded-xl text-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <ShieldAlert className="h-10 w-10 text-red-600 mb-2" />
                    <p className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-widest">{scanStatus}</p>
                    <div className="mt-4 w-48 h-1 bg-red-100 dark:bg-red-900/50 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 w-1/2" style={{ animation: 'shimmer 2s infinite' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  <Upload className="w-8 h-8 text-slate-400 mb-3" />
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Proof of Address</p>
                  <p className="text-xs text-slate-500 mb-4">Aadhar, Passport, Utility Bill</p>
                  <input 
                    type="file" 
                    onChange={() => simulateAiScan('Address Proof')}
                    className="text-sm ml-8 text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" 
                  />
                </div>

                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  <Upload className="w-8 h-8 text-slate-400 mb-3" />
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Proof of Age</p>
                  <p className="text-xs text-slate-500 mb-4">Birth Certificate, PAN Card</p>
                  <input 
                    type="file" 
                    onChange={() => simulateAiScan('Age Proof')}
                    className="text-sm ml-8 text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" 
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={() => setStep(2)} className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  Back
                </button>
                <button type="submit" disabled={loading || isAiScanning} className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center shadow-sm disabled:opacity-50">
                  {loading ? 'Submitting...' : 'Submit Application'} <CheckCircle2 className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
