
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { useCurrentPrices } from '@/hooks/useStockData';

export const StockDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('gainers');
  const { data: currentPrices, isLoading } = useCurrentPrices();

  const gainersData = currentPrices?.filter(stock => (stock.percentage_change || 0) > 0)
    .sort((a, b) => (b.percentage_change || 0) - (a.percentage_change || 0))
    .slice(0, 5) || [];

  const losersData = currentPrices?.filter(stock => (stock.percentage_change || 0) < 0)
    .sort((a, b) => (a.percentage_change || 0) - (b.percentage_change || 0))
    .slice(0, 5) || [];

  const volumeData = currentPrices?.sort((a, b) => (b.volume || 0) - (a.volume || 0))
    .slice(0, 5) || [];

  // Group stocks by sector for chart
  const sectorData = currentPrices?.reduce((acc, stock) => {
    const sector = stock.companies?.sector || 'Other';
    if (!acc[sector]) {
      acc[sector] = { name: sector, gainers: 0, losers: 0 };
    }
    if ((stock.percentage_change || 0) > 0) {
      acc[sector].gainers++;
    } else if ((stock.percentage_change || 0) < 0) {
      acc[sector].losers++;
    }
    return acc;
  }, {} as Record<string, { name: string; gainers: number; losers: number }>);

  const chartData = Object.values(sectorData || {});

  const tabs = [
    { id: 'gainers', label: 'Top Gainers', icon: ArrowUpRight },
    { id: 'losers', label: 'Top Losers', icon: ArrowDownRight },
    { id: 'volume', label: 'Most Active', icon: Activity },
  ];

  const getCurrentData = () => {
    switch (selectedTab) {
      case 'gainers': return gainersData;
      case 'losers': return losersData;
      case 'volume': return volumeData;
      default: return gainersData;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded mb-6 w-48"></div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-700/30 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-slate-700/30 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
        <h2 className="text-lg font-semibold text-white">Market Dashboard</h2>
        
        {/* Tab Navigation */}
        <div className="flex items-center space-x-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Stock List */}
        <div className="xl:col-span-2">
          <div className="space-y-3">
            {getCurrentData().map((stock, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-slate-600 rounded-lg">
                    <span className="text-xs font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{stock.companies?.symbol}</p>
                    {selectedTab === 'volume' && (
                      <p className="text-xs text-slate-400">Vol: {((stock.volume || 0) / 1000000).toFixed(1)}M</p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-white">₹{stock.current_price?.toFixed(2)}</p>
                  <div className="flex items-center space-x-1">
                    {(stock.percentage_change || 0) >= 0 ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      (stock.percentage_change || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {(stock.percentage_change || 0) >= 0 ? '+' : ''}{stock.percentage_change?.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {getCurrentData().length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No data available for {selectedTab}
              </div>
            )}
          </div>
        </div>

        {/* Sector Performance Chart */}
        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-4">Sector Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" fontSize={10} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#9ca3af" 
                  fontSize={10}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Bar dataKey="gainers" fill="#10b981" radius={[2, 2, 2, 2]} />
                <Bar dataKey="losers" fill="#ef4444" radius={[2, 2, 2, 2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span className="text-xs text-slate-300">Gainers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-xs text-slate-300">Losers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
