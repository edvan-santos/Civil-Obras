import React, { useState } from 'react';
import { MOCK_DAILY_LOGS } from '../constants';
import { DailyLog } from '../types';
import { CloudRain, Sun, Cloud, Calendar, Users, AlertCircle, Plus, Camera, X, Save, FileText, Activity } from 'lucide-react';

export const DailyLogView: React.FC = () => {
  const [logs, setLogs] = useState<DailyLog[]>(MOCK_DAILY_LOGS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const initialFormState: Partial<DailyLog> = {
    date: new Date().toISOString().split('T')[0],
    weather: 'Sunny',
    workforceCount: 0,
    activities: [],
    notes: '',
    wasteReported: ''
  };
  
  const [formData, setFormData] = useState<{
    date: string;
    weather: string;
    workforceCount: number;
    activitiesText: string; // Helper for textarea
    notes: string;
    wasteReported: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    weather: 'Sunny',
    workforceCount: 0,
    activitiesText: '',
    notes: '',
    wasteReported: ''
  });

  const getWeatherIcon = (weather: string) => {
    switch(weather) {
      case 'Sunny': return <Sun className="text-amber-500" />;
      case 'Rainy': return <CloudRain className="text-blue-500" />;
      default: return <Cloud className="text-slate-400" />;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'workforceCount' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLog: DailyLog = {
      id: Math.random().toString(36).substr(2, 9),
      projectId: '1', // Defaulting to active project
      date: formData.date,
      weather: formData.weather as 'Sunny' | 'Rainy' | 'Cloudy',
      workforceCount: formData.workforceCount,
      activities: formData.activitiesText.split('\n').filter(line => line.trim() !== ''),
      notes: formData.notes,
      wasteReported: formData.wasteReported || undefined
    };

    setLogs([newLog, ...logs]);
    setIsModalOpen(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weather: 'Sunny',
      workforceCount: 0,
      activitiesText: '',
      notes: '',
      wasteReported: ''
    });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Diário de Obra</h1>
          <p className="text-slate-500">Registro diário de atividades e ocorrências</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          <span>Novo Registro</span>
        </button>
      </div>

      <div className="grid gap-6">
        {logs.map((log) => (
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
                        <span className="flex items-center gap-1">{getWeatherIcon(log.weather)} {log.weather === 'Sunny' ? 'Ensolarado' : log.weather === 'Rainy' ? 'Chuvoso' : 'Nublado'}</span>
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
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
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

      {/* New Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">Novo Relatório Diário</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Data</label>
                  <input 
                    type="date" 
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Condição Climática</label>
                  <div className="relative">
                    <select 
                        name="weather"
                        value={formData.weather}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"
                    >
                        <option value="Sunny">Ensolarado</option>
                        <option value="Cloudy">Nublado</option>
                        <option value="Rainy">Chuvoso</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                      <Cloud size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Efetivo em Obra (Qtd. Pessoas)</label>
                <div className="relative">
                  <Users size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number" 
                    name="workforceCount"
                    min="0"
                    required
                    value={formData.workforceCount}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Atividades Realizadas (1 por linha)</label>
                <div className="relative">
                    <Activity size={18} className="absolute left-3 top-3 text-slate-400" />
                    <textarea 
                        name="activitiesText"
                        required
                        value={formData.activitiesText}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                        placeholder="- Concretagem da laje&#10;- Instalação de batentes"
                    />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Observações Gerais</label>
                <div className="relative">
                    <FileText size={18} className="absolute left-3 top-3 text-slate-400" />
                    <textarea 
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                        placeholder="Observações sobre entregas, visitas ou inspeções..."
                    />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    Ocorrências / Desperdícios (Opcional)
                </label>
                <input 
                    type="text" 
                    name="wasteReported"
                    value={formData.wasteReported}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-red-200 bg-red-50 text-red-900 rounded-lg focus:ring-2 focus:ring-red-500 outline-none placeholder-red-300"
                    placeholder="Descreva quebras, acidentes ou atrasos graves"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-accent hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center shadow-lg shadow-blue-500/20"
                >
                  <Save size={18} className="mr-2" />
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};