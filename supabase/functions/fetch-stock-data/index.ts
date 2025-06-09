
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all companies from database
    const { data: companies, error: companiesError } = await supabaseClient
      .from('companies')
      .select('id, symbol')
      .eq('is_active', true)

    if (companiesError) {
      throw companiesError
    }

    // For now, we'll generate simulated real-time data
    // In production, you would integrate with real APIs like Alpha Vantage, Yahoo Finance, etc.
    const updates = companies.map(company => {
      const basePrice = Math.random() * 2000 + 500 // Random base price between 500-2500
      const change = (Math.random() - 0.5) * 100 // Random change between -50 to +50
      const percentageChange = (change / basePrice) * 100
      const volume = Math.floor(Math.random() * 50000000) // Random volume

      return {
        company_id: company.id,
        current_price: parseFloat(basePrice.toFixed(2)),
        price_change: parseFloat(change.toFixed(2)),
        percentage_change: parseFloat(percentageChange.toFixed(2)),
        volume: volume,
        last_updated: new Date().toISOString()
      }
    })

    // Update current prices in database
    for (const update of updates) {
      await supabaseClient
        .from('current_prices')
        .upsert(update, {
          onConflict: 'company_id'
        })
    }

    // Update market indices with simulated data
    const indices = [
      { name: 'NIFTY 50', base: 18456.78 },
      { name: 'SENSEX', base: 61872.99 },
      { name: 'NIFTY BANK', base: 43245.12 },
      { name: 'NIFTY IT', base: 28934.56 }
    ]

    for (const index of indices) {
      const change = (Math.random() - 0.5) * 500 // Random change
      const newValue = index.base + change
      const changePercentage = (change / index.base) * 100

      await supabaseClient
        .from('market_indices')
        .update({
          current_value: parseFloat(newValue.toFixed(2)),
          change_value: parseFloat(change.toFixed(2)),
          change_percentage: parseFloat(changePercentage.toFixed(2)),
          last_updated: new Date().toISOString()
        })
        .eq('name', index.name)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Stock data updated successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
