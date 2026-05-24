import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  AlertCircle, 
  BarChart2, 
  Box, 
  Settings, 
  TerminalSquare,
  Sparkles,
  Flame,
  LogOut
} from 'lucide-react';

const navItems = [
  { icon: Activity, label: 'Dashboard', path: '/' },
  { icon: BarChart2, label: 'Metrics', path: '/metrics' },
  { icon: AlertCircle, label: 'Incidents', path: '/incidents' },
  { icon: TerminalSquare, label: 'Logs', path: '/logs' },
  { icon: Box, label: 'Deployments', path: '/deployments' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-[220px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen shrink-0 relative z-20 transition-colors duration-300">
      <div className="h-[48px] flex items-center px-4 border-b border-gray-200 dark:border-gray-800 shrink-0 transition-colors duration-300">
        <Flame className="text-rose-600 dark:text-rose-500 w-4 h-4 mr-2" />
        <span className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 tracking-wide">ObserveAI</span>
      </div>
      
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-[12px] h-[40px] rounded text-[13px] font-medium transition-colors duration-300 border-l-2 ${
                isActive 
                  ? 'border-rose-600 bg-rose-50 text-rose-700 dark:border-rose-500 dark:bg-rose-950 dark:text-rose-400' 
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
              }`
            }
          >
            <item.icon className="w-[20px] h-[20px] mr-3 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0 transition-colors duration-300">
        <button className="w-full flex items-center justify-between px-[12px] h-[40px] rounded bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:hover:bg-rose-900 dark:border-rose-800 transition-colors duration-300 btn-active mb-4">
          <div className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-[13px] font-medium">AI Copilot</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-500 pulse-dot"></span>
        </button>

        <div className="flex items-center justify-between px-2 mt-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold text-[13px] transition-colors duration-300">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-gray-900 dark:text-gray-100 leading-tight">Admin User</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">Platform Ops</span>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              window.location.href = '/';
            }}
            className="p-1.5 text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
