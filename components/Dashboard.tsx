import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, Cell } from 'recharts';
import { MOCK_PROJECTS, MOCK_FINANCIAL_CURVE, MOCK_EXPENSES } from '../constants';
import { TrendingUp, AlertTriangle, Wallet, Activity, Ruler, Target } from 'lucide-react';

interface DashboardProps {
  onViewChange: (view: any) => void;
}

const StatCard: React.FC<{ title: string; value: string; subValue?: string; trend?: string; icon: React.ReactNode; color: string }> = ({ title, value, subValue, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {subValue && <p className="text-sm text-slate-500 mt-1">{subValue}</p>}
      {trend && <p className={`text-xs mt-2 font-medium ${trend.includes('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{trend}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color} text-white`}>
      {icon}
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = () => {
  const activeProject = MOCK_PROJECTS[0];
  const totalBudget = activeProject.budgetTotal;
  const totalSpent = activeProject.budgetSpent;
  const costPerSqm = totalSpent / activeProject.area;

  // Prepare ABC Data (Simplified)
  const expensesSorted = [...MOCK_EXPENSES].sort((a, b) => b.amount - a.amount);
  const abcData = expensesSorted.slice(0, 5).map(e => ({
    name: e.description.substring(0, 15) + '...',
    value: e.amount
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visão Geral da Obra</h1>
          <p className="text-slate-500">{activeProject.name} - {activeProject.address}</p>
        </div>
        <div className="mt-2 md:mt-0 flex items-center space-x-3">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-semibold border border-slate-200">
                BDI: {activeProject.bdi}%
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold border border-emerald-200">
                Status: {activeProject.status === 'active' ? 'Em Andamento' : 'Pausado'}
            </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Orçamento Executado" 
          value={`R$ ${(totalSpent / 1000).toFixed(1)}k`}
          subValue={`de R$ ${(totalBudget / 1000).toFixed(1)}k`}
          trend="+12% vs mês anterior" 
          icon={<Wallet size={24} />} 
          color="bg-blue-600" 
        />
        <StatCard 
          title="Progresso Físico" 
          value={`${activeProject.progress}%`} 
          subValue="Cronograma em dia"
          icon={<Activity size={24} />} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Custo por m² (Atual)" 
          value={`R$ ${costPerSqm.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`} 
          subValue={`Área: ${activeProject.area}m²`}
          icon={<Ruler size={24} />} 
          color="bg-indigo-500" 
        />
         <StatCard 
          title="Pontos de Atenção" 
          value="3 Itens" 
          trend="Desperdício detectado" 
          icon={<AlertTriangle size={24} />} 
          color="bg-amber-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* S-Curve Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Curva S (Físico-Financeira)</h3>
            <span className="text-xs text-slate-400">Acumulado Mensal</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_FINANCIAL_CURVE}>
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
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="planned" name="Planejado" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPlanned)" />
                <Area type="monotone" dataKey="actual" name="Realizado" stroke="#10b981" fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ABC Curve Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Curva ABC (Top 5 Custos)</h3>
                <span className="text-xs text-slate-400">Impacto no Orçamento</span>
            </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={abcData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0"/>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                    {abcData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f97316' : '#3b82f6'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};