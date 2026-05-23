import React from 'react';
import { Wrench, ArrowRight } from 'lucide-react';

export const AIRemediationList: React.FC<{ fixes: any[] }> = ({ fixes }) => {
  if (!fixes || fixes.length === 0) return null;

  return (
    <div className="mt-6 border-t border-slate-700/50 pt-4">
      <h4 className="text-sm font-semibold text-slate-300 flex items-center mb-3">
        <Wrench className="w-4 h-4 mr-2 text-primary" />
        AI Suggested Remediations
      </h4>
      <div className="space-y-3">
        {fixes.map((fix, idx) => (
          <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3">
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-sm text-slate-200">{fix.action}</span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                fix.priority === 'immediate' ? 'bg-danger/20 text-danger' : 
                fix.priority === 'short-term' ? 'bg-warning/20 text-warning' : 'bg-slate-700 text-slate-300'
              }`}>
                {fix.priority}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2">{fix.description}</p>
            <div className="text-[10px] text-indigo-400 flex items-center">
              <ArrowRight className="w-3 h-3 mr-1" />
              Impact: {fix.estimated_impact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
