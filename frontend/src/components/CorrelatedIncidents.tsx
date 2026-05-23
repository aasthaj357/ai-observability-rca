import React, { useEffect, useState } from 'react';
import { ShieldAlert, Activity, Server, AlertTriangle, Layers, RefreshCw } from 'lucide-react';
import { correlationService } from '../services/api';
import { AIAnalysisPanel } from './AIAnalysisPanel';

export const CorrelatedIncidents: React.FC<{ targetUrl?: string }> = ({ targetUrl }) => {
  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIncident = async () => {
      if (!targetUrl) return;
      setLoading(true);
      try {
        const data = await correlationService.getActiveIncident(targetUrl);
        setIncident(data);
      } catch (error) {
        console.error("Failed to fetch correlated incident:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [targetUrl]);

  if (loading) {
    return (
      <div className="card h-full flex items-center justify-center min-h-[300px]">
        <div className="animate-spin text-primary">
          <RefreshCw className="w-8 h-8" />
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="card h-full flex flex-col items-center justify-center text-slate-500 min-h-[300px]">
        <Layers className="w-12 h-12 mb-4 opacity-50" />
        <p>Run a website check to generate correlated incidents.</p>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-danger text-white border-danger';
      case 'high': return 'bg-warning text-white border-warning';
      case 'medium': return 'bg-amber-500/20 text-amber-500 border-amber-500/50';
      case 'low': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="card h-full w-full">
      <div className="card-header border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-indigo-400" />
          <span>Correlated Incident View</span>
        </div>
        <div className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${getSeverityColor(incident.severity)}`}>
          {incident.severity} Severity
        </div>
      </div>
      
      <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Impacted Services</h3>
            <div className="flex flex-wrap gap-2">
              {incident.impacted_services.map((srv: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-200">
                  <Server className="w-3.5 h-3.5 text-primary" />
                  <span>{srv}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Deployment Correlation</h3>
            {incident.deployment_events.length > 0 ? (
              <div className="space-y-2">
                {incident.deployment_events.map((dep: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-800/50 border border-slate-700/50 p-3 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-slate-200 block">{dep.service} {dep.version}</span>
                      <span className="text-xs text-slate-500">{dep.time_relative}</span>
                    </div>
                    <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">Correlated</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No recent deployments correlated.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface border border-slate-700 rounded-xl p-4">
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-sm font-semibold text-slate-400 flex items-center">
                <Activity className="w-4 h-4 mr-1.5 text-danger" />
                Anomaly Score
              </h3>
              <span className="text-2xl font-bold text-white">{(incident.anomaly_score * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full ${incident.anomaly_score > 0.7 ? 'bg-danger' : incident.anomaly_score > 0.4 ? 'bg-warning' : 'bg-emerald-500'}`} 
                style={{ width: `${incident.anomaly_score * 100}%` }}
              ></div>
            </div>
            
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Detection Reasoning</h4>
            <ul className="space-y-2">
              {incident.anomaly_reasoning.map((reason: string, idx: number) => (
                <li key={idx} className="flex items-start text-sm text-slate-300">
                  <AlertTriangle className="w-4 h-4 mr-2 text-warning shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Insert Gemini AI Analysis Panel Here */}
      <div className="px-6 pb-6">
        <AIAnalysisPanel incident={incident} />
      </div>
    </div>
  );
};
