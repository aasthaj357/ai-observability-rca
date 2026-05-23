import React, { useState } from 'react';
import { Globe, Activity, ShieldCheck, Clock } from 'lucide-react';
import { monitoringService } from '../services/api';

export const WebsiteMonitorPanel: React.FC<{ onTelemetryUpdate: (data: any) => void }> = ({ onTelemetryUpdate }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const data = await monitoringService.checkWebsite(url);
      setResult(data);
      onTelemetryUpdate(data);
    } catch (error) {
      console.error("Failed to check website:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] flex flex-col h-full transition-colors duration-300">
      <div className="p-[16px] border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">Website Health Monitor</span>
        </div>
      </div>
      <div className="p-[16px] flex flex-col space-y-6 flex-1">
        <form onSubmit={handleCheck} className="flex space-x-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)" 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-rose-500/50 dark:focus:border-rose-400/50 focus:ring-1 focus:ring-rose-500/50 dark:focus:ring-rose-400/50 transition-colors duration-300"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Checking...' : 'Ping Test'}
          </button>
        </form>

        {result && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700/50 flex flex-col items-center justify-center transition-colors duration-300">
              <Activity className={`w-6 h-6 mb-2 ${result.uptime_status === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
              <span className="font-semibold text-lg uppercase tracking-wide text-gray-900 dark:text-gray-100">{result.uptime_status}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700/50 flex flex-col items-center justify-center transition-colors duration-300">
              <Clock className="w-6 h-6 mb-2 text-purple-600 dark:text-purple-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Latency</span>
              <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">{result.response_time.toFixed(0)} ms</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700/50 flex flex-col items-center justify-center transition-colors duration-300">
              <ShieldCheck className={`w-6 h-6 mb-2 ${result.ssl_status === 'valid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">SSL Cert</span>
              <span className="font-semibold text-lg capitalize text-gray-900 dark:text-gray-100">{result.ssl_status}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
