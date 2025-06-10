
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useStockUpdater = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Function to fetch updated stock data
    const fetchStockData = async () => {
      try {
        console.log('Triggering stock data update...');
        const { error } = await supabase.functions.invoke('fetch-stock-data');
        if (error) {
          console.error('Error fetching stock data:', error);
        } else {
          console.log('Stock data updated successfully');
          // Invalidate and refetch all stock-related queries
          queryClient.invalidateQueries({ queryKey: ['current-prices'] });
          queryClient.invalidateQueries({ queryKey: ['market-indices'] });
        }
      } catch (error) {
        console.error('Error calling fetch-stock-data function:', error);
      }
    };

    // Fetch data immediately
    fetchStockData();

    // Set up interval to fetch data every 5 minutes (to respect API rate limits)
    // Alpha Vantage free tier: 25 requests/day, 5 requests/minute
    const interval = setInterval(fetchStockData, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [queryClient]);
};
