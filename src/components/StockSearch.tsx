
import React, { useState } from 'react';
import { Search, Star, TrendingUp, TrendingDown } from 'lucide-react';

export const StockSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const popularStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,456.78', change: '+23.45', percentage: '+0.96%', trend: 'up' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: '3,234.56', change: '-12.34', percentage: '-0.38%', trend: 'down' },
    { symbol: 'INFY', name: 'Infosys Limited', price: '1,567.89', change: '+45.67', percentage: '+3.00%', trend: 'up' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', price: '1,678.90', change: '+8.90', percentage: '+0.53%', trend: 'up' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', price: '876.54', change: '-5.43', percentage: '-0.62%', trend: 'down' },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-lg font-semibold text-white mb-4">Stock Search</h2>
      
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search NSE stocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Popular Stocks */}
      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3">Popular Stocks</h3>
        <div className="space-y-2">
          {popularStocks.map((stock, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors group">
              <div className="flex items-center space-x-3">
                <button className="text-slate-400 hover:text-yellow-400 transition-colors">
                  <Star className="w-4 h-4" />
                </button>
                <div>
                  <p className="font-medium text-white text-sm">{stock.symbol}</p>
                  <p className="text-xs text-slate-400 truncate max-w-32">{stock.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-white text-sm">₹{stock.price}</p>
                <div className="flex items-center space-x-1">
                  {stock.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs ${stock.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stock.percentage}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
