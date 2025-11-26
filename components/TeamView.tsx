import React, { useState } from 'react';
import { MOCK_WORKERS, MOCK_EQUIPMENT } from '../constants';
import { Worker, Equipment } from '../types';
import { HardHat, Truck, Clock, Hammer, Plus, X, Save, User, DollarSign, Briefcase, Wrench } from 'lucide-react';

export const TeamView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workers' | 'equipment'>('workers');
  
  // State for Lists
  const [workers, setWorkers] = useState<Worker[]>(MOCK_WORKERS);
  const [equipment, setEquipment] = useState<Equipment[]>(MOCK_EQUIPMENT);

  // Modal States
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);

  // Form States
  const initialWorkerState: Partial<Worker> = {
    name: '',
    role: '',
    rate: 0,
    type: 'Employee',
    status: 'Active'
  };
  const [workerForm, setWorkerForm] = useState<Partial<Worker>>(initialWorkerState);

  const initialEquipmentState: Partial<Equipment> = {
    name: '',
    costPerDay: 0,
    status: 'Available'
  };
  const [equipmentForm, setEquipmentForm] = useState<Partial<Equipment>>(initialEquipmentState);

  // Handlers
  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWorker: Worker = {
      id: Math.random().toString(36).substr(2, 9),
      name: workerForm.name || 'Novo Colaborador',
      role: workerForm.role || 'Geral',
      rate: Number(workerForm.rate) || 0,
      type: workerForm.type as 'Employee' | 'Contractor',
      status: workerForm.status as 'Active' | 'OnLeave'
    };
    setWorkers([...workers, newWorker]);
    setIsWorkerModalOpen(false);
    setWorkerForm(initialWorkerState);
  };

  const handleEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEquipment: Equipment = {
      id: Math.random().toString(36).substr(2, 9),
      name: equipmentForm.name || 'Novo Equipamento',
      costPerDay: Number(equipmentForm.costPerDay) || 0,
      status: equipmentForm.status as 'InUse' | 'Available' | 'Maintenance',
      assignedTo: equipmentForm.status === 'InUse' ? '1' : undefined // Assign to mock project if in use
    };
    setEquipment([...equipment, newEquipment]);
    setIsEquipmentModalOpen(false);
    setEquipmentForm(initialEquipmentState);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Equipes e Equipamentos</h1>
          <p className="text-slate-500">Gestão de mão de obra e maquinário</p>
        </div>
        
        <button 
          onClick={() => activeTab === 'workers' ? setIsWorkerModalOpen(true) : setIsEquipmentModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm shadow-blue-500/30"
        >
          <Plus size={18} />
          <span>{activeTab === 'workers' ? 'Novo Colaborador' : 'Novo Equipamento'}</span>
        </button>
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('workers')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'workers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Mão de Obra
        </button>
        <button
          onClick={() => setActiveTab('equipment')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'equipment' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Equipamentos
        </button>
      </div>

      {activeTab === 'workers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <div key={worker.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-full ${worker.type === 'Employee' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                    <HardHat className={worker.type === 'Employee' ? 'text-blue-600' : 'text-purple-600'} size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{worker.name}</h3>
                    <p className="text-sm text-slate-500">{worker.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    worker.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {worker.status === 'Active' ? 'Ativo' : 'Afastado'}
                </span>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100 space-y-2 text-sm">
                 <div className="flex justify-between">
                     <span className="text-slate-500">Vínculo:</span>
                     <span className="font-medium">{worker.type === 'Employee' ? 'CLT / Próprio' : 'Terceirizado'}</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-slate-500">Custo Diário:</span>
                     <span className="font-medium text-slate-900">R$ {worker.rate.toFixed(2)}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'equipment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
               <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 p-2.5 rounded-full">
                    <Truck className="text-amber-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-500">Locação / Próprio</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                    item.status === 'InUse' ? 'bg-blue-100 text-blue-800' : 
                    item.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status === 'InUse' && <Hammer size={12}/>}
                  {item.status === 'InUse' ? 'Em Uso' : item.status === 'Available' ? 'Disponível' : 'Manutenção'}
                </span>
              </div>
               <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-sm">
                 <div className="flex justify-between">
                     <span className="text-slate-500">Custo Diário:</span>
                     <span className="font-medium text-slate-900">R$ {item.costPerDay.toFixed(2)}</span>
                 </div>
                 {item.assignedTo && (
                     <div className="flex justify-between text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        <span className="flex items-center gap-1"><Clock size={14}/> Em uso no projeto</span>
                     </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Worker Modal */}
      {isWorkerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Cadastrar Colaborador</h2>
              <button onClick={() => setIsWorkerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleWorkerSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    value={workerForm.name}
                    onChange={e => setWorkerForm({...workerForm, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Nome do funcionário"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Função</label>
                    <div className="relative">
                        <Briefcase size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            required 
                            value={workerForm.role}
                            onChange={e => setWorkerForm({...workerForm, role: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="Ex: Pedreiro"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Custo/Dia (R$)</label>
                    <div className="relative">
                        <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                            type="number" 
                            required 
                            min="0"
                            step="0.01"
                            value={workerForm.rate}
                            onChange={e => setWorkerForm({...workerForm, rate: Number(e.target.value)})}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="0.00"
                        />
                    </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Tipo de Vínculo</label>
                      <select 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={workerForm.type}
                        onChange={e => setWorkerForm({...workerForm, type: e.target.value as any})}
                      >
                          <option value="Employee">Próprio (CLT)</option>
                          <option value="Contractor">Terceirizado</option>
                      </select>
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Status</label>
                      <select 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={workerForm.status}
                        onChange={e => setWorkerForm({...workerForm, status: e.target.value as any})}
                      >
                          <option value="Active">Ativo</option>
                          <option value="OnLeave">Afastado</option>
                      </select>
                  </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsWorkerModalOpen(false)} className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-accent hover:bg-blue-700 text-white rounded-lg font-medium flex items-center">
                  <Save size={18} className="mr-2" /> Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Equipment Modal */}
      {isEquipmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Cadastrar Equipamento</h2>
              <button onClick={() => setIsEquipmentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEquipmentSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nome do Equipamento</label>
                <div className="relative">
                  <Wrench size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    value={equipmentForm.name}
                    onChange={e => setEquipmentForm({...equipmentForm, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Ex: Betoneira 400L"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Custo Diário (R$)</label>
                    <div className="relative">
                        <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                            type="number" 
                            required 
                            min="0"
                            step="0.01"
                            value={equipmentForm.costPerDay}
                            onChange={e => setEquipmentForm({...equipmentForm, costPerDay: Number(e.target.value)})}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Status Atual</label>
                    <select 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={equipmentForm.status}
                        onChange={e => setEquipmentForm({...equipmentForm, status: e.target.value as any})}
                    >
                        <option value="Available">Disponível</option>
                        <option value="InUse">Em Uso</option>
                        <option value="Maintenance">Manutenção</option>
                    </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsEquipmentModalOpen(false)} className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-accent hover:bg-blue-700 text-white rounded-lg font-medium flex items-center">
                  <Save size={18} className="mr-2" /> Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};