
-- Create table for storing stock companies
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sector TEXT,
  industry TEXT,
  market_cap BIGINT,
  exchange TEXT DEFAULT 'NSE',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing historical stock prices
CREATE TABLE public.stock_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  date DATE NOT NULL,
  open_price DECIMAL(10,2),
  high_price DECIMAL(10,2),
  low_price DECIMAL(10,2),
  close_price DECIMAL(10,2),
  volume BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, date)
);

-- Create table for real-time stock data
CREATE TABLE public.current_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) NOT NULL UNIQUE,
  current_price DECIMAL(10,2),
  price_change DECIMAL(10,2),
  percentage_change DECIMAL(5,2),
  volume BIGINT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for market indices
CREATE TABLE public.market_indices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  current_value DECIMAL(10,2),
  change_value DECIMAL(10,2),
  change_percentage DECIMAL(5,2),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user watchlists
CREATE TABLE public.user_watchlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Create table for user portfolios
CREATE TABLE public.user_portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  shares DECIMAL(10,2) NOT NULL,
  avg_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Insert sample NSE companies
INSERT INTO public.companies (symbol, name, sector, industry) VALUES
('RELIANCE', 'Reliance Industries Limited', 'Energy', 'Oil & Gas'),
('TCS', 'Tata Consultancy Services Limited', 'Information Technology', 'IT Services'),
('INFY', 'Infosys Limited', 'Information Technology', 'IT Services'),
('HDFCBANK', 'HDFC Bank Limited', 'Financial Services', 'Banking'),
('ICICIBANK', 'ICICI Bank Limited', 'Financial Services', 'Banking'),
('HINDUNILVR', 'Hindustan Unilever Limited', 'FMCG', 'Consumer Goods'),
('ITC', 'ITC Limited', 'FMCG', 'Tobacco & Consumer Goods'),
('SBIN', 'State Bank of India', 'Financial Services', 'Banking'),
('BHARTIARTL', 'Bharti Airtel Limited', 'Telecommunication', 'Telecom Services'),
('KOTAKBANK', 'Kotak Mahindra Bank Limited', 'Financial Services', 'Banking');

-- Insert market indices
INSERT INTO public.market_indices (name, current_value, change_value, change_percentage) VALUES
('NIFTY 50', 18456.78, 127.34, 0.69),
('SENSEX', 61872.99, 425.67, 0.69),
('NIFTY BANK', 43245.12, -89.23, -0.21),
('NIFTY IT', 28934.56, 234.78, 0.82);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.current_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_indices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_portfolios ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to market data
CREATE POLICY "Public read access for companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Public read access for stock prices" ON public.stock_prices FOR SELECT USING (true);
CREATE POLICY "Public read access for current prices" ON public.current_prices FOR SELECT USING (true);
CREATE POLICY "Public read access for market indices" ON public.market_indices FOR SELECT USING (true);

-- Create policies for user-specific data
CREATE POLICY "Users can manage their watchlists" ON public.user_watchlists 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their portfolios" ON public.user_portfolios 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_stock_prices_company_date ON public.stock_prices(company_id, date DESC);
CREATE INDEX idx_current_prices_company ON public.current_prices(company_id);
CREATE INDEX idx_user_watchlists_user ON public.user_watchlists(user_id);
CREATE INDEX idx_user_portfolios_user ON public.user_portfolios(user_id);
