
import React from 'react';
import { Header } from '../components/Header';
import { StockDashboard } from '../components/StockDashboard';
import { MarketOverview } from '../components/MarketOverview';
import { TradingChart } from '../components/TradingChart';
import { StockSearch } from '../components/StockSearch';
import { PredictionPanel } from '../components/PredictionPanel';
import { PortfolioSummary } from '../components/PortfolioSummary';
import { useStockUpdater } from '../hooks/useStockUpdater';

const Index = () => {
  // Initialize automatic stock data updates
  useStockUpdater();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Market Overview */}
        <MarketOverview />
        
        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Search and Portfolio */}
          <div className="space-y-6">
            <StockSearch />
            <PortfolioSummary />
          </div>
          
          {/* Center Column - Main Chart */}
          <div className="lg:col-span-2">
            <TradingChart />
          </div>
        </div>
        
        {/* Bottom Section - Dashboard and Predictions */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <StockDashboard />
          </div>
          <div>
            <PredictionPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
