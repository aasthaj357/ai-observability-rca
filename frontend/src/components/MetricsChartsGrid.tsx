import React, { useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Lock, AlertCircle } from 'lucide-react';
import { useTelemetrySocket } from '../hooks/useTelemetrySocket';

export const MetricsChartsGrid: React.FC<{ activeUrl: string, timeRange: string }> = ({ activeUrl, timeRange }) => {
  const { messages } = useTelemetrySocket('ws://localhost:8000/api/v1/ws/telemetry');
  
  const data = useMemo(() => {
    const reversed = [...messages].reverse().slice(-60); 
    return reversed.map(m => {
      const d = new Date(m.timestamp);
      // Simulate P50, P95, P99
      const baseLatency = m.latency_ms || 50;
      return {
        time: `${d.getHours()}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`,
        p50: baseLatency,
        p95: baseLatency * 1.5,
        p99: baseLatency * 2.2,
        errorRate: m.status_code >= 400 ? Math.random() * 20 + 5 : Math.random() * 2,
        volume: Math.floor(Math.random() * 500) + 100,
      };
    });
  }, [messages, activeUrl]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
      {/* 1. Response Time Over Time */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[16px] h-[300px] flex flex-col transition-colors duration-300">
        <h3 className="text-[11px] uppercase font-semibold tracking-[0.08em] text-gray-400 dark:text-gray-500 mb-[16px]">
          Response Time Over Time (ms)
        </h3>
        <div className="flex-1 w-full relative">
          {data.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-[13px] shimmer">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="p99Fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-primary)" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="var(--chart-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--chart-text)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val, i) => i % 5 === 0 ? val : ''} />
                <YAxis stroke="var(--chart-text)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--chart-bg)', borderColor: 'var(--chart-border)', borderRadius: '6px', fontSize: '12px' }}
                  itemStyle={{ color: 'var(--chart-tooltip-text)' }}
                  labelStyle={{ color: 'var(--chart-text)' }}
                />
                <Area type="monotone" dataKey="p99" stroke="var(--chart-primary)" strokeOpacity={0.4} strokeWidth={1} fillOpacity={1} fill="url(#p99Fill)" animationDuration={300} name="P99" />
                <Area type="monotone" dataKey="p95" stroke="var(--chart-primary)" strokeOpacity={0.7} strokeWidth={1} fill="transparent" animationDuration={300} name="P95" />
                <Area type="monotone" dataKey="p50" stroke="var(--chart-primary)" strokeOpacity={1} strokeWidth={2} fill="transparent" animationDuration={300} name="P50" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2. Error Rate % */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[16px] h-[300px] flex flex-col transition-colors duration-300">
        <h3 className="text-[11px] uppercase font-semibold tracking-[0.08em] text-gray-400 dark:text-gray-500 mb-[16px]">
          Error Rate %
        </h3>
        <div className="flex-1 w-full relative">
          {data.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-[13px] shimmer">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--chart-text)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val, i) => i % 5 === 0 ? val : ''} />
                <YAxis stroke="var(--chart-text)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--chart-bg)', borderColor: 'var(--chart-border)', borderRadius: '6px', fontSize: '12px' }}
                  itemStyle={{ color: 'var(--chart-error)' }}
                  labelStyle={{ color: 'var(--chart-text)' }}
                />
                <Bar dataKey="errorRate" fill="var(--chart-error)" radius={[2, 2, 0, 0]} animationDuration={300} name="Error Rate" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 3. Request Volume */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[16px] h-[300px] flex flex-col transition-colors duration-300">
        <h3 className="text-[11px] uppercase font-semibold tracking-[0.08em] text-gray-400 dark:text-gray-500 mb-[16px]">
          Request Volume (req/min)
        </h3>
        <div className="flex-1 w-full relative">
          {data.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-[13px] shimmer">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--chart-text)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val, i) => i % 5 === 0 ? val : ''} />
                <YAxis stroke="var(--chart-text)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--chart-bg)', borderColor: 'var(--chart-border)', borderRadius: '6px', fontSize: '12px' }}
                  itemStyle={{ color: 'var(--chart-success)' }}
                  labelStyle={{ color: 'var(--chart-text)' }}
                />
                <Bar dataKey="volume" fill="var(--chart-success)" radius={[2, 2, 0, 0]} animationDuration={300} name="Volume" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 4. SSL Certificate Status */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[16px] h-[300px] flex flex-col relative overflow-hidden transition-colors duration-300">
        <h3 className="text-[11px] uppercase font-semibold tracking-[0.08em] text-gray-400 dark:text-gray-500 mb-[16px] flex items-center">
          <Lock className="w-3.5 h-3.5 mr-2" /> SSL Certificate Status
        </h3>
        
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="w-32 h-32 rounded-full border-[6px] border-[rgba(16,185,129,0.2)] border-t-emerald-500 dark:border-t-emerald-400 flex flex-col items-center justify-center mb-6 relative">
             <span className="text-[32px] font-bold text-gray-900 dark:text-gray-100 tabular-nums leading-none">42</span>
             <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 uppercase font-medium">Days Left</span>
             <div className="absolute -bottom-2 bg-white dark:bg-gray-900 px-2 border border-gray-200 dark:border-gray-800 rounded-full text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">VALID</div>
          </div>
          
          <div className="w-full space-y-4 max-w-xs">
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500 dark:text-gray-400">Issuer</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">Let's Encrypt Authority X3</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500 dark:text-gray-400">Expires</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">Oct 14, 2026</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500 dark:text-gray-400">Algorithm</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">RSA-2048 / SHA-256</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
