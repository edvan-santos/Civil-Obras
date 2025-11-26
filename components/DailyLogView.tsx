import React from 'react';
import { MOCK_DAILY_LOGS } from '../constants';
import { CloudRain, Sun, Cloud, Calendar, Users, AlertCircle, Plus, Camera } from 'lucide-react';

export const DailyLogView: React.FC = () => {
  const getWeatherIcon = (weather: string) => {
    switch(weather) {
      case 'Sunny': return <Sun className="text-amber-500" />;
      case 'Rainy': return <CloudRain className="text-blue-500" />;
      default: return <Cloud className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Diário de Obra</h1>
          <p className="text-slate-500">Registro diário de atividades e ocorrências</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Plus size={18} />
          <span>Novo Registro</span>
        </button>
      </div>

      <div className="grid gap-6">
        {MOCK_DAILY_LOGS.map((log) => (
          <div key={log.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 p-3 rounded-lg">
                    <Calendar className="text-slate-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                        {new Date(log.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1">{getWeatherIcon(log.weather)} {log.weather === 'Sunny' ? 'Ensolarado' : 'Chuvoso'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Users size={14}/> {log.workforceCount} Colaboradores</span>
                    </div>
                  </div>
                </div>
                
                {log.wasteReported && (
                  <div className="mt-3 md:mt-0 px-3 py-1 bg-red-50 border border-red-100 text-red-700 rounded-full text-sm font-medium flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    Desperdício Registrado
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Atividades Realizadas</h4>
                  <ul className="space-y-2">
                    {log.activities.map((act, idx) => (
                      <li key={idx} className="flex items-start text-slate-700">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Observações</h4>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg text-sm">
                    {log.notes}
                  </p>
                </div>

                {log.wasteReported && (
                   <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                       <h4 className="text-sm font-bold text-red-800 mb-1">Registro de Desperdício/Ocorrência</h4>
                       <p className="text-red-700 text-sm">{log.wasteReported}</p>
                   </div>
                )}

                <div className="pt-4 flex gap-2">
                    <button className="text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors flex items-center">
                        <Camera size={16} className="mr-2" />
                        Ver Fotos (2)
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};