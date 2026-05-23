import React, { useState } from 'react';
import { Download, FileText, Code, Table, X } from 'lucide-react';
import { reportService } from '../services/api';

interface ReportModalProps {
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async (type: 'pdf' | 'json' | 'csv') => {
    setLoading(true);
    try {
      if (type === 'pdf') {
        reportService.downloadPdf();
      } else if (type === 'json') {
        reportService.downloadJson();
      } else if (type === 'csv') {
        reportService.downloadCsv();
      }
      
      // Artificial delay to show loading state
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Generate Incident Report</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Export observability data and AI RCA.</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => handleDownload('pdf')}
            className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-rose-500" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Executive PDF Report</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Professional layout with AI insights</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400" />
          </button>

          <button 
            onClick={() => handleDownload('json')}
            className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Code className="w-5 h-5 text-blue-500" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Raw JSON Export</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Machine-readable incident data</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400" />
          </button>

          <button 
            onClick={() => handleDownload('csv')}
            className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Table className="w-5 h-5 text-emerald-500" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Telemetry CSV</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Spreadsheet of metrics and logs</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {loading && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-indigo-600 dark:text-indigo-400">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Generating report...</span>
          </div>
        )}
      </div>
    </div>
  );
};
