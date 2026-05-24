import React, { useState, useEffect } from 'react';
import { KPICards } from '../components/KPICards';
import { DashboardCharts } from '../components/DashboardCharts';
import { SystemHealth } from '../components/SystemHealth';
import { ActiveIncidentsPanel } from '../components/ActiveIncidentsPanel';
import { AIInsightsPanel } from '../components/AIInsightsPanel';
import { WebsiteMonitorPanel } from '../components/WebsiteMonitorPanel';
import { ReportModal } from '../components/ReportModal';
import { correlationService } from '../services/api';
import { FileText } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [metricsSummary, setMetricsSummary] = useState<any>({ active_incidents: 0 });
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchData = async () => {
    try {
      const res = await correlationService.getRecentIncidents();
      const data = res?.incidents || res?.data || res;
      if (Array.isArray(data)) {
        setIncidents(data);
        const active = data.filter((i: any) => i.status === 'Active');
        setMetricsSummary({ active_incidents: active.length });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeIncident = incidents.find(i => i.status === 'Active');

  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  return (
    <div className="flex flex-col space-y-[24px]">
      {/* Page Title Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-gray-900 dark:text-gray-100 leading-[1.4]">Platform Overview</h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-[1.6]">Real-time system health, telemetry, and AI-driven insights.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleGenerateReport}
            className="flex items-center px-3 h-[32px] rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-300 btn-active text-[13px] font-medium"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* KPIs */}
      <KPICards metrics={metricsSummary} />

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-[24px] flex flex-col h-full">
          <DashboardCharts />
        </div>
        
        {/* Right Column (1/3) */}
        <div className="lg:col-span-1 space-y-[24px] flex flex-col">
          <div className="w-full">
             <WebsiteMonitorPanel onTelemetryUpdate={(data) => console.log('Telemetry updated', data)} />
          </div>
          <div className="w-full">
             <SystemHealth activeIncident={!!activeIncident} />
          </div>
          <div className="w-full">
             <ActiveIncidentsPanel incidents={incidents.filter(i => i.status === 'Active')} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full">
        <AIInsightsPanel activeIncident={activeIncident} />
      </div>

      {showReportModal && <ReportModal onClose={() => setShowReportModal(false)} />}
    </div>
  );
};
