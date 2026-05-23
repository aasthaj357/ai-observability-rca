import React from 'react';
import { Activity, Server, Wifi } from 'lucide-react';
import { useTelemetrySocket } from '../hooks/useTelemetrySocket';

export const LiveTelemetryFeed: React.FC = () => {
  // Assuming backend runs on 8000
  const { messages, isConnected } = useTelemetrySocket('ws://localhost:8000/api/v1/ws/telemetry');

  return (
    <div className="card h-[400px] flex flex-col relative overflow-hidden">
      <div className="card-header border-b border-slate-800 flex justify-between items-center z-10 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-white">Live Telemetry Stream</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isConnected ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
          </span>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs z-10 bg-black/40">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
             <Wifi className="w-8 h-8 opacity-20" />
             <p>Waiting for telemetry stream...</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isError = msg.status_code >= 500;
            const isWarning = msg.latency > 500 || msg.status_code >= 400;
            
            return (
              <div 
                key={idx} 
                className={`flex items-center p-2 rounded border ${
                  isError ? 'bg-danger/10 border-danger/30 text-danger' : 
                  isWarning ? 'bg-warning/10 border-warning/30 text-warning' : 
                  'bg-slate-800/50 border-slate-700/50 text-slate-300'
                } animate-in fade-in slide-in-from-top-1`}
              >
                <div className="w-20 shrink-0 text-slate-500 text-[10px]">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
                <div className="w-32 shrink-0 flex items-center space-x-1.5 font-semibold">
                  <Server className="w-3.5 h-3.5" />
                  <span className="truncate">{msg.service}</span>
                </div>
                <div className="w-20 shrink-0 text-center">
                  HTTP {msg.status_code}
                </div>
                <div className="flex-1 text-right tabular-nums">
                  {msg.latency}ms
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 pointer-events-none z-20"></div>
    </div>
  );
};
