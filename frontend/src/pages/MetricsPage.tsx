import React, { useState } from 'react';
import { TelemetryTable } from '../components/TelemetryTable';
import { MetricsChartsGrid } from '../components/MetricsChartsGrid';

export const MetricsPage: React.FC = () => {
  const [activeUrl, setActiveUrl] = useState('example.com');
  const [timeRange, setTimeRange] = useState('1h');
  
  const urls = ['example.com', 'google.com', 'github.com', 'api.internal.net'];
  const ranges = ['1h', '6h', '24h', '7d'];

  return (
    <div className="flex flex-col h-full space-y-[24px]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-semibold text-gray-900 dark:text-gray-100 leading-[1.4]">System Metrics</h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-[1.6]">Detailed telemetry, traffic analysis, and endpoint health.</p>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* URL Monitor Selector */}
          <div className="flex bg-white dark:bg-gray-900 p-1 rounded-full border border-gray-200 dark:border-gray-800 transition-colors duration-300">
            {urls.map(url => (
              <button
                key={url}
                onClick={() => setActiveUrl(url)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                  activeUrl === url 
                    ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {url}
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex bg-white dark:bg-gray-900 p-1 rounded-md border border-gray-200 dark:border-gray-800 transition-colors duration-300">
            {ranges.map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-[4px] text-[12px] font-medium transition-colors ${
                  timeRange === range 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-300 dark:border-gray-700' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-transparent'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <MetricsChartsGrid activeUrl={activeUrl} timeRange={timeRange} />

      {/* Endpoint Health Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[16px] transition-colors duration-300">
        <h3 className="text-[11px] uppercase font-semibold tracking-[0.08em] text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-800 pb-[8px] mb-[16px]">
          Endpoint Health
        </h3>
        <TelemetryTable />
      </div>
    </div>
  );
};
