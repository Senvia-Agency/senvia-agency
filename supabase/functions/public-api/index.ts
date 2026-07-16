// public-api Edge Function
// Auditoria 2026-07-16 CRIT-2: adicionada validação de origem + removida exposition desnecessária
//
// Mudanças:
// 1. CORS restrito a origins Senvia (em vez de *)
// 2. Validação de Origin/Referer header para bloquear chamadas de outros sites
// 3. Endpoint '/all' agora requer X-API-Key header (shared secret com o front-end)
// 4. Seleção de colunas mais restritiva (não expõe created_at, updated_at, metadata)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGINS = [
  'https://www.senvia.pt',
  'https://senvia.pt',
  'https://app.senvia.pt',
  'http://localhost:4321',
  'http://localhost:4322',
  'http://localhost:8080',
]

const corsHeaders = (origin: string | null) => {
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key, origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Vary': 'Origin',
  }
}

function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get('Origin')
  const referer = req.headers.get('Referer')
  if (origin && ALLOWED_ORIGINS.includes(origin)) return true
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin
      if (ALLOWED_ORIGINS.includes(refererOrigin)) return true
    } catch {}
  }
  // Allow server-to-server calls without Origin (e.g. curl from same host)
  // Em produção, se isto for preocupante, remover a linha abaixo.
  return !origin && !referer
}

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin')

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders(origin) })
  }

  // Bloqueia chamadas de origins não autorizados
  if (!isAllowedOrigin(req)) {
    return new Response(
      JSON.stringify({ error: 'Origin não autorizada' }),
      { status: 403, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } }
    )
  }

  try {
    // SEMPRE usa service_role aqui porque a API precisa de ler dados de
    // produtos e blog_posts. As queries já filtram por status='active'/'published'.
    // Para endpoints futuros sensíveis, validar auth via Supabase JWT.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const path = url.pathname.replace('/public-api/', '')

    console.log('Public API request:', path, 'origin:', origin ?? '(none)')

    switch (path) {
      case 'products':
        return await getProducts(supabase, origin)

      case 'blog-posts':
        return await getBlogPosts(supabase, origin)

      case 'pages':
        return await getPageInfo(origin)

      case 'all':
        // Endpoint '/all' requer X-API-Key (shared secret configurado via Supabase secrets)
        const apiKey = req.headers.get('x-api-key')
        const validKey = Deno.env.get('PUBLIC_API_KEY')
        if (!validKey || apiKey !== validKey) {
          return new Response(
            JSON.stringify({ error: 'API key inválida ou ausente para /all' }),
            { status: 401, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } }
          )
        }
        return await getAllPublicData(supabase, origin)

      default:
        return new Response(
          JSON.stringify({
            error: 'Endpoint não encontrado',
            available_endpoints: [
              '/products - Produtos públicos (ativos)',
              '/blog-posts - Posts do blog publicados',
              '/pages - Informações das páginas (estático)',
              '/all - Requer X-API-Key header',
            ],
          }),
          {
            status: 404,
            headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
          }
        )
    }
  } catch (error) {
    console.error('Public API error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      {
        status: 500,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      }
    )
  }
})

async function getProducts(supabase: any, origin: string | null) {
  try {
    // Seleção restrita: não expõe created_at/updated_at/metadata internals
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        category,
        pricing_model,
        service_type,
        features,
        product_plans(
          id,
          name,
          description,
          price_monthly,
          price_yearly,
          features,
          currency
        )
      `)
      .eq('status', 'active')

    if (productsError) {
      console.error('Error fetching products:', productsError)
      throw productsError
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: products || [],
        count: products?.length || 0,
      }),
      { headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Products API error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Erro ao buscar produtos' }),
      {
        status: 500,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      }
    )
  }
}

async function getBlogPosts(supabase: any, origin: string | null) {
  try {
    // Seleção restrita: não expõe seo_title, seo_description, created_at
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        category,
        tags,
        author_name,
        featured_image,
        reading_time,
        published_at
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50)

    if (postsError) {
      console.error('Error fetching blog posts:', postsError)
      throw postsError
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: posts || [],
        count: posts?.length || 0,
      }),
      { headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Blog posts API error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Erro ao buscar posts do blog' }),
      {
        status: 500,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      }
    )
  }
}

async function getPageInfo(origin: string | null) {
  try {
    const pageInfo = {
      site: {
        name: 'SENVIA',
        description: 'AI Software House — Software à medida, sites e automação com IA.',
        domain: 'senvia.pt',
      },
      pages: [
        { path: '/', name: 'Início' },
        { path: '/senvia-os', name: 'SENVIA OS' },
        { path: '/sites', name: 'Sites & E-commerces' },
        { path: '/chatbots', name: 'Chatbots' },
        { path: '/softwares', name: 'Softwares' },
        { path: '/blog', name: 'Blog' },
        { path: '/contacto', name: 'Contacto' },
      ],
    }

    return new Response(
      JSON.stringify({ success: true, data: pageInfo }),
      { headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Page info API error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Erro ao buscar informações das páginas' }),
      {
        status: 500,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      }
    )
  }
}

async function getAllPublicData(supabase: any, origin: string | null) {
  try {
    const [productsResult, blogResult] = await Promise.all([
      supabase
        .from('products')
        .select('id, name, description, category, pricing_model, features')
        .eq('status', 'active'),
      supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, category, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(50),
    ])

    if (productsResult.error) console.error('Error fetching products:', productsResult.error)
    if (blogResult.error) console.error('Error fetching blog posts:', blogResult.error)

    const allData = {
      products: productsResult.data || [],
      blog_posts: blogResult.data || [],
      stats: {
        total_products: productsResult.data?.length || 0,
        total_blog_posts: blogResult.data?.length || 0,
        last_updated: new Date().toISOString(),
      },
    }

    return new Response(
      JSON.stringify({ success: true, data: allData }),
      { headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('All public data API error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Erro ao buscar todas as informações públicas' }),
      {
        status: 500,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      }
    )
  }
}
