import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Search, Filter } from 'lucide-react';
import { monitoringService } from '../services/api';

export const LogPanel: React.FC<{ fullPage?: boolean }> = ({ fullPage = false }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ ERRO: true, WARN: true, INFO: true, DEBU: true });
  const logsEndRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    if (!isLive) return;
    try {
      const response = await monitoringService.getLogs();
      if (response && response.logs) {
        setLogs(response.logs);
      }
    } catch (e) {
      console.error("Failed to fetch logs", e);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    if (isLive) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isLive]);

  const toggleFilter = (level: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [level]: !prev[level] }));
  };

  const getSeverityChip = (level: string) => {
    const lvl = level.substring(0, 4).toUpperCase();
    if (lvl === 'ERRO' || lvl === 'CRIT') return 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400';
    if (lvl === 'WARN') return 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400';
    if (lvl === 'INFO') return 'bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-400';
    return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
  };
  
  const getSeverityLabel = (level: string) => {
    const lvl = level.substring(0, 4).toUpperCase();
    if (lvl === 'CRIT') return 'ERRO';
    if (lvl === 'WARN' || lvl === 'INFO' || lvl === 'DEBU' || lvl === 'ERRO') return lvl;
    return 'INFO';
  };

  const isSuspicious = (msg: string) => {
    const lower = msg.toLowerCase();
    return ['error', 'failed', 'timeout', 'exception', 'unauthorized'].some(k => lower.includes(k));
  };

  const filteredLogs = logs.filter(log => {
    const lvl = getSeverityLabel(log.level) as keyof typeof filters;
    if (!filters[lvl]) return false;
    if (search && !log.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] flex flex-col transition-colors duration-300 ${fullPage ? 'h-[calc(100vh-200px)]' : 'h-[300px]'}`}>
      <div className="flex items-center justify-between p-[12px] border-b border-gray-200 dark:border-gray-800 shrink-0 transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-[13px] font-semibold tracking-wide uppercase text-gray-900 dark:text-gray-100">Live Logs</span>
        </div>
        
        {fullPage && (
          <div className="flex flex-1 mx-8 items-center space-x-6">
            <div className="flex space-x-3">
              {(['ERRO', 'WARN', 'INFO', 'DEBU'] as const).map(lvl => (
                <label key={lvl} className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" checked={filters[lvl]} onChange={() => toggleFilter(lvl)} className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-gray-900 dark:focus:ring-gray-100 transition-colors duration-300" />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{lvl}</span>
                </label>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[6px] text-[12px] text-gray-900 dark:text-gray-100 px-2 py-1 outline-none transition-colors duration-300">
                <option>All Services</option>
                <option>API Gateway</option>
                <option>Auth Service</option>
                <option>Database</option>
              </select>
            </div>
            
            <div className="relative flex-1 input-focus rounded-[6px] overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center transition-colors duration-300">
              <Search className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 ml-2.5" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-[12px] text-gray-900 dark:text-gray-100 w-full py-1 px-2 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        )}

        <button 
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors ${isLive ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'}`}
        >
          {isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 pulse-dot mr-1.5"></span>}
          {isLive ? 'Live' : 'Paused'}
        </button>
      </div>

      <div className="flex-1 bg-gray-50 dark:bg-[#0A0D14] overflow-y-auto p-[12px] font-mono text-[12px] leading-[1.6] transition-colors duration-300">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 shimmer">Waiting for logs...</div>
        ) : (
          <div className="flex flex-col space-y-[2px]">
            {filteredLogs.map((log, idx) => {
              const susp = isSuspicious(log.message);
              const displayLvl = getSeverityLabel(log.level);
              return (
                <div key={idx} className={`flex items-start px-[8px] py-[4px] rounded-[4px] slide-in-row hover:bg-gray-200 dark:hover:bg-white/5 transition-colors border-l-2 ${susp ? 'border-l-rose-500 dark:border-l-rose-500' : 'border-l-transparent'}`}>
                  <span className="text-gray-500 dark:text-gray-400 w-[85px] shrink-0">{log.timestamp.split('T')[1]?.substring(0, 12) || log.timestamp}</span>
                  <span className={`w-[45px] shrink-0 text-center rounded-[2px] mx-[8px] font-semibold text-[10px] transition-colors duration-300 ${getSeverityChip(displayLvl)}`}>
                    {displayLvl}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 w-[100px] shrink-0 truncate mx-[8px] opacity-70">
                    {log.service || 'system'}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 flex-1 break-words">
                    {log.message}
                  </span>
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};
