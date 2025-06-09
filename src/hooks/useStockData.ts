
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMarketIndices = () => {
  return useQuery({
    queryKey: ['market-indices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_indices')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .order('symbol');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCurrentPrices = () => {
  return useQuery({
    queryKey: ['current-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('current_prices')
        .select(`
          *,
          companies (
            symbol,
            name,
            sector
          )
        `)
        .order('percentage_change', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // Refetch every 5 seconds for live prices
  });
};

export const useStockPrice = (symbol: string) => {
  return useQuery({
    queryKey: ['stock-price', symbol],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('current_prices')
        .select(`
          *,
          companies (
            symbol,
            name,
            sector,
            industry
          )
        `)
        .eq('companies.symbol', symbol)
        .single();
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });
};

export const useStockHistory = (symbol: string, days: number = 30) => {
  return useQuery({
    queryKey: ['stock-history', symbol, days],
    queryFn: async () => {
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('symbol', symbol)
        .single();

      if (!company) throw new Error('Company not found');

      const { data, error } = await supabase
        .from('stock_prices')
        .select('*')
        .eq('company_id', company.id)
        .order('date', { ascending: false })
        .limit(days);
      
      if (error) throw error;
      return data?.reverse() || [];
    },
  });
};
