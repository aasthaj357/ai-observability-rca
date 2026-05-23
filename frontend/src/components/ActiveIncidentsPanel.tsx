import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const ActiveIncidentsPanel: React.FC<{ incidents: any[] }> = ({ incidents }) => {
  const displayIncidents = incidents.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[16px] flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-[8px] mb-[16px]">
        <h3 className="text-[11px] uppercase font-semibold tracking-[0.08em] text-gray-500 dark:text-gray-400">
          Active Incidents
        </h3>
        <Link to="/incidents" className="text-[11px] font-medium text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 flex items-center">
          View All <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>
      
      {displayIncidents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-[13px]">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
          </div>
          No active incidents
        </div>
      ) : (
        <div className="flex-1 space-y-3">
          {displayIncidents.map((incident, idx) => (
            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[8px] card-hover cursor-pointer group">
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-semibold uppercase ${
                    incident.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400' : 
                    incident.severity === 'HIGH' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' : 
                    'bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-400 border dark:border-gray-700'
                  }`}>
                    {incident.severity}
                  </span>
                  <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {incident.title}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                  {incident.timeAgo || 'Just now'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex space-x-1">
                  {incident.services?.slice(0,2).map((svc: string, i: number) => (
                    <span key={i} className="text-[10px] bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      {svc}
                    </span>
                  ))}
                  {incident.services?.length > 2 && (
                    <span className="text-[10px] bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      +{incident.services.length - 2}
                    </span>
                  )}
                </div>
                <Link to="/incidents" className="text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
