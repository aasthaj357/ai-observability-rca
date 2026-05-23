import React, { useEffect, useState } from 'react';
import { Sparkles, Target, Server, Wrench, MessageSquare } from 'lucide-react';
import { aiService } from '../services/api';

export const AIInsightsPanel: React.FC<{ activeIncident?: any }> = ({ activeIncident }) => {
  const [rcaData, setRcaData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const activeIncidentId = activeIncident?.id || activeIncident?.incident_id;

  useEffect(() => {
    if (activeIncident) {
      setLoading(true);
      aiService.analyzeIncident(activeIncident)
        .then(res => setRcaData(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setRcaData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIncidentId]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-l-[3px] border-l-rose-500 dark:border-l-rose-400 rounded-[12px] p-[20px] flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-[12px] mb-[16px]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950 flex items-center justify-center mr-3">
            <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 tracking-wide">Root Cause Analysis</h2>
        </div>
        {rcaData && (
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {Math.round((rcaData.confidence_score || 0.94) * 100)}% confidence
            </span>
          </div>
        )}
      </div>

      <div className="flex-1">
        {!activeIncident ? (
          <div className="flex items-center justify-center h-[120px] text-[13px] text-gray-500 dark:text-gray-400">
            No active incident to analyze. System is healthy.
          </div>
        ) : loading ? (
          <div className="h-[120px] space-y-4">
            <div className="h-4 w-1/3 rounded bg-gray-100 dark:bg-gray-800 shimmer"></div>
            <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800 shimmer"></div>
            <div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-800 shimmer"></div>
          </div>
        ) : rcaData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center text-gray-500 dark:text-gray-400 font-medium text-[12px] uppercase tracking-wide">
                <Target className="w-3.5 h-3.5 mr-2" /> Root Cause
              </div>
              <p className="text-[13px] text-gray-900 dark:text-gray-100 leading-relaxed">
                {rcaData.root_cause}
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-500 dark:text-gray-400 font-medium text-[12px] uppercase tracking-wide">
                <Server className="w-3.5 h-3.5 mr-2" /> Impacted Services
              </div>
              <ul className="space-y-2">
                {rcaData.impacted_services?.map((svc: string, idx: number) => (
                  <li key={idx} className="flex items-center text-[13px] text-gray-900 dark:text-gray-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 mr-2"></span>
                    {svc}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-500 dark:text-gray-400 font-medium text-[12px] uppercase tracking-wide">
                <Wrench className="w-3.5 h-3.5 mr-2" /> Suggested Fixes
              </div>
              <ul className="space-y-2">
                {rcaData.suggested_fixes?.slice(0, 3).map((fix: any, idx: number) => (
                  <li key={idx} className="flex items-start text-[13px] text-gray-900 dark:text-gray-100">
                    <span className="text-rose-600 dark:text-rose-500 mr-2 mt-0.5">•</span>
                    <span className="leading-snug">{fix.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[120px] text-[13px] text-gray-500 dark:text-gray-400">
            Failed to load analysis.
          </div>
        )}
      </div>

      <div className="mt-[20px] pt-[16px] border-t border-gray-200 dark:border-gray-800">
        <button 
          onClick={() => {
            window.dispatchEvent(new CustomEvent('open-copilot', {
              detail: { incident: activeIncident, rcaData: rcaData }
            }));
          }}
          className="w-full h-[36px] flex items-center justify-center space-x-2 rounded-[6px] bg-rose-600 dark:bg-rose-500 text-white hover:bg-rose-700 dark:hover:bg-rose-600 transition-colors btn-active text-[13px] font-medium"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask Copilot for more details</span>
        </button>
      </div>
    </div>
  );
};
