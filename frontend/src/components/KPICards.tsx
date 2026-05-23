import React from 'react';
import { Activity, Clock, AlertTriangle, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const KPICards: React.FC<{ metrics?: any }> = ({ metrics }) => {
  const kpis = [
    {
      label: 'Uptime %',
      value: '99.98%',
      icon: Activity,
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      trend: '+0.01%',
      trendUp: true,
      period: 'vs last 24h'
    },
    {
      label: 'Avg Latency',
      value: '42ms',
      icon: Clock,
      iconColor: 'text-gray-500 dark:text-gray-400',
      trend: '-5ms',
      trendUp: true, // Down is good for latency, but we'll show green arrow down
      period: 'vs last 1h'
    },
    {
      label: 'Active Incidents',
      value: metrics?.active_incidents || '0',
      icon: AlertTriangle,
      iconColor: metrics?.active_incidents > 0 ? 'text-rose-600 dark:text-rose-500' : 'text-amber-500 dark:text-amber-400',
      trend: metrics?.active_incidents > 0 ? '+1' : '0',
      trendUp: false,
      period: 'vs yesterday'
    },
    {
      label: 'Monitored URLs',
      value: '14',
      icon: Globe,
      iconColor: 'text-gray-500 dark:text-gray-400',
      trend: '+2',
      trendUp: true,
      period: 'this week'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[8px] p-[16px] card-hover">
          <div className="flex items-center space-x-2 mb-3">
            <kpi.icon className={`w-[24px] h-[24px] ${kpi.iconColor}`} />
            <span className="text-[12px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{kpi.label}</span>
          </div>
          <div className="text-[28px] font-semibold text-gray-900 dark:text-gray-100 tabular-nums leading-none mb-3">
            {kpi.value}
          </div>
          <div className="flex items-center text-[11px] font-medium">
            <div className={`flex items-center px-1.5 py-0.5 rounded-[6px] mr-2 ${kpi.trendUp ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'}`}>
              {kpi.trendUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {kpi.trend}
            </div>
            <span className="text-gray-500 dark:text-gray-400">{kpi.period}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
