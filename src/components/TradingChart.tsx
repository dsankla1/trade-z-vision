
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Calendar, BarChart3, TrendingUp, Volume2 } from 'lucide-react';

export const TradingChart = () => {
  const [selectedStock, setSelectedStock] = useState('RELIANCE');
  const [timeframe, setTimeframe] = useState('1D');

  // Sample data for the chart
  const chartData = [
    { time: '09:15', price: 2445.50, volume: 12500 },
    { time: '09:30', price: 2448.20, volume: 15300 },
    { time: '09:45', price: 2452.10, volume: 18200 },
    { time: '10:00', price: 2449.80, volume: 14700 },
    { time: '10:15', price: 2454.30, volume: 19800 },
    { time: '10:30', price: 2458.90, volume: 22100 },
    { time: '10:45', price: 2456.70, volume: 17600 },
    { time: '11:00', price: 2461.40, volume: 25300 },
    { time: '11:15', price: 2459.20, volume: 18900 },
    { time: '11:30', price: 2463.80, volume: 28400 },
    { time: '11:45', price: 2467.50, volume: 21200 },
    { time: '12:00', price: 2465.30, volume: 19700 },
  ];

  const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y'];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-white">{selectedStock}</h2>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-2xl font-bold text-emerald-400">₹2,467.50</span>
            <span className="text-emerald-400 font-medium">+21.72 (+0.89%)</span>
          </div>
        </div>
        
        {/* Timeframe Buttons */}
        <div className="flex items-center space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
              formatter={(value, name) => [
                `₹${value}`, 
                name === 'price' ? 'Price' : 'Volume'
              ]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between border-t border-slate-700 pt-4">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm">Indicators</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm">Volume</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium">
            Buy
          </button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium">
            Sell
          </button>
        </div>
      </div>
    </div>
  );
};
