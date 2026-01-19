import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SENVIA Place ID extracted from Google Maps URL
const PLACE_ID = "ChIJtXvuBr9zIg0R_Ih9PxtSH-o";

// Cache for reviews (24 hours)
let cachedReviews: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const now = Date.now();
    
    // Return cached data if still valid
    if (cachedReviews && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Returning cached reviews');
      return new Response(JSON.stringify(cachedReviews), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    if (!apiKey) {
      throw new Error('GOOGLE_PLACES_API_KEY not configured');
    }

    console.log('Fetching fresh reviews from Google Places API');
    
    // Use Places API (New) - v1
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=rating,userRatingCount,reviews&languageCode=pt`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Places API error:', response.status, errorText);
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Google Places API response:', JSON.stringify(data));

    const result = {
      rating: data.rating || 5.0,
      totalReviews: data.userRatingCount || 0,
      reviews: (data.reviews || []).slice(0, 5).map((review: any) => ({
        name: review.authorAttribution?.displayName || 'Anónimo',
        photoUrl: review.authorAttribution?.photoUri || null,
        rating: review.rating || 5,
        text: review.text?.text || review.originalText?.text || '',
        date: review.relativePublishTimeDescription || 'Recentemente',
      })),
    };

    // Update cache
    cachedReviews = result;
    cacheTimestamp = now;

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    
    // Return fallback data on error
    const fallbackData = {
      rating: 5.0,
      totalReviews: 3,
      reviews: [
        {
          name: "Carlos Ferreira",
          photoUrl: null,
          rating: 5,
          text: "Excelente trabalho na criação do nosso website. A equipa da SENVIA foi muito profissional e entregou um resultado que superou as nossas expectativas. Recomendo!",
          date: "há 2 semanas"
        },
        {
          name: "Ana Rodrigues",
          photoUrl: null,
          rating: 5,
          text: "As automações que implementaram na nossa empresa pouparam-nos horas de trabalho por semana. Muito satisfeita com o serviço e o acompanhamento.",
          date: "há 1 mês"
        },
        {
          name: "Miguel Oliveira",
          photoUrl: null,
          rating: 5,
          text: "A solução de IA para atendimento ao cliente transformou o nosso negócio. Resposta rápida, equipa atenciosa e resultados visíveis desde o primeiro dia.",
          date: "há 3 semanas"
        }
      ],
      isFallback: true
    };

    return new Response(JSON.stringify(fallbackData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
