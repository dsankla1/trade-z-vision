
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';

export const StockDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('gainers');

  const gainersData = [
    { symbol: 'ADANIPORTS', price: 789.45, change: '+58.23', percentage: '+7.96%', volume: '2.5M' },
    { symbol: 'TATASTEEL', price: 134.67, change: '+9.45', percentage: '+7.55%', volume: '45.2M' },
    { symbol: 'JSWSTEEL', price: 678.90, change: '+41.23', percentage: '+6.47%', volume: '8.7M' },
    { symbol: 'COALINDIA', price: 234.56, change: '+13.78', percentage: '+6.24%', volume: '15.3M' },
    { symbol: 'NTPC', price: 187.32, change: '+10.45', percentage: '+5.91%', volume: '22.1M' },
  ];

  const losersData = [
    { symbol: 'BAJFINANCE', price: 6789.45, change: '-423.67', percentage: '-5.88%', volume: '1.2M' },
    { symbol: 'HCLTECH', price: 1123.45, change: '-67.89', percentage: '-5.70%', volume: '3.4M' },
    { symbol: 'TECHM', price: 1056.78, change: '-58.23', percentage: '-5.22%', volume: '2.8M' },
    { symbol: 'WIPRO', price: 412.34, change: '-21.45', percentage: '-4.94%', volume: '7.6M' },
    { symbol: 'LT', price: 2234.56, change: '-104.23', percentage: '-4.46%', volume: '1.9M' },
  ];

  const volumeData = [
    { symbol: 'TATASTEEL', volume: 45.2, price: 134.67, change: '+7.55%' },
    { symbol: 'NTPC', volume: 22.1, price: 187.32, change: '+5.91%' },
    { symbol: 'COALINDIA', volume: 15.3, price: 234.56, change: '+6.24%' },
    { symbol: 'ADANIPORTS', volume: 12.5, price: 789.45, change: '+7.96%' },
    { symbol: 'JSWSTEEL', volume: 8.7, price: 678.90, change: '+6.47%' },
  ];

  const chartData = [
    { name: 'Banking', gainers: 12, losers: 8 },
    { name: 'IT', gainers: 6, losers: 14 },
    { name: 'Energy', gainers: 18, losers: 4 },
    { name: 'Auto', gainers: 9, losers: 11 },
    { name: 'Pharma', gainers: 15, losers: 7 },
    { name: 'FMCG', gainers: 8, losers: 6 },
  ];

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
                    <p className="font-medium text-white">{stock.symbol}</p>
                    {selectedTab === 'volume' && (
                      <p className="text-xs text-slate-400">Vol: {stock.volume}M</p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-white">₹{stock.price}</p>
                  <div className="flex items-center space-x-1">
                    {selectedTab !== 'losers' ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      selectedTab !== 'losers' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {selectedTab === 'volume' ? stock.change : 
                       selectedTab === 'gainers' ? stock.percentage : stock.percentage}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
