import React from 'react';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export const IncidentCards: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <span>Active Incidents</span>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 bg-slate-800 rounded-full text-slate-300">2 Active</span>
      </div>
      <div className="card-body p-0 divide-y divide-slate-800">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 hover:bg-slate-800/30 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-danger' : 'bg-warning'}`}></span>
                <span className="font-medium text-sm">High Latency API</span>
              </div>
              <span className="text-xs text-slate-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                12m ago
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">Database connection pool exhausted causing query timeouts on the main cluster.</p>
            <div className="flex justify-between items-center text-xs">
              <span className="text-primary group-hover:underline">View details</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
