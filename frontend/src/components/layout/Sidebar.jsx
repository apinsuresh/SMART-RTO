import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileStack, 
  ShieldEllipsis, 
  CreditCard,
  UserCircle,
  Menu,
  X,
  LifeBuoy,
  ClipboardList,
  Car,
  Settings,
  ShieldAlert,
  FileText,
  Bot
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({ isOpen, setIsOpen, role }) {
  const location = useLocation();
  const navigate = useNavigate();

  const citizenLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/citizen-dashboard' },
    { name: 'Smart RTO', icon: Bot, path: '/citizen/sahayak' },
    { name: 'Applications', icon: FileStack, path: '/citizen/applications' },
    { name: 'Track Application', icon: ClipboardList, path: '/citizen/tracking' },
    { name: 'My Vehicles', icon: ShieldEllipsis, path: '/citizen/vehicle' },
    { name: 'e-Challan', icon: CreditCard, path: '/citizen/echallan' },
    { name: 'Profile', icon: UserCircle, path: '/citizen/settings' },
  ];

  const adminLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'All Applications', icon: FileText, path: '/admin/applications' },
    { name: 'Manage Users', icon: ShieldAlert, path: '/admin/users' },
    { name: 'Reports & Analytics', icon: Settings, path: '/admin/reports' },
  ];

  const links = role === 'officer' ? adminLinks : citizenLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="flex flex-col h-20 px-6 justify-center border-b border-slate-50 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <Car size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Smart RTO</span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider leading-none">Citizen Portal</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-200 dark:shadow-none font-medium' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={20} className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-red-500'}`} />
                <span className="text-sm font-semibold">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Help Center Box */}
        <div className="p-4 mt-auto">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border border-red-100 dark:border-red-900/30">
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-1 block">Help Center</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-snug">Facing issues with your application?</p>
            <button 
              onClick={() => navigate('/citizen/sahayak')}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Get Support
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
