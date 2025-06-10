
import React from 'react';
import { TrendingUp, Target, Brain, AlertTriangle, Activity } from 'lucide-react';
import { usePredictions } from '@/hooks/usePredictions';

export const PredictionPanel = () => {
  const { data: predictions, isLoading, error } = usePredictions();

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center space-x-2 mb-6">
          <Brain className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">AI Predictions</h2>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-700/50 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-slate-600 rounded mb-3"></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="h-8 bg-slate-600 rounded"></div>
                <div className="h-8 bg-slate-600 rounded"></div>
              </div>
              <div className="h-2 bg-slate-600 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-600 rounded w-3/4"></div>
                <div className="h-3 bg-slate-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">AI Predictions</h2>
        </div>
        <div className="text-red-400 text-sm">
          Error loading predictions. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">AI Predictions</h2>
        <div className="flex items-center space-x-1 ml-auto">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span className="text-xs text-emerald-400">Live</span>
        </div>
      </div>

      <div className="space-y-6">
        {predictions?.map((prediction, index) => (
          <div key={index} className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-white">{prediction.symbol}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                prediction.trend === 'bullish' 
                  ? 'bg-emerald-400/10 text-emerald-400' 
                  : prediction.trend === 'bearish'
                  ? 'bg-red-400/10 text-red-400'
                  : 'bg-yellow-400/10 text-yellow-400'
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
                <p className="text-xs text-slate-400 mb-1">Predicted (7d)</p>
                <p className={`font-medium ${
                  prediction.predictedPrice > prediction.currentPrice 
                    ? 'text-emerald-400' 
                    : 'text-red-400'
                }`}>
                  ₹{prediction.predictedPrice}
                </p>
              </div>
            </div>

            {/* Technical Indicators */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="text-slate-400">
                RSI: <span className={`${
                  prediction.technicals.rsi > 70 ? 'text-red-400' : 
                  prediction.technicals.rsi < 30 ? 'text-emerald-400' : 'text-slate-300'
                }`}>{prediction.technicals.rsi.toFixed(1)}</span>
              </div>
              <div className="text-slate-400">
                SMA20: <span className="text-slate-300">₹{prediction.technicals.sma20.toFixed(2)}</span>
              </div>
            </div>

            {/* Confidence Meter */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">AI Confidence</span>
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
              <p className="text-xs text-slate-400 mb-2">Analysis Factors</p>
              <div className="space-y-1">
                {prediction.factors.slice(0, 3).map((factor, idx) => (
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
              <span className="text-xs text-slate-400">
                ML + Technical Analysis
              </span>
            </div>
          </div>
        ))}

        {(!predictions || predictions.length === 0) && (
          <div className="text-center py-8 text-slate-400">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No predictions available</p>
            <p className="text-xs">Insufficient historical data</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-yellow-400 font-medium">AI-Powered Analysis</p>
            <p className="text-xs text-slate-300 mt-1">
              Predictions use technical analysis and machine learning. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
