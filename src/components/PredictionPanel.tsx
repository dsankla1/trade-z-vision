
import React from 'react';
import { TrendingUp, Target, Brain, AlertTriangle } from 'lucide-react';

export const PredictionPanel = () => {
  const predictions = [
    {
      symbol: 'RELIANCE',
      currentPrice: 2467.50,
      predictedPrice: 2520.30,
      confidence: 78,
      timeframe: '7 days',
      trend: 'bullish',
      factors: ['Strong Q3 results', 'Oil price stability', 'Sector rotation']
    },
    {
      symbol: 'TCS',
      currentPrice: 3234.56,
      predictedPrice: 3180.20,
      confidence: 65,
      timeframe: '7 days',
      trend: 'bearish',
      factors: ['IT sector headwinds', 'Dollar volatility', 'Client spending cuts']
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">AI Predictions</h2>
      </div>

      <div className="space-y-6">
        {predictions.map((prediction, index) => (
          <div key={index} className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-white">{prediction.symbol}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                prediction.trend === 'bullish' 
                  ? 'bg-emerald-400/10 text-emerald-400' 
                  : 'bg-red-400/10 text-red-400'
              }`}>
                {prediction.trend.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Current</p>
                <p className="font-medium text-white">₹{prediction.currentPrice}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Predicted</p>
                <p className={`font-medium ${
                  prediction.predictedPrice > prediction.currentPrice 
                    ? 'text-emerald-400' 
                    : 'text-red-400'
                }`}>
                  ₹{prediction.predictedPrice}
                </p>
              </div>
            </div>

            {/* Confidence Meter */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Confidence</span>
                <span className="text-xs text-slate-300">{prediction.confidence}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    prediction.confidence > 70 ? 'bg-emerald-500' : 
                    prediction.confidence > 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
            </div>

            {/* Key Factors */}
            <div>
              <p className="text-xs text-slate-400 mb-2">Key Factors</p>
              <div className="space-y-1">
                {prediction.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    <span className="text-xs text-slate-300">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-600">
              <div className="flex items-center space-x-1">
                <Target className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-slate-400">{prediction.timeframe}</span>
              </div>
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-yellow-400 font-medium">Disclaimer</p>
            <p className="text-xs text-slate-300 mt-1">
              Predictions are based on AI analysis and should not be considered as financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
