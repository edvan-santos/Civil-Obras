import React, { useState } from 'react';
import { MOCK_EXPENSES, MOCK_PROJECTS } from '../constants';
import { Filter, Download, Plus, Search, PieChart, Coins, TrendingUp, X, Save, Calendar, Tag, DollarSign, Briefcase } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { Expense } from '../types';

export const BudgetView: React.FC = () => {
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'abc'>('list');
  const [filterCategory, setFilterCategory] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialFormState: Partial<Expense> = {
    description: '',
    category: 'Material',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    supplierId: ''
  };
  const [formData, setFormData] = useState<Partial<Expense>>(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      description: formData.description || 'Sem descrição',
      category: formData.category as any,
      amount: formData.amount || 0,
      date: formData.date || new Date().toISOString(),
      projectId: MOCK_PROJECTS[0].id, // Defaulting to the active project for this demo
      status: formData.status as 'paid' | 'pending',
      supplierId: formData.supplierId
    };

    setLocalExpenses([newExpense, ...localExpenses]);
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const filteredExpenses = localExpenses.filter(expense => 
    (filterCategory === 'All' || expense.category === filterCategory) &&
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFiltered = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

  // ABC Analysis Logic
  const sortedExpenses = [...localExpenses].sort((a, b) => b.amount - a.amount);
  const totalBudget = localExpenses.reduce((sum, item) => sum + item.amount, 0);
  let accumulated = 0;
  const abcData = sortedExpenses.map(item => {
    accumulated += item.amount;
    const percentage = (accumulated / totalBudget) * 100;
    let classification = 'C';
    if (percentage <= 80) classification = 'A';
    else if (percentage <= 95) classification = 'B';
    
    return {
        name: item.description,
        value: item.amount,
        class: classification,
        percentage: percentage
    };
  });

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financeiro & Orçamento</h1>
          <p className="text-slate-500">Controle de custos, BDI e Curva ABC</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 bg-white" onClick={() => alert("Relatório exportado para Excel")}>
            <Download size={18} />
            <span className="hidden md:inline">Exportar</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm shadow-blue-500/30"
          >
            <Plus size={18} />
            <span>Nova Despesa</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-slate-500 text-xs font-bold uppercase">Custos Diretos</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">R$ 45.200,00</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Coins size={20} /></div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-slate-500 text-xs font-bold uppercase">Custos Indiretos</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">R$ 3.500,00</p>
              </div>
              <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><PieChart size={20} /></div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-slate-500 text-xs font-bold uppercase">BDI Aplicado</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{MOCK_PROJECTS[0].bdi}%</p>
                  <p className="text-xs text-slate-400">Lucro e Despesas Indiretas</p>
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><TrendingUp size={20} /></div>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
          <button 
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${viewMode === 'list' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setViewMode('list')}
          >
              Extrato de Despesas
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${viewMode === 'abc' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setViewMode('abc')}
          >
              Curva ABC de Insumos
          </button>
      </div>

      {viewMode === 'list' ? (
        <>
            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar despesa..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
                
                <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
                <Filter size={20} className="text-slate-400 mr-2 flex-shrink-0" />
                {['All', 'Material', 'Labor', 'Equipment', 'Indirect'].map(cat => (
                    <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        filterCategory === cat 
                        ? 'bg-slate-800 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    >
                    {cat === 'All' ? 'Todos' : cat}
                    </button>
                ))}
                </div>
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descrição</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoria</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Valor</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {filteredExpenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{expense.description}</div>
                            {expense.supplierId && <div className="text-xs text-slate-400">{expense.supplierId === 'sup1' ? 'Casa do Construtor' : 'Fornecedor Externo'}</div>}
                        </td>
                        <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {expense.category}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm">
                            {new Date(expense.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-slate-900 font-medium text-right">
                            R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            expense.status === 'paid' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                            {expense.status === 'paid' ? 'Pago' : 'Pendente'}
                            </span>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                        <td colSpan={3} className="px-6 py-4 text-sm font-bold text-slate-700 text-right">Total Filtrado:</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                        R$ {totalFiltered.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
                </div>
            </div>
        </>
      ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Análise Curva ABC (Pareto)</h3>
                  <p className="text-sm text-slate-500">Identifique os itens de maior impacto financeiro na obra.</p>
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={abcData} layout="vertical" margin={{ left: 40, right: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" tickFormatter={(val) => `R$${val/1000}k`} />
                        <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 12}} />
                        <Tooltip 
                            formatter={(value: number, name, props) => [
                                `R$ ${value.toLocaleString('pt-BR')}`, 
                                `Classe ${props.payload.class}`
                            ]} 
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={25}>
                            {abcData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.class === 'A' ? '#ef4444' : entry.class === 'B' ? '#f97316' : '#10b981'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Classe A (Alta Prioridade)</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Classe B (Média)</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Classe C (Baixa)</span>
                  </div>
              </div>
          </div>
      )}

      {/* New Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Lançar Nova Despesa</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveExpense} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Descrição do Gasto</label>
                <input 
                  type="text" 
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ex: Compra de Cimento"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Categoria</label>
                  <div className="relative">
                    <Tag size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <select 
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                    >
                        <option value="Material">Material</option>
                        <option value="Labor">Mão de Obra</option>
                        <option value="Equipment">Equipamento</option>
                        <option value="Permits">Documentação</option>
                        <option value="Indirect">Indireto</option>
                        <option value="Other">Outros</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Valor (R$)</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                        type="number" 
                        name="amount"
                        required
                        min="0"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Data</label>
                    <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                        type="date" 
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Status</label>
                    <select 
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="paid">Pago</option>
                        <option value="pending">Pendente</option>
                    </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Fornecedor (Opcional)</label>
                <div className="relative">
                    <Briefcase size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                    type="text" 
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Nome do Fornecedor"
                    />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center shadow-lg shadow-emerald-500/20"
                >
                  <Save size={18} className="mr-2" />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};