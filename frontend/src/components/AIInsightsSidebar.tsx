import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export const AIInsightsSidebar: React.FC = () => {
  return (
    <div className="w-80 bg-surface/30 border-l border-slate-800 p-6 flex flex-col hidden xl:flex">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold">AI Insights</h2>
      </div>
      
      <div className="space-y-4 flex-1">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden group cursor-pointer transition-all hover:bg-indigo-500/20">
          <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="font-medium text-sm text-indigo-200 mb-2">Anomaly Detected</h3>
          <p className="text-xs text-indigo-300/80 leading-relaxed">
            CPU usage on db-cluster-02 is 40% higher than typical for this time of day. This pattern often precedes a memory OOM event.
          </p>
          <div className="mt-4 inline-flex px-2 py-1 text-[10px] uppercase tracking-wider font-semibold bg-indigo-500/20 text-indigo-300 rounded">
            Suggested Action: Scale up
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h3 className="font-medium text-sm text-slate-300 mb-2">Deployment Analysis</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            v1.4.2 deployment introduced a 15% improvement in API response times across the US-East region. No new errors detected.
          </p>
        </div>
      </div>
    </div>
  );
};
