import React, { useEffect, useState } from 'react';
import { RefreshCw, Search, MoreVertical } from 'lucide-react';
import { monitoringService } from '../services/api';

export const TelemetryTable: React.FC = () => {
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const data = await monitoringService.aggregateTelemetry();
      setTelemetry(data);
    } catch (error) {
      console.error("Failed to fetch telemetry:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-[16px]">
        <div className="relative w-[240px] input-focus rounded-[6px] overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 flex items-center transition-colors duration-300">
          <Search className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 ml-2.5" />
          <input 
            type="text" 
            placeholder="Filter endpoints..." 
            className="bg-transparent border-none outline-none text-[12px] text-gray-900 dark:text-gray-100 w-full py-1.5 px-2 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <button onClick={fetchTelemetry} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-[6px] transition-colors duration-300">
          <RefreshCw className={`w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-[8px] transition-colors duration-300">
        <table className="w-full text-[12px] text-left border-collapse">
          <thead className="text-[11px] uppercase tracking-[0.05em] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <tr>
              <th className="px-4 py-3 font-medium">URL</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Latency</th>
              <th className="px-4 py-3 font-medium">Uptime</th>
              <th className="px-4 py-3 font-medium">Last Check</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {telemetry.map((item, idx) => {
              const status = item.status_code >= 200 && item.status_code < 300 ? 'UP' : item.status_code >= 400 ? 'DOWN' : 'DEGRADED';
              const maxLatency = 1000;
              const latencyPercent = Math.min((item.response_time / maxLatency) * 100, 100);

              return (
                <tr key={idx} className={`border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {item.service_name || item.website || 'unknown-endpoint'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-semibold uppercase tracking-wide border ${
                      status === 'UP' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800' : 
                      status === 'DEGRADED' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800' : 
                      'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800'
                    }`}>
                      <span className={`w-1 h-1 rounded-full mr-1.5 ${status === 'UP' ? 'bg-emerald-500 dark:bg-emerald-400' : status === 'DEGRADED' ? 'bg-amber-500 dark:bg-amber-400' : 'bg-rose-600 dark:bg-rose-500'}`}></span>
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 dark:text-gray-400 tabular-nums w-[40px]">{item.response_time.toFixed(0)}ms</span>
                      <div className="w-[60px] h-[4px] bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-300">
                        <div 
                          className={`h-full rounded-full transition-colors duration-300 ${latencyPercent > 80 ? 'bg-rose-600 dark:bg-rose-500' : latencyPercent > 50 ? 'bg-amber-500 dark:bg-amber-400' : 'bg-emerald-500 dark:bg-emerald-400'}`} 
                          style={{ width: `${Math.max(latencyPercent, 5)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 tabular-nums">
                    {item.uptime_status === 'UP' ? '99.98%' : '98.45%'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 tabular-nums text-[11px]">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {telemetry.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No endpoint data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
