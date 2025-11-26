import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project, Stage } from '../types';
import { Calendar, MapPin, ArrowRight, CheckCircle2, Clock, Circle, X, Save, DollarSign, Ruler } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initial empty state for a new project
  const initialFormState: Partial<Project> = {
    name: '',
    client: '',
    address: '',
    budgetTotal: 0,
    area: 0,
    bdi: 0,
    startDate: '',
    endDate: '',
    status: 'planning',
    progress: 0,
    budgetSpent: 0
  };

  const [formData, setFormData] = useState<Partial<Project>>(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budgetTotal' || name === 'area' || name === 'bdi' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'Nova Obra',
      client: formData.client || 'Cliente não informado',
      status: 'planning',
      progress: 0,
      budgetTotal: formData.budgetTotal || 0,
      budgetSpent: 0,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || '',
      thumbnail: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
      address: formData.address || '',
      area: formData.area || 0,
      bdi: formData.bdi || 0,
      stages: [
        { id: 's1', name: 'Planejamento', status: 'in-progress', progress: 50 },
        { id: 's2', name: 'Mobilização', status: 'pending', progress: 0 },
        { id: 's3', name: 'Execução', status: 'pending', progress: 0 }
      ]
    };

    setProjects([...projects, newProject]);
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Meus Projetos</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30"
        >
          <span>+ Novo Projeto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={project.thumbnail} 
                alt={project.name} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute top-3 right-3 px-2 py-1 backdrop-blur rounded text-xs font-bold uppercase tracking-wider ${
                project.status === 'active' ? 'bg-emerald-500/90 text-white' : 'bg-slate-800/90 text-white'
              }`}>
                {project.status === 'active' ? 'Em Andamento' : 'Planejamento'}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                 <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
                 <p className="text-slate-200 text-sm">{project.client}</p>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar size={16} className="mr-2 text-slate-400" />
                  <span>Entrega: {project.endDate ? new Date(project.endDate).toLocaleDateString('pt-BR') : 'A definir'}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin size={16} className="mr-2 text-slate-400" />
                  <span>{project.address}</span>
                </div>
              </div>

              <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Cronograma de Etapas</h4>
                  <div className="space-y-3">
                      {project.stages?.slice(0, 3).map(stage => (
                          <div key={stage.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                  {stage.status === 'completed' ? <CheckCircle2 size={16} className="text-emerald-500"/> :
                                   stage.status === 'in-progress' ? <Clock size={16} className="text-blue-500"/> :
                                   <Circle size={16} className="text-slate-300"/>}
                                  <span className={`font-medium ${stage.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                      {stage.name}
                                  </span>
                              </div>
                              <span className="text-xs text-slate-500">{stage.progress}%</span>
                          </div>
                      ))}
                      {(project.stages?.length || 0) > 3 && (
                          <div className="text-xs text-center text-slate-400 pt-1">
                              + {project.stages!.length - 3} etapas restantes
                          </div>
                      )}
                  </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Progresso Geral</span>
                  <span className="text-xs font-bold text-blue-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                
                <button className="mt-4 w-full flex items-center justify-center space-x-2 text-accent font-medium hover:bg-blue-50 py-2 rounded-lg transition-colors">
                  <span>Painel de Controle</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">Cadastrar Nova Obra</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nome da Obra</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Ex: Residencial Flores"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Cliente / Proprietário</label>
                    <input 
                      type="text" 
                      name="client"
                      required
                      value={formData.client}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-700">Endereço Completo</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Rua, Número, Bairro, Cidade"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial & Dimensions */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Financeiro e Dimensões</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Orçamento Total (R$)</label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input 
                        type="number" 
                        name="budgetTotal"
                        required
                        value={formData.budgetTotal}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Área Construída (m²)</label>
                    <div className="relative">
                      <Ruler size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input 
                        type="number" 
                        name="area"
                        required
                        value={formData.area}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">BDI (%)</label>
                    <input 
                      type="number" 
                      name="bdi"
                      required
                      value={formData.bdi}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Cronograma Macro</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Data de Início</label>
                    <input 
                      type="date" 
                      name="startDate"
                      required
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Previsão de Entrega</label>
                    <input 
                      type="date" 
                      name="endDate"
                      required
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
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
                  Salvar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};