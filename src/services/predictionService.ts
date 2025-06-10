
interface TechnicalIndicators {
  sma20: number;
  sma50: number;
  rsi: number;
  macd: number;
  bollinger: {
    upper: number;
    lower: number;
    middle: number;
  };
}

interface PredictionData {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  timeframe: string;
  factors: string[];
  technicals: TechnicalIndicators;
}

export class PredictionService {
  // Calculate Simple Moving Average
  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  // Calculate RSI (Relative Strength Index)
  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;
    
    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }
    
    const gains = changes.map(c => c > 0 ? c : 0);
    const losses = changes.map(c => c < 0 ? -c : 0);
    
    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  // Calculate MACD
  private calculateMACD(prices: number[]): number {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    return ema12 - ema26;
  }

  // Calculate Exponential Moving Average
  private calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    if (prices.length === 1) return prices[0];
    
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  // Calculate Bollinger Bands
  private calculateBollingerBands(prices: number[], period: number = 20): { upper: number; lower: number; middle: number } {
    const middle = this.calculateSMA(prices, period);
    const recentPrices = prices.slice(-period);
    
    const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - middle, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    
    return {
      upper: middle + (2 * stdDev),
      lower: middle - (2 * stdDev),
      middle
    };
  }

  // Generate prediction factors based on technical analysis
  private generateFactors(indicators: TechnicalIndicators, currentPrice: number): string[] {
    const factors: string[] = [];
    
    // RSI analysis
    if (indicators.rsi > 70) {
      factors.push('Overbought conditions (RSI > 70)');
    } else if (indicators.rsi < 30) {
      factors.push('Oversold conditions (RSI < 30)');
    }
    
    // Moving average analysis
    if (currentPrice > indicators.sma20 && currentPrice > indicators.sma50) {
      factors.push('Price above key moving averages');
    } else if (currentPrice < indicators.sma20 && currentPrice < indicators.sma50) {
      factors.push('Price below key moving averages');
    }
    
    // MACD analysis
    if (indicators.macd > 0) {
      factors.push('Positive momentum (MACD)');
    } else {
      factors.push('Negative momentum (MACD)');
    }
    
    // Bollinger Bands analysis
    if (currentPrice > indicators.bollinger.upper) {
      factors.push('Price near resistance (Upper Bollinger)');
    } else if (currentPrice < indicators.bollinger.lower) {
      factors.push('Price near support (Lower Bollinger)');
    }
    
    return factors.length > 0 ? factors : ['Technical analysis neutral'];
  }

  // Simple ML-like prediction using linear regression on price trends
  private predictPriceChange(prices: number[]): { prediction: number; confidence: number } {
    if (prices.length < 5) {
      return { prediction: 0, confidence: 30 };
    }
    
    // Calculate trend using linear regression
    const n = Math.min(prices.length, 30); // Use last 30 data points
    const recentPrices = prices.slice(-n);
    
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += recentPrices[i];
      sumXY += i * recentPrices[i];
      sumXX += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Predict next value
    const nextX = n;
    const predictedPrice = slope * nextX + intercept;
    const currentPrice = recentPrices[n - 1];
    
    // Calculate confidence based on trend consistency
    const priceChanges = [];
    for (let i = 1; i < recentPrices.length; i++) {
      priceChanges.push(recentPrices[i] - recentPrices[i - 1]);
    }
    
    const avgChange = priceChanges.reduce((a, b) => a + b, 0) / priceChanges.length;
    const variance = priceChanges.reduce((sum, change) => sum + Math.pow(change - avgChange, 2), 0) / priceChanges.length;
    const volatility = Math.sqrt(variance);
    
    // Higher confidence for lower volatility and clear trends
    const trendStrength = Math.abs(slope) / currentPrice;
    const confidence = Math.max(30, Math.min(85, 70 - (volatility / currentPrice * 1000) + (trendStrength * 100)));
    
    return { 
      prediction: (predictedPrice - currentPrice) / currentPrice, 
      confidence: Math.round(confidence) 
    };
  }

  // Main prediction function
  async generatePrediction(symbol: string, historicalPrices: number[], currentPrice: number): Promise<PredictionData> {
    // Calculate technical indicators
    const sma20 = this.calculateSMA(historicalPrices, 20);
    const sma50 = this.calculateSMA(historicalPrices, 50);
    const rsi = this.calculateRSI(historicalPrices);
    const macd = this.calculateMACD(historicalPrices);
    const bollinger = this.calculateBollingerBands(historicalPrices);
    
    const technicals: TechnicalIndicators = {
      sma20,
      sma50,
      rsi,
      macd,
      bollinger
    };
    
    // Generate ML prediction
    const { prediction, confidence } = this.predictPriceChange(historicalPrices);
    
    // Calculate predicted price
    const predictedPrice = currentPrice * (1 + prediction);
    
    // Determine trend
    let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (prediction > 0.02) trend = 'bullish';
    else if (prediction < -0.02) trend = 'bearish';
    
    // Generate factors
    const factors = this.generateFactors(technicals, currentPrice);
    
    return {
      symbol,
      currentPrice,
      predictedPrice: parseFloat(predictedPrice.toFixed(2)),
      confidence,
      trend,
      timeframe: '7 days',
      factors,
      technicals
    };
  }
}

export const predictionService = new PredictionService();
