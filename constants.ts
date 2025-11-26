import { Project, Expense, Material, MonthlyStats, DailyLog, Worker, Equipment, Supplier } from './types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Residencial Altos do Lago',
    client: 'Construtora Horizonte',
    status: 'active',
    progress: 65,
    budgetTotal: 1500000,
    budgetSpent: 980000,
    startDate: '2023-08-01',
    endDate: '2024-05-30',
    thumbnail: 'https://picsum.photos/400/300?random=1',
    address: 'Rua das Palmeiras, 123 - Lago Norte',
    area: 450,
    bdi: 22.5,
    stages: [
      { id: 's1', name: 'Fundação', status: 'completed', progress: 100 },
      { id: 's2', name: 'Estrutura', status: 'completed', progress: 100 },
      { id: 's3', name: 'Alvenaria', status: 'in-progress', progress: 85 },
      { id: 's4', name: 'Instalações', status: 'in-progress', progress: 40 },
      { id: 's5', name: 'Acabamento', status: 'pending', progress: 0 },
    ]
  },
  {
    id: '2',
    name: 'Reforma Comercial Centro',
    client: 'Silva & Associados',
    status: 'planning',
    progress: 10,
    budgetTotal: 350000,
    budgetSpent: 15000,
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    thumbnail: 'https://picsum.photos/400/300?random=2',
    address: 'Av. Paulista, 1000 - CJ 42',
    area: 120,
    bdi: 18.0,
    stages: [
      { id: 's1', name: 'Demolição', status: 'completed', progress: 100 },
      { id: 's2', name: 'Drywall', status: 'pending', progress: 0 },
    ]
  }
];

export const MOCK_EXPENSES: Expense[] = [
  { id: '1', description: 'Concreto Usinado FCK 30', category: 'Material', amount: 15000, date: '2024-02-10', projectId: '1', status: 'paid', supplierId: 'sup1' },
  { id: '2', description: 'Mão de Obra - Pedreiros (Quinzena)', category: 'Labor', amount: 12500, date: '2024-02-15', projectId: '1', status: 'paid' },
  { id: '3', description: 'Aluguel Betoneira', category: 'Equipment', amount: 800, date: '2024-02-12', projectId: '1', status: 'pending', supplierId: 'sup2' },
  { id: '4', description: 'Aço CA-50 10mm', category: 'Material', amount: 8900, date: '2024-02-05', projectId: '1', status: 'paid', supplierId: 'sup1' },
  { id: '5', description: 'Licença Prefeitura', category: 'Permits', amount: 2500, date: '2024-01-20', projectId: '1', status: 'paid' },
  { id: '6', description: 'Tijolo Cerâmico 8 furos', category: 'Material', amount: 4500, date: '2024-02-18', projectId: '1', status: 'pending', supplierId: 'sup3' },
  { id: '7', description: 'Administração Local', category: 'Indirect', amount: 3500, date: '2024-02-01', projectId: '1', status: 'paid' },
];

export const MOCK_MATERIALS: Material[] = [
  { id: '1', name: 'Cimento CP-II', unit: 'Sacos (50kg)', quantityTotal: 1000, quantityUsed: 650, costPerUnit: 35.00, category: 'Estrutura', projectId: '1', minThreshold: 100, supplierId: 'sup1', waste: 12 },
  { id: '2', name: 'Areia Média', unit: 'm³', quantityTotal: 150, quantityUsed: 90, costPerUnit: 120.00, category: 'Estrutura', projectId: '1', minThreshold: 20, supplierId: 'sup2', waste: 5 },
  { id: '3', name: 'Tijolo 6 Furos', unit: 'milheiro', quantityTotal: 20, quantityUsed: 12, costPerUnit: 850.00, category: 'Alvenaria', projectId: '1', minThreshold: 5, supplierId: 'sup3', waste: 0.5 },
  { id: '4', name: 'Porcelanato 80x80', unit: 'm²', quantityTotal: 300, quantityUsed: 0, costPerUnit: 110.00, category: 'Acabamento', projectId: '1', minThreshold: 300, supplierId: 'sup4', waste: 0 },
  { id: '5', name: 'Tinta Acrílica Branco', unit: 'Lata 18L', quantityTotal: 40, quantityUsed: 5, costPerUnit: 350.00, category: 'Pintura', projectId: '1', minThreshold: 10, supplierId: 'sup4', waste: 0 },
];

export const MOCK_DAILY_LOGS: DailyLog[] = [
  { 
    id: 'd1', 
    date: '2024-02-20', 
    projectId: '1', 
    weather: 'Sunny', 
    notes: 'Início da alvenaria no 2º pavimento. Entrega de tijolos confirmada.', 
    activities: ['Levantamento de parede eixo X', 'Cura do concreto laje 1', 'Limpeza do canteiro'],
    workforceCount: 12,
    wasteReported: 'Quebra de 15 blocos cerâmicos no transporte'
  },
  { 
    id: 'd2', 
    date: '2024-02-19', 
    projectId: '1', 
    weather: 'Rainy', 
    notes: 'Chuva intensa pela manhã paralisou atividades externas.', 
    activities: ['Organização do almoxarifado', 'Instalações elétricas internas'],
    workforceCount: 10
  }
];

export const MOCK_WORKERS: Worker[] = [
  { id: 'w1', name: 'Carlos Santos', role: 'Mestre de Obras', rate: 250, type: 'Employee', status: 'Active' },
  { id: 'w2', name: 'João Silva', role: 'Pedreiro', rate: 180, type: 'Contractor', status: 'Active' },
  { id: 'w3', name: 'Pedro Souza', role: 'Servente', rate: 100, type: 'Contractor', status: 'Active' },
];

export const MOCK_EQUIPMENT: Equipment[] = [
  { id: 'e1', name: 'Betoneira 400L', status: 'InUse', costPerDay: 50, assignedTo: '1' },
  { id: 'e2', name: 'Martelete Rompedor', status: 'Available', costPerDay: 80 },
  { id: 'e3', name: 'Andaime Tubular (Kit)', status: 'InUse', costPerDay: 25, assignedTo: '1' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'sup1', name: 'Casa do Construtor', category: 'Material Básico', rating: 4.5 },
  { id: 'sup2', name: 'LocaTudo Equipamentos', category: 'Locação', rating: 4.0 },
  { id: 'sup3', name: 'Olaria Regional', category: 'Alvenaria', rating: 3.5 },
];

export const MOCK_FINANCIAL_CURVE: MonthlyStats[] = [
  { month: 'Set', planned: 50000, actual: 48000 },
  { month: 'Out', planned: 120000, actual: 115000 },
  { month: 'Nov', planned: 200000, actual: 210000 },
  { month: 'Dez', planned: 280000, actual: 295000 },
  { month: 'Jan', planned: 350000, actual: 340000 },
  { month: 'Fev', planned: 450000, actual: 480000 },
];