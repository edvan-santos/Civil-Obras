import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  HardHat, 
  Coins, 
  Package, 
  FileBarChart2, 
  Menu,
  X,
  LogOut,
  NotebookPen,
  Users
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ProjectsView } from './components/ProjectsView';
import { BudgetView } from './components/BudgetView';
import { MaterialView } from './components/MaterialView';
import { AIReportView } from './components/AIReportView';
import { DailyLogView } from './components/DailyLogView';
import { TeamView } from './components/TeamView';

// Navigation Types
type ViewState = 'dashboard' | 'projects' | 'budget' | 'materials' | 'reports' | 'dailylog' | 'team';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'projects', label: 'Projetos', icon: <HardHat size={20} /> },
    { id: 'dailylog', label: 'Diário de Obra', icon: <NotebookPen size={20} /> },
    { id: 'budget', label: 'Financeiro', icon: <Coins size={20} /> },
    { id: 'materials', label: 'Materiais', icon: <Package size={20} /> },
    { id: 'team', label: 'Equipe & Equip.', icon: <Users size={20} /> },
    { id: 'reports', label: 'Auditoria IA', icon: <FileBarChart2 size={20} /> },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onViewChange={setCurrentView} />;
      case 'projects': return <ProjectsView />;
      case 'budget': return <BudgetView />;
      case 'materials': return <MaterialView />;
      case 'reports': return <AIReportView />;
      case 'dailylog': return <DailyLogView />;
      case 'team': return <TeamView />;
      default: return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shadow-xl z-20">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
          <div className="bg-accent p-2 rounded-lg">
            <HardHat size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">CivilControl</h1>
            <p className="text-xs text-slate-400">Gestão Inteligente</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewState)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                currentView === item.id 
                  ? 'bg-accent text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-slate-800">
          <span className="text-xl font-bold">CivilControl</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as ViewState);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                currentView === item.id ? 'bg-accent text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header - Mobile Only Trigger */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-accent p-1.5 rounded text-white">
              <HardHat size={20} />
            </div>
            <span className="font-bold text-slate-800">CivilControl AI</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;