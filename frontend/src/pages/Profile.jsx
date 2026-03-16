import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  Bell, 
  Download, 
  Eye, 
  Edit3,
  ChevronRight,
  ShieldIcon,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const API_BASE_URL = 'https://smart-rto.onrender.com/api/auth';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    dob: '',
    gender: '',
    aadhaar: '',
    phone: '',
    currentAddress: '',
    permanentAddress: ''
  });

  const [editPersonal, setEditPersonal] = useState(false);
  const [editContact, setEditContact] = useState(false);
  
  const [tempData, setTempData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data);
      setTempData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_BASE_URL}/profile`, tempData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserData(tempData);
      setSuccess('Profile updated successfully!');
      if (section === 'personal') setEditPersonal(false);
      if (section === 'contact') setEditContact(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (section) => {
    setTempData(userData);
    if (section === 'personal') setEditPersonal(false);
    if (section === 'contact') setEditContact(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Notifications */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium border border-red-100">
          <X size={18} /> {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium border border-green-100">
          <ShieldCheck size={18} /> {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Details */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Personal Details
              </h3>
              {!editPersonal ? (
                <button 
                  onClick={() => setEditPersonal(true)}
                  className="text-sm font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <Edit3 size={14} /> Edit
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleCancel('personal')}
                    className="text-sm font-bold text-slate-500 hover:text-slate-800"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleSave('personal')}
                    className="bg-red-600 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-700 shadow-lg shadow-red-600/20"
                    disabled={saving}
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
                    SAVE
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <EditableField 
                label="FULL NAME" 
                value={tempData.name} 
                isEditing={editPersonal} 
                onChange={(v) => setTempData({...tempData, name: v})}
              />
              <EditableField 
                label="DATE OF BIRTH" 
                value={tempData.dob} 
                isEditing={editPersonal} 
                onChange={(v) => setTempData({...tempData, dob: v})}
                placeholder="DD Month YYYY"
              />
              <EditableField 
                label="GENDER" 
                value={tempData.gender} 
                isEditing={editPersonal} 
                onChange={(v) => setTempData({...tempData, gender: v})}
                placeholder="Male / Female / Other"
              />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AADHAAR NUMBER</span>
                {editPersonal ? (
                  <input 
                    className="text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-red-500"
                    value={tempData.aadhaar}
                    onChange={(e) => setTempData({...tempData, aadhaar: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{userData.aadhaar || 'Not Updated'}</span>
                    <ShieldCheck size={16} className="text-green-500" />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Contact Information
              </h3>
              {!editContact ? (
                <button 
                  onClick={() => setEditContact(true)}
                  className="text-sm font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <Edit3 size={14} /> Edit
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleCancel('contact')}
                    className="text-sm font-bold text-slate-500 hover:text-slate-800"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleSave('contact')}
                    className="bg-red-600 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-700 shadow-lg shadow-red-600/20"
                    disabled={saving}
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
                    SAVE
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EMAIL ADDRESS</span>
                <p className="text-sm font-bold text-slate-400 leading-relaxed cursor-not-allowed">{userData.email}</p>
              </div>
              <EditableField 
                label="PHONE NUMBER" 
                value={tempData.phone} 
                isEditing={editContact} 
                onChange={(v) => setTempData({...tempData, phone: v})}
              />
              <EditableField 
                label="CURRENT ADDRESS" 
                value={tempData.currentAddress} 
                isEditing={editContact} 
                onChange={(v) => setTempData({...tempData, currentAddress: v})}
              />
              <EditableField 
                label="PERMANENT ADDRESS" 
                value={tempData.permanentAddress} 
                isEditing={editContact} 
                onChange={(v) => setTempData({...tempData, permanentAddress: v})}
              />
            </div>
          </section>

          {/* Verified Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verified Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocumentCard 
                title="Driving License" 
                subtitle="DL No: MH12 20180012345"
                icon={<ShieldIcon size={24} className="text-red-600" />}
              />
              <DocumentCard 
                title="Vehicle RC" 
                subtitle="Reg No: MH 12 AB 1234"
                icon={<MapPin size={24} className="text-red-600" />}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Settings & Help */}
        <div className="space-y-6">
          
          {/* Account Settings */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Settings</h3>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Security Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-2 text-slate-400">
                  <Lock size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Security</span>
                </div>
                <SettingItem label="Change Password" subtext="Last updated 3 months ago" icon={<ChevronRight size={18} />} />
                <SettingItem label="Two-Factor Auth" subtext="Enabled (SMS)" icon={<ChevronRight size={18} />} status="Enabled (SMS)" />
              </div>

              {/* Notifications Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 px-2 text-slate-400">
                  <Bell size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Notifications</span>
                </div>
                <ToggleItem label="Email Alerts" defaultChecked />
                <ToggleItem label="SMS Alerts" defaultChecked />
                <ToggleItem label="Marketing Info" />
              </div>
            </div>
          </section>

          {/* Need Help Box */}
          <div className="bg-red-600 rounded-3xl p-6 text-white shadow-xl shadow-red-600/20 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
            <h4 className="text-xl font-black mb-3 text-white">Need Help?</h4>
            <p className="text-sm text-red-50 font-medium mb-6 leading-relaxed opacity-90">
              Questions regarding your document verification or data accuracy?
            </p>
            <Link 
              to="/citizen/sahayak"
              className="block w-full py-3 bg-white text-red-600 rounded-xl text-center text-sm font-black transition-all hover:bg-red-50 active:scale-95 shadow-lg"
            >
              Contact Support
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

function EditableField({ label, value, isEditing, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</span>
      {isEditing ? (
        <input 
          className="text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-red-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
          {value || <span className="text-slate-400 font-medium">Not Updated</span>}
        </p>
      )}
    </div>
  );
}

function DocumentCard({ title, subtitle, icon }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-center gap-4 transition-all hover:border-red-500/30 group">
      <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{title}</h4>
          <span className="text-[9px] font-black bg-green-50 dark:bg-green-900/20 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Verified</span>
        </div>
        <p className="text-xs text-slate-500 font-medium truncate mb-3">{subtitle}</p>
        <div className="flex items-center gap-3">
          <button className="text-[10px] font-black text-red-600 bg-red-50 dark:bg-red-900/10 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-all">VIEW</button>
          <button className="text-[10px] font-black text-slate-500 hover:text-red-600 transition-colors uppercase tracking-widest">Download</button>
        </div>
      </div>
    </div>
  );
}

function SettingItem({ label, subtext, icon, status }) {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group">
      <div className="flex flex-col items-start">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</span>
        <span className="text-[10px] text-slate-400 font-medium">{subtext}</span>
      </div>
      <div className="flex items-center gap-2">
        {status && <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{status}</span>}
        <div className="text-slate-300 group-hover:text-red-500 transition-colors">
          {icon}
        </div>
      </div>
    </button>
  );
}

function ToggleItem({ label, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between px-3">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
      <button 
        onClick={() => setChecked(!checked)}
        className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${checked ? 'bg-red-600' : 'bg-slate-200 dark:bg-slate-700'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
