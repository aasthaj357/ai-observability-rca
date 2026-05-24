import React, { useEffect, useState } from 'react';

const mockServices = [
  { name: 'API Gateway', status: 'healthy', latency: 45 },
  { name: 'Auth Service', status: 'healthy', latency: 120 },
  { name: 'Database', status: 'warning', latency: 350 },
  { name: 'CDN', status: 'healthy', latency: 12 },
  { name: 'Payment Service', status: 'critical', latency: 1500 },
];

export const SystemHealth: React.FC<{ activeIncident?: boolean }> = ({ activeIncident }) => {
  const [services, setServices] = useState(mockServices);

  useEffect(() => {
    // If there's an active incident, simulate degradation
    if (activeIncident) {
      setServices([
        { name: 'API Gateway', status: 'warning', latency: 450 },
        { name: 'Auth Service', status: 'healthy', latency: 120 },
        { name: 'Database', status: 'critical', latency: 2500 },
        { name: 'CDN', status: 'healthy', latency: 15 },
        { name: 'Payment Service', status: 'critical', latency: 5000 },
      ]);
    } else {
      setServices(mockServices);
    }
  }, [activeIncident]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[16px] flex flex-col">
      <h3 className="text-[11px] uppercase font-semibold tracking-[0.08em] text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-800 pb-[8px] mb-[16px]">
        System Health
      </h3>
      <div className="space-y-3">
        {services.map((svc, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-[6px] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center space-x-3 overflow-hidden">
              <span className={`flex-shrink-0 w-2 h-2 rounded-full ${
                svc.status === 'healthy' ? 'bg-emerald-500 dark:bg-emerald-400' : 
                svc.status === 'warning' ? 'bg-amber-500 dark:bg-amber-400 pulse-dot' : 'bg-rose-600 dark:bg-rose-500 pulse-dot'
              }`}></span>
              <span className="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate">{svc.name}</span>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0 ml-2">
              <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-semibold uppercase ${
                svc.status === 'healthy' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 
                svc.status === 'warning' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
              }`}>
                {svc.status}
              </span>
              <span className="text-[12px] tabular-nums text-gray-500 dark:text-gray-400 min-w-[48px] text-right">
                {svc.latency}ms
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
