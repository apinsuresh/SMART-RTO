import { useState } from 'react';
import Sidebar from './Sidebar';
import Topnav from './Topnav';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950 font-sans">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} role={user.role} />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Topnav setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto w-full bg-slate-50/50 dark:bg-slate-900/50">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
