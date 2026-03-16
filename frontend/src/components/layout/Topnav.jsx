import { useState, useEffect } from 'react';
import { Menu, Bell, Sun, Moon, Search, HelpCircle, ChevronDown, Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Topnav({ setIsOpen }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice Search not supported in this browser.");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
    };

    recognition.start();
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 sticky top-0 shadow-sm">
      <div className="flex items-center flex-1 max-w-xl">
        <button 
          onClick={() => setIsOpen(true)}
          className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mr-4"
        >
          <Menu size={24} />
        </button>
        
        {/* Centered Search Bar */}
        <div className="relative w-full hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-12 py-2.5 bg-slate-100 dark:bg-slate-800 border-transparent focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-700 rounded-xl text-sm transition-all outline-none"
            placeholder="Search application ID, vehicle number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            onClick={handleVoiceSearch}
            className={`absolute inset-y-0 right-0 pr-4 flex items-center ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-red-500'}`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block">
          <HelpCircle size={20} />
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>

        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 group focus:outline-none"
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-slate-900 dark:text-white leading-none whitespace-nowrap">{user.name || 'Indhu S'}</span>
              <span className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-tight">
                {user.role === 'officer' ? 'RTO Officer • HQ01' : 'DL Holder • KA01'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-700 group-hover:border-red-500 transition-colors">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=random&color=fff`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none border border-slate-100 dark:border-slate-700">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
              </div>
              <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Settings</a>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
