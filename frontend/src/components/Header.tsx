import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Moon, Sun, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const { theme, toggleTheme } = useTheme();
  
  const getPageTitle = () => {
    if (path === '/') return 'Dashboard';
    const segment = path.split('/')[1];
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="h-[48px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shrink-0 relative z-10 transition-colors duration-300">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center text-[13px]">
        <span className="text-gray-400 dark:text-gray-500 font-medium">ObserveAI</span>
        <span className="text-gray-400 dark:text-gray-500 mx-2">/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{getPageTitle()}</span>
      </div>
      
      {/* Center: Search */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        <div className="relative w-[320px] input-focus rounded-md overflow-hidden bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center transition-all duration-300">
          <Search className="w-4 h-4 text-gray-500 ml-3" />
          <input 
            type="text" 
            placeholder="Search logs, metrics... (⌘K)" 
            className="bg-transparent border-none outline-none text-[13px] text-gray-900 dark:text-gray-100 w-full py-1.5 px-2 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>
      
      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        <button className="flex items-center space-x-1.5 px-3 h-[32px] rounded-md bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white transition-colors btn-active text-[13px] font-medium">
          <Plus className="w-4 h-4" />
          <span>Add Monitor</span>
        </button>
        
        <button className="relative p-1.5 rounded text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-500"></span>
        </button>
        
        <button 
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-[36px] h-[36px] flex items-center justify-center"
        >
          {theme === 'light' ? <Moon className="w-5 h-5 transition-transform duration-200" /> : <Sun className="w-5 h-5 transition-transform duration-200" />}
        </button>
      </div>
    </header>
  );
};
