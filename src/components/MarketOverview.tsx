
import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export const MarketOverview = () => {
  const marketData = [
    { name: 'NIFTY 50', value: '18,456.78', change: '+127.34', percentage: '+0.69%', trend: 'up' },
    { name: 'SENSEX', value: '61,872.99', change: '+425.67', percentage: '+0.69%', trend: 'up' },
    { name: 'NIFTY BANK', value: '43,245.12', change: '-89.23', percentage: '-0.21%', trend: 'down' },
    { name: 'NIFTY IT', value: '28,934.56', change: '+234.78', percentage: '+0.82%', trend: 'up' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {marketData.map((market, index) => (
        <div key={index} className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-300 text-sm font-medium">{market.name}</h3>
            {market.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold text-white">{market.value}</p>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${market.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                {market.change}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                market.trend === 'up' 
                  ? 'bg-emerald-400/10 text-emerald-400' 
                  : 'bg-red-400/10 text-red-400'
              }`}>
                {market.percentage}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
