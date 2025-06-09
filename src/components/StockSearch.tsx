
import React, { useState } from 'react';
import { Search, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { useCurrentPrices } from '@/hooks/useStockData';

export const StockSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: currentPrices, isLoading } = useCurrentPrices();

  const filteredStocks = currentPrices?.filter(stock => 
    stock.companies?.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.companies?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5) || [];

  const popularStocks = currentPrices?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">Stock Search</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-slate-700 rounded-lg"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-700/50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

      {/* Stock List */}
      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3">
          {searchTerm ? 'Search Results' : 'Popular Stocks'}
        </h3>
        <div className="space-y-2">
          {(searchTerm ? filteredStocks : popularStocks).map((stock, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors group">
              <div className="flex items-center space-x-3">
                <button className="text-slate-400 hover:text-yellow-400 transition-colors">
                  <Star className="w-4 h-4" />
                </button>
                <div>
                  <p className="font-medium text-white text-sm">{stock.companies?.symbol}</p>
                  <p className="text-xs text-slate-400 truncate max-w-32">{stock.companies?.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-white text-sm">₹{stock.current_price?.toFixed(2)}</p>
                <div className="flex items-center space-x-1">
                  {(stock.percentage_change || 0) >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs ${(stock.percentage_change || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {(stock.percentage_change || 0) >= 0 ? '+' : ''}{stock.percentage_change?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
          {(searchTerm ? filteredStocks : popularStocks).length === 0 && (
            <div className="text-center py-4 text-slate-400">
              {searchTerm ? 'No stocks found' : 'Loading stocks...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
