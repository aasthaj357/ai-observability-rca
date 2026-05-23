import React, { useState, useEffect } from 'react';
import { Rocket, ChevronDown, ChevronRight, AlertTriangle, FileCode } from 'lucide-react';
import { monitoringService } from '../services/api';

export const DeploymentTimeline: React.FC = () => {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchDeployments = async () => {
    try {
      const response = await monitoringService.getDeployments();
      if (response && response.deployments) {
        setDeployments(response.deployments);
      }
    } catch (e) {
      console.error("Failed to fetch deployments", e);
    }
  };

  useEffect(() => {
    fetchDeployments();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'success') return 'bg-emerald-500 dark:bg-emerald-400';
    if (status === 'failed') return 'bg-rose-600 dark:bg-rose-500';
    if (status === 'rollback') return 'bg-amber-500 dark:bg-amber-400';
    return 'bg-slate-500 dark:bg-slate-400';
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[24px] h-full overflow-y-auto transition-colors duration-300">
      <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-800 pb-[16px] mb-[24px] transition-colors duration-300">
        <Rocket className="w-4 h-4 text-gray-900 dark:text-gray-100" />
        <span className="text-[14px] font-semibold tracking-wide text-gray-900 dark:text-gray-100">Deployment Timeline</span>
      </div>
      
      <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-[12px] space-y-[32px] pb-[16px] transition-colors duration-300">
        {deployments.length === 0 ? (
          <div className="pl-[24px] text-[13px] text-gray-500 dark:text-gray-400 shimmer">Loading deployments...</div>
        ) : (
          deployments.map((dep, idx) => {
            const status = dep.status || (idx % 4 === 0 ? 'rollback' : idx % 3 === 0 ? 'failed' : 'success'); // Mock status
            const isExpanded = expandedId === idx;
            
            return (
              <div key={idx} className="relative pl-[28px] group">
                {/* Timeline Dot */}
                <span className={`absolute -left-[9px] top-[12px] w-[16px] h-[16px] rounded-full ring-4 ring-white dark:ring-gray-900 ${getStatusColor(status)} shadow-sm transition-transform group-hover:scale-125`}></span>
                
                {/* Deployment Card */}
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[8px] overflow-hidden card-hover transition-colors duration-300">
                  <div 
                    className="p-[16px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                    onClick={() => setExpandedId(isExpanded ? null : idx)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span className="text-[12px] font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">{dep.version}</span>
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{dep.service_name || 'API Gateway'}</span>
                      <div className="flex items-center space-x-2 text-[12px] text-gray-500 dark:text-gray-400">
                        <div className="w-5 h-5 rounded-full bg-purple-600 dark:bg-purple-500 flex items-center justify-center text-white text-[10px] font-bold">JD</div>
                        <span>johndoe</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">{dep.time_relative}</span>
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                    </div>
                  </div>
                  
                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="p-[16px] border-t border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 text-[13px] transition-colors duration-300">
                      <p className="text-gray-900 dark:text-gray-100 mb-4 leading-relaxed">
                        {dep.description || 'Implemented rate limiting and updated core dependency versions.'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center text-gray-500 dark:text-gray-400">
                            <FileCode className="w-4 h-4 mr-1.5" /> 14 files changed
                          </span>
                        </div>
                        
                        {(status === 'failed' || status === 'rollback') && (
                          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-400 transition-colors duration-300">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold uppercase">Correlated with incident INC-8042</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
