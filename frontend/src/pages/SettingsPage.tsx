import React, { useState } from 'react';
import { Save, Key, Activity, Wifi, Zap, Bell, CheckCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('All'); // Will just scroll to sections instead of tabs as requested

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const SectionHeader = ({ icon: Icon, title, desc }: any) => (
    <div className="border-b border-gray-200 dark:border-gray-800 pb-[12px] mb-[20px] transition-colors duration-300">
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 text-gray-900 dark:text-gray-100" />
        <h2 className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      </div>
      <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-[24px] max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-gray-900 dark:text-gray-100 leading-[1.4] transition-colors duration-300">Platform Settings</h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-[1.6] transition-colors duration-300">Configure monitoring parameters, integrations, and chaos engineering simulations.</p>
        </div>
        <div className="flex items-center space-x-4">
          {saved && <span className="text-emerald-600 dark:text-emerald-400 text-[12px] flex items-center transition-colors duration-300"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Saved</span>}
          <button onClick={handleSave} className="flex items-center px-4 h-[32px] rounded-md bg-rose-600 dark:bg-rose-500 text-white hover:bg-rose-700 dark:hover:bg-rose-600 transition-colors btn-active text-[13px] font-medium shadow-sm">
            <Save className="w-4 h-4 mr-2" /> Save Configuration
          </button>
        </div>
      </div>

      <div className="space-y-[32px]">
        {/* 1. Integrations */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[24px] transition-colors duration-300">
          <SectionHeader icon={Key} title="Integrations" desc="Connect external telemetry providers and AI engines." />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            {['Grafana API', 'New Relic', 'Gemini API'].map((provider) => (
              <div key={provider} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[8px] p-[16px] transition-colors duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{provider}</span>
                  <span className="px-2 py-0.5 rounded-[4px] bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800 text-[10px] font-semibold uppercase transition-colors duration-300">Connected</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-gray-500 dark:text-gray-400 block mb-1">API Key</label>
                    <input type="password" value="************************" readOnly className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[6px] px-2 py-1.5 text-[12px] text-gray-900 dark:text-gray-100 transition-colors duration-300" />
                  </div>
                  <button className="w-full py-1.5 rounded-[6px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[12px] text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Test Connection</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Monitoring */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[24px] transition-colors duration-300">
          <SectionHeader icon={Activity} title="Monitoring Engine" desc="Configure what URLs are monitored and how frequently." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            <div className="space-y-4">
              <label className="text-[13px] font-medium text-gray-900 dark:text-gray-100">Monitored URLs</label>
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[8px] p-2 space-y-2 max-h-[160px] overflow-y-auto transition-colors duration-300">
                {['example.com', 'api.stripe.com', 'github.com'].map(url => (
                  <div key={url} className="flex items-center justify-between bg-white dark:bg-gray-900 px-3 py-2 rounded-[6px] border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <span className="text-[12px] text-gray-900 dark:text-gray-100">{url}</span>
                    <button className="text-[12px] text-rose-600 dark:text-rose-400 hover:underline">Remove</button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input type="text" placeholder="https://..." className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[6px] px-3 py-1.5 text-[12px] text-gray-900 dark:text-gray-100 transition-colors duration-300" />
                <button className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[6px] text-[12px] text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Add</button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center justify-between text-[13px] font-medium text-gray-900 dark:text-gray-100 mb-2">
                  <span>Check Interval</span>
                  <span className="text-gray-500 dark:text-gray-400 text-[12px]">30s</span>
                </label>
                <input type="range" min="30" max="300" step="30" defaultValue="30" className="w-full accent-rose-600 dark:accent-rose-500" />
                <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  <span>30s</span><span>5m</span>
                </div>
              </div>
              <div>
                <label className="text-[13px] font-medium text-gray-900 dark:text-gray-100 block mb-2">Request Timeout (ms)</label>
                <input type="number" defaultValue="5000" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[6px] px-3 py-2 text-[12px] text-gray-900 dark:text-gray-100 transition-colors duration-300" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. WebSocket */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[24px] transition-colors duration-300">
          <SectionHeader icon={Wifi} title="WebSocket Telemetry" desc="Connection settings for live data streams." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            <div>
              <label className="text-[11px] text-gray-500 dark:text-gray-400 block mb-1">Endpoint URL</label>
              <input type="text" defaultValue="ws://localhost:8000/api/v1/ws/telemetry" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[6px] px-3 py-2 text-[12px] text-gray-900 dark:text-gray-100 transition-colors duration-300" />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 dark:text-gray-400 block mb-1">Reconnect Interval (ms)</label>
              <input type="number" defaultValue="5000" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[6px] px-3 py-2 text-[12px] text-gray-900 dark:text-gray-100 transition-colors duration-300" />
            </div>
            <div className="flex items-center justify-center pt-5">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-rose-600 dark:text-rose-500 focus:ring-rose-600 dark:focus:ring-rose-500 transition-colors duration-300" />
                <span className="text-[13px] text-gray-900 dark:text-gray-100 font-medium">Enable Live Feed</span>
              </label>
            </div>
          </div>
        </section>

        {/* 4. Simulation */}
        <section className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-[12px] p-[24px] transition-colors duration-300">
          <SectionHeader icon={Zap} title="Chaos Simulation Engine" desc="Manually trigger anomalies to test AI Copilot RCA capabilities." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            {[
              { id: 'lat', title: 'Simulate Latency Spikes', desc: 'Adds 500-2000ms latency to random API endpoints.' },
              { id: 'err', title: 'Simulate 500 Errors', desc: 'Forces a 15% error rate on downstream services.' },
              { id: 'auth', title: 'Simulate Auth Failures', desc: 'Causes 401 Unauthorized errors for internal tokens.' },
              { id: 'db', title: 'Simulate DB Timeouts', desc: 'Locks queries, causing cascading timeouts.' }
            ].map(sim => (
              <div key={sim.id} className="flex items-start p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[8px] transition-colors duration-300">
                <div className="flex-1">
                  <h4 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 mb-1">{sim.title}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{sim.desc}</p>
                </div>
                <div className="ml-4">
                   <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500 transition-colors duration-300"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Alerts */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[12px] p-[24px] transition-colors duration-300">
          <SectionHeader icon={Bell} title="Alert Thresholds" desc="Global thresholds that trigger incident creation." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            <div>
              <label className="text-[11px] text-gray-500 dark:text-gray-400 block mb-1">Latency Alert (ms)</label>
              <input type="number" defaultValue="800" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[6px] px-3 py-2 text-[12px] text-gray-900 dark:text-gray-100 transition-colors duration-300" />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 dark:text-gray-400 block mb-1">Error Rate Alert (%)</label>
              <input type="number" defaultValue="5" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[6px] px-3 py-2 text-[12px] text-gray-900 dark:text-gray-100 transition-colors duration-300" />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 dark:text-gray-400 block mb-1">Uptime Alert (%)</label>
              <input type="number" defaultValue="99.9" step="0.1" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[6px] px-3 py-2 text-[12px] text-gray-900 dark:text-gray-100 transition-colors duration-300" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
