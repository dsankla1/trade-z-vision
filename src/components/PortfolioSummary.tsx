
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const PortfolioSummary = () => {
  const portfolioData = [
    { name: 'Technology', value: 35, color: '#3b82f6' },
    { name: 'Banking', value: 25, color: '#10b981' },
    { name: 'Energy', value: 20, color: '#f59e0b' },
    { name: 'Healthcare', value: 12, color: '#ef4444' },
    { name: 'Others', value: 8, color: '#8b5cf6' },
  ];

  const holdings = [
    { symbol: 'RELIANCE', shares: 50, avgPrice: 2420.00, currentPrice: 2467.50, value: 123375 },
    { symbol: 'TCS', shares: 25, avgPrice: 3200.00, currentPrice: 3234.56, value: 80864 },
    { symbol: 'HDFCBANK', shares: 40, avgPrice: 1650.00, currentPrice: 1678.90, value: 67156 },
  ];

  const totalValue = holdings.reduce((sum, stock) => sum + stock.value, 0);
  const totalInvestment = holdings.reduce((sum, stock) => sum + (stock.shares * stock.avgPrice), 0);
  const totalGain = totalValue - totalInvestment;
  const gainPercentage = ((totalGain / totalInvestment) * 100).toFixed(2);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center space-x-2 mb-6">
        <Wallet className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">Portfolio Summary</h2>
      </div>

      {/* Portfolio Value */}
      <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 mb-1">Total Value</p>
            <p className="text-xl font-bold text-white">₹{totalValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Total Gain/Loss</p>
            <div className="flex items-center space-x-1">
              {totalGain >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`font-medium ${totalGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ₹{Math.abs(totalGain).toLocaleString()} ({gainPercentage}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Distribution */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Sector Distribution</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
                formatter={(value) => [`${value}%`, 'Allocation']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {portfolioData.map((sector, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: sector.color }}
              ></div>
              <span className="text-xs text-slate-300">{sector.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Holdings */}
      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3">Top Holdings</h3>
        <div className="space-y-3">
          {holdings.map((stock, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div>
                <p className="font-medium text-white text-sm">{stock.symbol}</p>
                <p className="text-xs text-slate-400">{stock.shares} shares</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-white text-sm">₹{stock.value.toLocaleString()}</p>
                <p className={`text-xs ${
                  stock.currentPrice > stock.avgPrice ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {((stock.currentPrice - stock.avgPrice) / stock.avgPrice * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
