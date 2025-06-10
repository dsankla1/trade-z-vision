
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { predictionService } from '@/services/predictionService';

export const usePredictions = () => {
  return useQuery({
    queryKey: ['ai-predictions'],
    queryFn: async () => {
      console.log('Generating AI predictions...');
      
      // Get top companies with current prices
      const { data: currentPrices, error: pricesError } = await supabase
        .from('current_prices')
        .select(`
          *,
          companies (
            symbol,
            name,
            sector
          )
        `)
        .order('volume', { ascending: false })
        .limit(5);
      
      if (pricesError) throw pricesError;
      
      const predictions = [];
      
      for (const stock of currentPrices || []) {
        if (!stock.companies?.symbol) continue;
        
        try {
          // Get historical data for this company
          const { data: company } = await supabase
            .from('companies')
            .select('id')
            .eq('symbol', stock.companies.symbol)
            .single();
          
          if (!company) continue;
          
          const { data: historicalData } = await supabase
            .from('stock_prices')
            .select('close_price')
            .eq('company_id', company.id)
            .order('date', { ascending: true })
            .limit(50);
          
          // Extract prices for analysis
          const historicalPrices = historicalData?.map(d => d.close_price).filter(p => p !== null) as number[] || [];
          
          // Add current price to historical data
          if (stock.current_price) {
            historicalPrices.push(stock.current_price);
          }
          
          if (historicalPrices.length < 5) {
            console.log(`Insufficient data for ${stock.companies.symbol}, skipping prediction`);
            continue;
          }
          
          // Generate prediction using our service
          const prediction = await predictionService.generatePrediction(
            stock.companies.symbol,
            historicalPrices,
            stock.current_price || 0
          );
          
          predictions.push(prediction);
          
        } catch (error) {
          console.error(`Error generating prediction for ${stock.companies?.symbol}:`, error);
        }
      }
      
      console.log(`Generated ${predictions.length} AI predictions`);
      return predictions;
    },
    refetchInterval: 5 * 60 * 1000, // Refresh predictions every 5 minutes
    staleTime: 3 * 60 * 1000, // Consider stale after 3 minutes
  });
};
