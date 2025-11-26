import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, Cell } from 'recharts';
import { MOCK_PROJECTS, MOCK_FINANCIAL_CURVE, MOCK_EXPENSES, MOCK_DAILY_LOGS } from '../constants';
import { TrendingUp, AlertTriangle, Wallet, Activity, Ruler, Target, Sun, CloudRain, Cloud, Users, Calendar, CheckCircle2, Clock, Circle, Filter, ChevronDown, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface DashboardProps {
  onViewChange: (view: any) => void;
}

const StatCard: React.FC<{ title: string; value: string; subValue?: string; trend?: string; icon: React.ReactNode; color: string }> = ({ title, value, subValue, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {subValue && <p className="text-sm text-slate-500 mt-1">{subValue}</p>}
      {trend && <p className={`text-xs mt-2 font-medium ${trend.includes('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{trend}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color} text-white shadow-lg shadow-opacity-20`}>
      {icon}
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'planning' | 'completed' | 'paused'>('all');

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(p => statusFilter === 'all' ? true : p.status === statusFilter);
  }, [statusFilter]);

  // Aggregated KPIs
  const totalBudget = filteredProjects.reduce((acc, curr) => acc + curr.budgetTotal, 0);
  const totalSpent = filteredProjects.reduce((acc, curr) => acc + curr.budgetSpent, 0);
  const avgProgress = filteredProjects.length > 0 
    ? Math.round(filteredProjects.reduce((acc, curr) => acc + curr.progress, 0) / filteredProjects.length) 
    : 0;
  const totalArea = filteredProjects.reduce((acc, curr) => acc + curr.area, 0);
  const avgCostPerSqm = totalArea > 0 ? totalSpent / totalArea : 0;

  // Select the "Primary" project to show detailed stages/logs (usually the first one in the filtered list)
  const primaryProject = filteredProjects[0] || null;
  const latestLog = MOCK_DAILY_LOGS.find(l => l.projectId === primaryProject?.id) || MOCK_DAILY_LOGS[0];

  // Prepare ABC Data (Simplified for Demo - Aggregate)
  const expensesSorted = [...MOCK_EXPENSES].sort((a, b) => b.amount - a.amount);
  const abcData = expensesSorted.slice(0, 5).map(e => ({
    name: e.description.length > 15 ? e.description.substring(0, 15) + '...' : e.description,
    value: e.amount
  }));

  const getWeatherIcon = (weather: string) => {
    switch(weather) {
      case 'Sunny': return <Sun className="text-amber-500" size={20} />;
      case 'Rainy': return <CloudRain className="text-blue-500" size={20} />;
      default: return <Cloud className="text-slate-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'planning': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'paused': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Em Andamento';
      case 'planning': return 'Planejamento';
      case 'completed': return 'Concluído';
      case 'paused': return 'Pausado';
      default: return status;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Painel Gerencial</h1>
          <p className="text-slate-500 text-sm">Visão geral do portfólio de obras</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter size={18} className="text-slate-400" />
                </div>
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="appearance-none w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block transition-colors cursor-pointer hover:bg-slate-100"
                >
                    <option value="all">Todas as Situações</option>
                    <option value="active">Em Andamento</option>
                    <option value="planning">Planejamento</option>
                    <option value="completed">Concluídas</option>
                    <option value="paused">Pausadas</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown size={16} className="text-slate-400" />
                </div>
            </div>
            
            <div className="hidden md:flex flex-col items-center justify-center px-4 py-2 bg-blue-50 rounded-lg border border-blue-100 min-w-[100px]">
                <span className="text-[10px] uppercase font-bold text-blue-400">Projetos</span>
                <span className="font-bold text-blue-700 text-lg">{filteredProjects.length}</span>
            </div>
        </div>
      </div>

      {/* KPI Cards (Aggregated) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Orçamento Total" 
          value={`R$ ${(totalSpent / 1000).toFixed(1)}k`}
          subValue={`Previsto: R$ ${(totalBudget / 1000).toFixed(1)}k`}
          trend={filteredProjects.length > 1 ? "Consolidado" : "+12% vs mês anterior"}
          icon={<Wallet size={24} />} 
          color="bg-blue-600" 
        />
        <StatCard 
          title="Progresso Médio" 
          value={`${avgProgress}%`} 
          subValue={`${filteredProjects.length} Obras listadas`}
          icon={<Activity size={24} />} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Custo Médio / m²" 
          value={`R$ ${avgCostPerSqm.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`} 
          subValue={`Área Total: ${totalArea}m²`}
          icon={<Ruler size={24} />} 
          color="bg-indigo-500" 
        />
         <StatCard 
          title="Pontos de Atenção" 
          value="3 Itens" 
          trend="Auditoria Pendente" 
          icon={<AlertTriangle size={24} />} 
          color="bg-amber-500" 
        />
      </div>

      {/* Project Status List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Status da Carteira</h3>
            <button onClick={() => onViewChange('projects')} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                Ver todos <ArrowUpRight size={16} />
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-4">Obra</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Progresso</th>
                        <th className="px-6 py-4 text-right">Financeiro</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-900">{project.name}</div>
                                <div className="text-xs text-slate-500">{project.address}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                                    {getStatusLabel(project.status)}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-slate-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{project.progress}%</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="text-sm font-medium text-slate-900">R$ {project.budgetSpent.toLocaleString('pt-BR')}</div>
                                <div className="text-xs text-slate-500">de R$ {project.budgetTotal.toLocaleString('pt-BR')}</div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                                Nenhuma obra encontrada com o status selecionado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* S-Curve Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500"/>
                Curva S (Consolidada)
            </h3>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-500">Acumulado</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_FINANCIAL_CURVE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val/1000}k`} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="planned" name="Planejado" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPlanned)" strokeWidth={2} />
                <Area type="monotone" dataKey="actual" name="Realizado" stroke="#10b981" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ABC Curve Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Target size={20} className="text-rose-500"/>
                    Top 5 Custos (Geral)
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-500">Pareto 80/20</span>
            </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={abcData} layout="vertical" margin={{ left: 10, right: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0"/>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 11, fill: '#475569'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {abcData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f97316' : '#3b82f6'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Info Grid - Shows Primary Project Details */}
      {primaryProject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stages Progress */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Acompanhamento de Etapas</h3>
                        <p className="text-xs text-slate-500">Obra em destaque: <span className="font-semibold">{primaryProject.name}</span></p>
                    </div>
                    <button onClick={() => onViewChange('projects')} className="text-sm text-blue-600 font-medium hover:underline">Ver Detalhes</button>
                </div>
                <div className="space-y-4">
                    {primaryProject.stages.map((stage) => (
                        <div key={stage.id} className="group">
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                    {stage.status === 'completed' ? <CheckCircle2 size={16} className="text-emerald-500"/> :
                                    stage.status === 'in-progress' ? <Clock size={16} className="text-blue-500 animate-pulse"/> :
                                    <Circle size={16} className="text-slate-300"/>}
                                    <span className={`text-sm font-medium ${stage.status === 'completed' ? 'text-slate-500' : 'text-slate-800'}`}>
                                        {stage.name}
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-slate-600">{stage.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-1000 ${
                                        stage.status === 'completed' ? 'bg-emerald-500' :
                                        stage.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-300'
                                    }`} 
                                    style={{ width: `${stage.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Log Snapshot */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Resumo do Dia</h3>
                    <button onClick={() => onViewChange('dailylog')} className="text-sm text-blue-600 font-medium hover:underline">Ir para Diário</button>
                </div>
                
                {latestLog ? (
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                {getWeatherIcon(latestLog.weather)}
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Clima Hoje</p>
                                <p className="font-medium text-slate-800">
                                    {latestLog.weather === 'Sunny' ? 'Ensolarado' : latestLog.weather === 'Rainy' ? 'Chuvoso' : 'Nublado'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="p-3 bg-white rounded-lg shadow-sm text-indigo-600">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Efetivo em Obra</p>
                                <p className="font-medium text-slate-800">{latestLog.workforceCount} Colaboradores</p>
                            </div>
                        </div>

                        <div className="mt-2">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-2">Última Atividade</p>
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-slate-700">
                                {latestLog.activities[0] || "Sem atividades registradas."}
                            </div>
                        </div>
                        
                        <div className="mt-auto pt-4 text-xs text-slate-400 text-center">
                            Atualizado em: {new Date(latestLog.date).toLocaleDateString('pt-BR')}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">
                        Nenhum registro hoje.
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};