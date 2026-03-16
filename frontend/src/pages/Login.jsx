import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Shield, Lock, Eye, EyeOff, AlertCircle, 
  CheckCircle, Zap, Archive, HeadphonesIcon, Car
} from 'lucide-react';

const features = [
  { icon: Shield, label: 'Secure Verification' },
  { icon: Zap, label: 'Instant Processing' },
  { icon: Archive, label: 'Digital Vault' },
  { icon: HeadphonesIcon, label: '24/7 Assistance' },
];

export default function Login() {
  const [role, setRole] = useState('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, role: data.role }));

      if (data.role === 'officer') {
        navigate('/admin/dashboard');
      } else {
        navigate('/citizen-dashboard');
      }
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
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/rto-highway.png')",
          }}
        />
        {/* Blue overlay */}
        <div className="absolute inset-0 bg-red-700/80" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full text-white">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Car size={22} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">Smart RTO</span>
          </div>

          {/* Hero Text */}
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight">
              Digital Road<br />Transport Services
            </h1>
            <p className="text-white/80 text-base leading-relaxed max-w-sm">
              Access your driving license, vehicle registration, and permits through our secure national portal. Efficient, transparent, and paperless governance at your fingertips.
            </p>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                    <Icon size={15} />
                  </div>
                  <span className="text-sm font-medium text-white/90">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-white/50 text-xs">
            © 2024 Smart RTO • Official Government Portal
          </p>
        </div>
      </div>

      {/* ============ RIGHT PANEL ============ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile Logo */}
          <div className="flex items-center space-x-2 lg:hidden">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <Car size={18} />
            </div>
            <span className="text-xl font-bold text-slate-900">Smart RTO</span>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-1 text-sm">
              Please enter your details to access your dashboard.
            </p>
          </div>

          {/* Role Selector */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Select Your Role
            </p>
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  role === 'citizen'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <User size={16} className="mr-2" />
                Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole('officer')}
                className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  role === 'officer'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Shield size={16} className="mr-2" />
                Officer
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center space-x-2 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email or Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={16} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your credentials"
                  autoComplete="username"
                  className="block w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all shadow-sm placeholder-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-sm font-semibold text-red-600 hover:text-red-700">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="block w-full pl-11 pr-12 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all shadow-sm placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Keep me logged in */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="keepLoggedIn"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="h-4 w-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
              />
              <label htmlFor="keepLoggedIn" className="text-sm text-slate-600">
                Keep me logged in
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-60 tracking-wider uppercase"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </span>
              ) : (
                'Sign In to Secure Portal'
              )}
            </button>
            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-red-600 hover:text-red-700 font-bold decoration-2 underline-offset-4 hover:underline transition-all">
                  Sign Up here
                </Link>
              </p>
            </div>
          </form>

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-50 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                or continue with government id
              </span>
            </div>
          </div>

          {/* Gov ID Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center py-3 px-4 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all space-x-2">
              <span className="text-red-600 font-black text-base">Di</span>
              <span>DigiLocker</span>
            </button>
            <button className="flex items-center justify-center py-3 px-4 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all space-x-2">
              <span className="text-orange-500 font-black text-base">e</span>
              <span>e-Pramaan</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
