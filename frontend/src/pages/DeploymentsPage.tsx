import React from 'react';
import { DeploymentTimeline } from '../components/DeploymentTimeline';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DeploymentsPage: React.FC = () => {
  // Mock data for dual axis chart
  const correlationData = [
    { time: '10:00', errorRate: 2, deploy: 0 },
    { time: '11:00', errorRate: 2.5, deploy: 0 },
    { time: '12:00', errorRate: 3, deploy: 1, version: 'v2.4.1' }, // deployment
    { time: '12:30', errorRate: 28, deploy: 0 }, // spike
    { time: '13:00', errorRate: 45, deploy: 0 },
    { time: '13:15', errorRate: 42, deploy: 1, version: 'v2.4.0' }, // rollback
    { time: '13:30', errorRate: 5, deploy: 0 },
    { time: '14:00', errorRate: 2, deploy: 0 },
  ];

  return (
    <div className="flex flex-col h-full space-y-[24px]">
      <div>
        <h1 className="text-[20px] font-semibold text-gray-900 dark:text-gray-100 leading-[1.4] transition-colors duration-300">Deployment History</h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-[1.6] transition-colors duration-300">Track major environment rollouts and their impact on system health.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[24px]">
        {/* Left: Timeline */}
        <div className="xl:col-span-1 h-[600px]">
          <DeploymentTimeline />
        </div>
        
        {/* Right: Charts & Correlation */}
        <div className="xl:col-span-1 flex flex-col space-y-[24px]">
          
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[16px] h-[300px] flex flex-col transition-colors duration-300">
            <h3 className="text-[11px] uppercase font-semibold tracking-[0.08em] text-gray-500 dark:text-gray-400 mb-[16px]">
              Deployment vs Error Rate (Last 6h)
            </h3>
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={correlationData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="errorFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-error)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--chart-error)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--chart-text)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--chart-text)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--chart-bg)', borderColor: 'var(--chart-border)', borderRadius: '6px', fontSize: '12px' }}
                    itemStyle={{ color: 'var(--chart-error)' }}
                    labelStyle={{ color: 'var(--chart-text)' }}
                  />
                  <Area type="monotone" dataKey="errorRate" stroke="var(--chart-error)" strokeWidth={2} fillOpacity={1} fill="url(#errorFill)" name="Error Rate %" />
                  {/* Markers for deployments are tricky in native Recharts without custom dots, we use bars in a composed chart normally, but for simplicity AreaChart with dots is fine, or we can just use the Tooltip to show it */}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] overflow-hidden flex-1 flex flex-col transition-colors duration-300">
            <div className="p-[16px] border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
              <h3 className="text-[11px] uppercase font-semibold tracking-[0.08em] text-gray-500 dark:text-gray-400">
                Risk Correlation
              </h3>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-[12px] text-left">
                <thead className="text-[11px] uppercase tracking-[0.05em] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Deployment</th>
                    <th className="px-4 py-3 font-medium">Incident ID</th>
                    <th className="px-4 py-3 font-medium text-right">Impact Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
                    <td className="px-4 py-3 font-mono text-gray-900 dark:text-gray-100">v2.4.1 (API Gateway)</td>
                    <td className="px-4 py-3 text-rose-600 dark:text-rose-400 font-mono">INC-8042</td>
                    <td className="px-4 py-3 text-right text-rose-600 dark:text-rose-400 font-semibold">94%</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
                    <td className="px-4 py-3 font-mono text-gray-900 dark:text-gray-100">v2.3.9 (Auth Service)</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">-</td>
                    <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
