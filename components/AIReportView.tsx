import React, { useState } from 'react';
import { Bot, FileText, CheckCircle2, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
import { analyzeProjectHealth } from '../services/geminiService';
import { MOCK_PROJECTS, MOCK_EXPENSES, MOCK_MATERIALS } from '../constants';
import { AIAnalysisResult } from '../types';

export const AIReportView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeProjectHealth(MOCK_PROJECTS[0], MOCK_EXPENSES, MOCK_MATERIALS);
      setReport(result);
    } catch (err) {
      setError("Não foi possível gerar o relatório. Verifique sua chave API ou tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
          <Bot size={48} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Auditoria Inteligente (IA)</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Utilize inteligência artificial para analisar desvios de orçamento, desperdícios de materiais e riscos de cronograma em segundos.
        </p>
        
        {!report && !loading && (
          <button 
            onClick={handleGenerateReport}
            className="mt-6 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center mx-auto space-x-2"
          >
            <FileText size={20} />
            <span>Gerar Relatório Completo</span>
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center mt-8 space-y-3">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <p className="text-slate-500 font-medium">Analisando dados da obra...</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-lg inline-block">
            {error}
          </div>
        )}
      </div>

      {report && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
          <div className="bg-slate-50 p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <CheckCircle2 className="text-emerald-500 mr-2" />
              Resultado da Auditoria
            </h2>
          </div>
          
          <div className="p-8 space-y-8">
            {/* Summary */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-blue-900 font-bold mb-2 flex items-center text-lg">
                <FileText size={20} className="mr-2" />
                Resumo Executivo
              </h3>
              <p className="text-blue-800 leading-relaxed">{report.summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Risks */}
              <div>
                <h3 className="text-slate-900 font-bold mb-4 flex items-center text-lg">
                  <AlertTriangle size={20} className="mr-2 text-amber-500" />
                  Riscos Identificados
                </h3>
                <ul className="space-y-3">
                  {report.risks.map((risk, idx) => (
                    <li key={idx} className="flex items-start text-slate-700 bg-amber-50 p-3 rounded-lg border border-amber-100/50">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-slate-900 font-bold mb-4 flex items-center text-lg">
                  <CheckCircle2 size={20} className="mr-2 text-emerald-500" />
                  Recomendações
                </h3>
                <ul className="space-y-3">
                  {report.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start text-slate-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100/50">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Savings */}
            <div className="border-t border-slate-100 pt-6 mt-6">
               <h3 className="text-slate-900 font-bold mb-3 flex items-center text-lg">
                  <Lightbulb size={20} className="mr-2 text-purple-500" />
                  Potencial de Economia
                </h3>
                <p className="text-slate-600 italic border-l-4 border-purple-500 pl-4 py-1">
                  "{report.savingsPotential}"
                </p>
            </div>

            <div className="flex justify-center pt-4">
              <button 
                onClick={handleGenerateReport}
                className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center transition-colors"
              >
                <Loader2 size={14} className="mr-1" />
                Atualizar Análise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};