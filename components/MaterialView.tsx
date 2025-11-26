import React from 'react';
import { MOCK_MATERIALS } from '../constants';
import { AlertCircle, PackageCheck, PackageMinus, ShoppingCart } from 'lucide-react';

export const MaterialView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Materiais</h1>
          <p className="text-slate-500">Controle de estoque e consumo</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm">
          <ShoppingCart size={18} />
          <span>Solicitar Compra</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_MATERIALS.map((material) => {
          const percentageUsed = (material.quantityUsed / material.quantityTotal) * 100;
          const remaining = material.quantityTotal - material.quantityUsed;
          const isLowStock = remaining <= material.minThreshold;

          return (
            <div key={material.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
              {isLowStock && (
                <div className="absolute top-0 right-0 bg-rose-500 w-16 h-16 transform translate-x-8 -translate-y-8 rotate-45 flex items-end justify-center pb-1">
                  <AlertCircle className="text-white transform -rotate-45 mb-1 mr-1" size={16} />
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{material.name}</h3>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{material.category}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-slate-600">
                  <PackageCheck size={24} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-3xl font-bold text-slate-900">{remaining}</span>
                    <span className="text-sm text-slate-500 ml-1">{material.unit}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Total Comprado</span>
                    <span className="font-medium text-slate-700">{material.quantityTotal} {material.unit}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-1000 ${
                      percentageUsed > 90 ? 'bg-rose-500' : 'bg-blue-600'
                    }`} 
                    style={{ width: `${percentageUsed}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                   <div className="flex items-center">
                     <PackageMinus size={14} className="mr-1" />
                     Consumido: {material.quantityUsed}
                   </div>
                   <div>
                     Custo Médio: R${material.costPerUnit.toFixed(2)}
                   </div>
                </div>
              </div>

              {isLowStock && (
                <div className="mt-4 bg-rose-50 border border-rose-100 p-3 rounded-lg flex items-center gap-2 text-rose-700 text-sm">
                  <AlertCircle size={16} />
                  <span>Estoque abaixo do mínimo ({material.minThreshold})</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};