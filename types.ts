export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'active' | 'completed' | 'paused';
  progress: number; // 0-100
  budgetTotal: number;
  budgetSpent: number;
  startDate: string;
  endDate: string;
  thumbnail: string;
  address: string;
  area: number; // m²
  bdi: number; // Percentage
  stages: Stage[];
}

export interface Stage {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
}

export interface Expense {
  id: string;
  description: string;
  category: 'Labor' | 'Material' | 'Equipment' | 'Permits' | 'Other' | 'Indirect';
  amount: number;
  date: string;
  projectId: string;
  status: 'paid' | 'pending';
  supplierId?: string;
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  quantityTotal: number;
  quantityUsed: number;
  costPerUnit: number;
  category: string;
  projectId: string;
  minThreshold: number;
  supplierId?: string;
  waste: number; // Quantity wasted
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  rating: number; // 1-5
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  rate: number; // Cost per hour/day
  type: 'Employee' | 'Contractor';
  status: 'Active' | 'OnLeave';
}

export interface Equipment {
  id: string;
  name: string;
  status: 'InUse' | 'Available' | 'Maintenance';
  costPerDay: number;
  assignedTo?: string; // Project ID
}

export interface DailyLog {
  id: string;
  date: string;
  projectId: string;
  weather: 'Sunny' | 'Rainy' | 'Cloudy';
  notes: string;
  activities: string[];
  workforceCount: number;
  wasteReported?: string;
}

export interface MonthlyStats {
  month: string;
  planned: number;
  actual: number;
}

export interface AIAnalysisResult {
  summary: string;
  risks: string[];
  recommendations: string[];
  savingsPotential: string;
}