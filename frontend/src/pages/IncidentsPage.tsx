import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, ChevronRight, Activity, Clock, ShieldCheck } from 'lucide-react';
import { correlationService } from '../services/api';
import { AIInsightsPanel } from '../components/AIInsightsPanel';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      try {
        const response = await correlationService.getRecentIncidents();
        if (response && response.data) {
          setIncidents(response.data);
        } else if (response && response.incidents) {
          setIncidents(response.incidents);
        }
      } catch (e) {
        console.error("Failed to fetch recent incidents", e);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  const activeCount = incidents.filter(i => i.status === 'Active').length;
  
  const filteredIncidents = activeTab === 'All' 
    ? incidents 
    : incidents.filter(inc => inc.severity?.toUpperCase() === activeTab.toUpperCase());
  
  return (
    <div className="flex flex-col h-full space-y-[24px]">
      {/* Page Title */}
      <div>
        <h1 className="text-[20px] font-semibold text-gray-900 dark:text-gray-100 leading-[1.4]">Incidents</h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-[1.6]">Review historical AI-correlated anomalies and service disruptions.</p>
      </div>

      {/* Top summary bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[8px] p-[16px] flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950 flex items-center justify-center">
              <Activity className="w-5 h-5 text-rose-600 dark:text-rose-500" />
            </div>
            <div>
              <div className="text-[12px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Active</div>
              <div className="text-[24px] font-semibold text-rose-600 dark:text-rose-500 tabular-nums leading-none mt-1">{activeCount}</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[8px] p-[16px] flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            </div>
            <div>
              <div className="text-[12px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Resolved Today</div>
              <div className="text-[24px] font-semibold text-gray-900 dark:text-gray-100 tabular-nums leading-none mt-1">4</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[8px] p-[16px] flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <div className="text-[12px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">MTTR Avg</div>
              <div className="text-[24px] font-semibold text-gray-900 dark:text-gray-100 tabular-nums leading-none mt-1">12m</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px] bg-white dark:bg-gray-900 p-[12px] rounded-[8px] border border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="flex space-x-2">
          {['All', 'Critical', 'High', 'Medium', 'Low'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-300 dark:border-gray-700' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-[12px]">
          <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[6px] text-[12px] text-gray-900 dark:text-gray-100 px-3 py-1.5 outline-none focus:border-gray-300 dark:focus:border-gray-600 transition-colors duration-300">
            <option>Last 24h</option>
            <option>Last 7d</option>
            <option>Last 30d</option>
          </select>
          <div className="relative w-[240px] input-focus rounded-[6px] overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center transition-colors duration-300">
            <Search className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 ml-2.5" />
            <input 
              type="text" 
              placeholder="Search incidents..." 
              className="bg-transparent border-none outline-none text-[12px] text-gray-900 dark:text-gray-100 w-full py-1.5 px-2 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Incident list */}
      <div className="flex-1 space-y-[12px]">
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400 text-[13px] shimmer h-12 w-full rounded"></div>
        ) : filteredIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[48px] text-gray-500 dark:text-gray-400">
            <ShieldCheck className="w-[48px] h-[48px] mb-[16px] text-emerald-500 dark:text-emerald-600 opacity-50" />
            <p className="text-[13px]">No incidents matching criteria.</p>
          </div>
        ) : (
          filteredIncidents.map((inc, idx) => {
            const isExpanded = expandedId === inc.incident_id || expandedId === inc.id;
            const incidentId = inc.incident_id || inc.id;
            const severityColor = inc.severity === 'CRITICAL' ? 'bg-rose-600 dark:bg-rose-500' : inc.severity === 'HIGH' ? 'bg-amber-500 dark:bg-amber-400' : 'bg-slate-400 dark:bg-slate-500';
            const severityBg = inc.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800' : inc.severity === 'HIGH' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800' : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800';
            
            return (
              <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[8px] overflow-hidden flex flex-col transition-all duration-300">
                {/* Main Card Row */}
                <div 
                  className="flex items-stretch cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : incidentId)}
                >
                  <div className={`w-[4px] ${severityColor} shrink-0`}></div>
                  <div className="flex-1 p-[16px] flex flex-col md:flex-row md:items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-0.5 rounded-[4px] border text-[10px] font-semibold uppercase ${severityBg}`}>
                          {inc.severity}
                        </span>
                        <span className="text-[13px] font-mono text-gray-500 dark:text-gray-400">{incidentId}</span>
                        <span className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">{inc.title || 'System Anomaly Detected'}</span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 ml-2">{inc.time_relative || 'Just now'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {inc.services?.slice(0,3).map((svc: string, i: number) => (
                          <span key={i} className="text-[11px] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                            {svc}
                          </span>
                        ))}
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded transition-colors duration-300">
                          Source: {inc.source || 'Synthetic'}
                        </span>
                      </div>
                      
                      <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-2 max-w-3xl">
                        {inc.description || 'Elevated error rates and latency anomalies detected correlating across multiple services. Root cause analysis initiated automatically.'}
                      </p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center md:flex-col md:items-end space-x-4 md:space-x-0 md:space-y-2">
                      <button className="px-3 py-1.5 rounded-[6px] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-[12px] font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center">
                        View RCA {isExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronRight className="w-3.5 h-3.5 ml-1" />}
                      </button>
                      <span className={`px-2 py-1 rounded-[4px] text-[10px] font-semibold uppercase border ${inc.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800' : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800'}`}>
                        {inc.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Expanded AI Panel */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-[16px] transition-colors duration-300">
                    <AIInsightsPanel activeIncident={inc} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
