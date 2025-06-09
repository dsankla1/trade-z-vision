
import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useMarketIndices } from '@/hooks/useStockData';

export const MarketOverview = () => {
  const { data: marketData, isLoading, error } = useMarketIndices();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-4 border border-slate-700 animate-pulse">
            <div className="h-4 bg-slate-700 rounded mb-2"></div>
            <div className="h-6 bg-slate-700 rounded mb-2"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-600 rounded-xl p-4">
        <p className="text-red-400">Error loading market data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {marketData?.map((market, index) => (
        <div key={index} className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-300 text-sm font-medium">{market.name}</h3>
            {market.change_percentage >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold text-white">{market.current_value?.toLocaleString()}</p>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${market.change_percentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {market.change_percentage >= 0 ? '+' : ''}{market.change_value}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                market.change_percentage >= 0 
                  ? 'bg-emerald-400/10 text-emerald-400' 
                  : 'bg-red-400/10 text-red-400'
              }`}>
                {market.change_percentage >= 0 ? '+' : ''}{market.change_percentage}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
