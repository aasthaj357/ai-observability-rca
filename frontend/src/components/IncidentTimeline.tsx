import React from 'react';
import { GitCommit, AlertTriangle, ShieldAlert, Sparkles, Clock } from 'lucide-react';

export const IncidentTimeline: React.FC<{ incident: any }> = ({ incident }) => {
  if (!incident) return null;

  const events = [
    {
      id: 1,
      type: 'deployment',
      title: `Deployment ${incident.deployment_events?.[0]?.version || 'v2.1.4'}`,
      service: incident.deployment_events?.[0]?.service || incident.service_name,
      time: incident.deployment_events?.[0]?.time_relative || '2 hours ago',
      icon: GitCommit,
      color: 'text-indigo-400 bg-indigo-400/20 border-indigo-500/50'
    },
    {
      id: 2,
      type: 'anomaly',
      title: 'Latency Spike Detected',
      service: incident.service_name,
      time: '1 hour ago',
      icon: AlertTriangle,
      color: 'text-warning bg-warning/20 border-warning/50'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Uptime Monitor Failed',
      service: 'API Gateway',
      time: '45 mins ago',
      icon: ShieldAlert,
      color: 'text-danger bg-danger/20 border-danger/50'
    },
    {
      id: 4,
      type: 'ai',
      title: 'AI RCA Generated',
      service: 'System',
      time: 'Just now',
      icon: Sparkles,
      color: 'text-emerald-400 bg-emerald-400/20 border-emerald-500/50'
    }
  ];

  return (
    <div className="card h-full">
      <div className="card-header border-b border-slate-800 flex items-center space-x-2">
        <Clock className="w-5 h-5 text-indigo-400" />
        <span className="font-semibold text-white">Incident Timeline</span>
      </div>
      
      <div className="card-body relative p-6">
        <div className="absolute left-8 top-6 bottom-6 w-px bg-slate-700"></div>
        
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="relative flex items-start group">
              <div className={`absolute left-[-5px] w-3 h-3 rounded-full bg-background border-2 z-10 transition-transform group-hover:scale-125 ${event.color.split(' ')[0].replace('text-', 'border-')}`}></div>
              <div className="ml-6 w-full">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className={`p-1 rounded-md border ${event.color}`}>
                      <event.icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-sm font-semibold text-slate-200">{event.title}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{event.time}</span>
                </div>
                <div className="ml-8 text-xs text-slate-400">
                  Affecting: <span className="font-medium text-slate-300">{event.service}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
