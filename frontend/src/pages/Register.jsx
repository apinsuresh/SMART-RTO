import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Shield, Lock, Eye, EyeOff, AlertCircle, 
  CheckCircle, Zap, Archive, HeadphonesIcon, Car, Mail
} from 'lucide-react';

const features = [
  { icon: Shield, label: 'Secure Verification' },
  { icon: Zap, label: 'Instant Processing' },
  { icon: Archive, label: 'Digital Vault' },
  { icon: HeadphonesIcon, label: '24/7 Assistance' },
];

export default function Register() {
  const [role, setRole] = useState('citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ============ LEFT PANEL ============ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-110"
          style={{
            backgroundImage: "url('/rto-highway.png')",
          }}
        />
        <div className="absolute inset-0 bg-red-700/85 backdrop-blur-[2px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Car size={22} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight italic">Smart RTO</span>
          </div>

          <div className="space-y-8">
            <h1 className="text-5xl font-extrabold leading-tight">
              Join the National<br />Transport Network
            </h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-sm">
              Create your account to access paperless RTO services, track applications in real-time, and manage your vehicle documents securely.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-red-500/30 flex items-center justify-center text-white">
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">
            Official Government Registration Portal • 2026
          </p>
        </div>
      </div>

      {/* ============ RIGHT PANEL ============ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-6 py-12 dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile Logo */}
          <div className="flex items-center space-x-2 lg:hidden mb-8">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
              <Car size={20} />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Smart RTO</span>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Start your digital journey with Smart RTO today.
            </p>
          </div>

          {success ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-2xl text-center space-y-4 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800/40 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-green-900 dark:text-green-100">Registration Successful!</h3>
              <p className="text-green-700 dark:text-green-300">Your account has been created. Redirecting to login...</p>
            </div>
          ) : (
            <>
              {/* Role Selector */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Portal Access</p>
                <div className="flex rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-1.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setRole('citizen')}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                      role === 'citizen'
                        ? 'bg-red-600 text-white shadow-xl shadow-red-200 dark:shadow-none translate-y-[-2px]'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <User size={18} className="mr-2" />
                    Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('officer')}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                      role === 'officer'
                        ? 'bg-red-600 text-white shadow-xl shadow-red-200 dark:shadow-none translate-y-[-2px]'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Shield size={18} className="mr-2" />
                    Officer
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-2xl flex items-center space-x-3 text-sm font-medium animate-in shake duration-300">
                    <AlertCircle size={20} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-500 transition-colors">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all shadow-sm dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-500 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all shadow-sm dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Security Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-500 transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full pl-12 pr-12 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all shadow-sm dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-red-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-600/20 transition-all active:scale-[0.98] disabled:opacity-60 uppercase tracking-[0.2em]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Creating Account...</span>
                    </span>
                  ) : (
                    'Register Now'
                  )}
                </button>

                <div className="text-center pt-2">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-red-600 hover:text-red-700 font-bold decoration-2 underline-offset-4 hover:underline transition-all">
                      Sign In here
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
