import React, { useState } from 'react';
import { Moon, Sun, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin123' && password === 'Admin@123') {
      setError('');
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative p-4 transition-colors duration-500">
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-700"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      {/* Branding */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Observe<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">AI</span>
        </h1>
      </div>
      
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] max-w-md w-full mb-8 transition-all duration-300">
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-6">Sign in to your account</h2>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all duration-200"
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all duration-200"
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-md transition-all duration-200"
          >
            Sign In
          </button>
        </form>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] max-w-2xl w-full text-gray-800 dark:text-gray-200 transition-all duration-300">
        <h3 className="text-xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center">
          <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-1.5 rounded-lg mr-3">
            <Activity className="w-5 h-5" />
          </span>
          How to Use & Platform Guide
        </h3>
        
        <div className="space-y-6 text-sm leading-relaxed mt-5">
          <div className="bg-gray-50/50 dark:bg-gray-900/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
            <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">How the Platform Works</h4>
            <p className="text-gray-600 dark:text-gray-400">
              ObserveAI is a comprehensive monitoring dashboard designed to provide real-time insights into your systems. It continuously tracks metrics, aggregates logs, and alerts you to any incidents to ensure optimal performance and uptime.
            </p>
          </div>
          
          <div className="bg-gray-50/50 dark:bg-gray-900/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
            <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">How to Use</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Getting started is incredibly simple. Once you have securely authenticated with the system using your credentials above, <strong className="text-gray-900 dark:text-gray-200">the user has to enter only the URL</strong> to begin monitoring immediately. The platform will automatically orchestrate the necessary checks and populate your dashboard with live data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
