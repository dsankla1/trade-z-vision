
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useStockUpdater = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Function to fetch updated stock data
    const fetchStockData = async () => {
      try {
        const { error } = await supabase.functions.invoke('fetch-stock-data');
        if (error) {
          console.error('Error fetching stock data:', error);
        } else {
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

    // Set up interval to fetch data every 30 seconds
    const interval = setInterval(fetchStockData, 30000);

    return () => clearInterval(interval);
  }, [queryClient]);
};
