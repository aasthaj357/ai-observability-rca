import React from 'react';
import { LogPanel } from '../components/LogPanel';

export const LogsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight transition-colors duration-300">Application Logs</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Live streaming terminal feed for deep-dive troubleshooting.</p>
      </div>

      {/* Reusing LogPanel but giving it the full remaining height */}
      <div className="flex-1 min-h-0">
        <LogPanel fullPage={true} />
      </div>
    </div>
  );
};
