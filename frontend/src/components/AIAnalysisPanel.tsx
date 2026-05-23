import React, { useState } from 'react';
import { Bot, Sparkles, Target, AlertCircle } from 'lucide-react';
import { aiService } from '../services/api';
import { AIRemediationList } from './AIRemediationList';

export const AIAnalysisPanel: React.FC<{ incident: any }> = ({ incident }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await aiService.analyzeIncident(incident);
      setAnalysis(data);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!analysis && !loading) {
    return (
      <button 
        onClick={handleAnalyze}
        className="w-full mt-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
      >
        <Sparkles className="w-5 h-5" />
        <span className="font-semibold">Generate Gemini AI RCA</span>
      </button>
    );
  }

  if (loading) {
    return (
      <div className="mt-4 p-6 bg-slate-800/50 rounded-xl border border-indigo-500/30 flex flex-col items-center justify-center space-y-3">
        <Bot className="w-8 h-8 text-indigo-400 animate-pulse" />
        <span className="text-sm font-medium text-indigo-300">Gemini is analyzing the incident...</span>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-indigo-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Bot className="w-32 h-32 text-indigo-400" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">Gemini Root Cause Analysis</h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-400 mb-1">AI Confidence</span>
            <span className="text-lg font-bold text-emerald-400">{(analysis.confidence_score * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700">
            <h4 className="text-xs font-semibold text-slate-500 uppercase flex items-center mb-1">
              <Target className="w-3.5 h-3.5 mr-1" /> Primary Root Cause
            </h4>
            <p className="text-sm font-medium text-slate-200">{analysis.root_cause}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase flex items-center mb-1">
              <AlertCircle className="w-3.5 h-3.5 mr-1" /> Executive Summary
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">{analysis.explanation}</p>
          </div>

          <AIRemediationList fixes={analysis.suggested_fixes} />
        </div>
      </div>
    </div>
  );
};
