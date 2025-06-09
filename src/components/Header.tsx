
import React from 'react';
import { TrendingUp, Bell, User, Settings } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-4 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Trade Z
            </h1>
            <p className="text-xs text-slate-400">NSE Stock Predictor</p>
          </div>
        </div>

        {/* Market Status */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">Market Open</span>
          </div>
          <div className="text-sm text-slate-300">
            NSE: <span className="text-emerald-400">18,456.78</span>
            <span className="text-emerald-400 ml-1">+127.34</span>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </button>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors">
            <User className="w-4 h-4" />
            <span className="text-sm">Portfolio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
