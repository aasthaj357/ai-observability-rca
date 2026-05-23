import React, { useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTelemetrySocket } from '../hooks/useTelemetrySocket';

export const DashboardCharts: React.FC = () => {
  const { messages, isConnected } = useTelemetrySocket('ws://localhost:8000/api/v1/ws/telemetry');
  
  // Transform socket messages for charts
  const data = useMemo(() => {
    // Reverse because messages are prepended (newest first)
    const reversed = [...messages].reverse().slice(-60); 
    return reversed.map(m => {
      const d = new Date(m.timestamp);
      return {
        time: `${d.getHours()}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`,
        latency: m.latency,
        errorRate: m.status_code >= 400 ? 1 : 0 // Simply representing errors as 1, success as 0. 
      };
    });
  }, [messages]);

  return (
    <div className="space-y-6 flex-col flex h-full">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[16px] flex-1 flex flex-col min-h-[200px]">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-[8px] mb-[16px]">
          <h3 className="text-[11px] uppercase font-semibold tracking-[0.08em] text-gray-400 dark:text-gray-500">
            Live Latency
          </h3>
          <div className="flex items-center space-x-2">
             <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 dark:bg-emerald-400 pulse-dot' : 'bg-rose-600 dark:bg-rose-500'}`}></span>
             <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">{isConnected ? 'Live' : 'Offline'}</span>
          </div>
        </div>
        <div className="flex-1 w-full relative" style={{ minHeight: '150px' }}>
          {data.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-[13px] shimmer">Awaiting data...</div>
          ) : (
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-primary)" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="var(--chart-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--chart-text)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val, i) => i % 5 === 0 ? val : ''} />
                <YAxis stroke="var(--chart-text)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}ms`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--chart-bg)', borderColor: 'var(--chart-border)', borderRadius: '6px', fontSize: '12px' }}
                  itemStyle={{ color: 'var(--chart-tooltip-text)' }}
                  labelStyle={{ color: 'var(--chart-text)', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="latency" stroke="var(--chart-primary)" strokeWidth={2} fillOpacity={1} fill="url(#latencyFill)" animationDuration={300} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[16px] flex-1 flex flex-col min-h-[200px]">
        <h3 className="text-[11px] uppercase font-semibold tracking-[0.08em] text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-800 pb-[8px] mb-[16px]">
          Error Rate
        </h3>
        <div className="flex-1 w-full relative" style={{ minHeight: '150px' }}>
          {data.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-[13px] shimmer">Awaiting data...</div>
          ) : (
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--chart-text)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val, i) => i % 5 === 0 ? val : ''} />
                <YAxis stroke="var(--chart-text)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => val === 1 ? 'Error' : 'OK'} ticks={[0, 1]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--chart-bg)', borderColor: 'var(--chart-border)', borderRadius: '6px', fontSize: '12px' }}
                  itemStyle={{ color: 'var(--chart-error)' }}
                  labelStyle={{ color: 'var(--chart-text)', marginBottom: '4px' }}
                  formatter={(value: any) => [value === 1 ? 'Error' : 'Success', 'Status']}
                />
                <Bar dataKey="errorRate" fill="var(--chart-error)" radius={[2, 2, 0, 0]} animationDuration={300} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
