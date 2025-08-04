import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url);
    const path = url.pathname.replace('/public-api/', '');
    
    console.log('Public API request:', path);

    switch (path) {
      case 'products':
        return await getProducts(supabase);
      
      case 'blog-posts':
        return await getBlogPosts(supabase);
      
      case 'pages':
        return await getPageInfo();
      
      case 'all':
        return await getAllPublicData(supabase);
      
      default:
        return new Response(
          JSON.stringify({ 
            error: 'Endpoint não encontrado',
            available_endpoints: [
              '/products - Produtos públicos',
              '/blog-posts - Posts do blog publicados', 
              '/pages - Informações das páginas',
              '/all - Todas as informações públicas'
            ]
          }), 
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }
  } catch (error) {
    console.error('Public API error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function getProducts(supabase: any) {
  try {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        category,
        status,
        pricing_model,
        service_type,
        features,
        metadata,
        created_at,
        updated_at,
        product_plans(
          id,
          name,
          description,
          price_monthly,
          price_yearly,
          features,
          limits,
          currency,
          status
        )
      `)
      .eq('status', 'active');

    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw productsError;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: products || [],
        count: products?.length || 0
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Products API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro ao buscar produtos' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function getBlogPosts(supabase: any) {
  try {
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        author_name,
        featured_image,
        reading_time,
        seo_title,
        seo_description,
        published_at,
        created_at,
        updated_at
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching blog posts:', postsError);
      throw postsError;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: posts || [],
        count: posts?.length || 0
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Blog posts API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro ao buscar posts do blog' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function getPageInfo() {
  try {
    const pageInfo = {
      site: {
        name: "SENVIA Agency",
        description: "Inteligência Artificial para Negócios",
        domain: "senvia.pt"
      },
      pages: [
        {
          path: "/",
          name: "Página Inicial",
          description: "Landing page principal com foco em IA"
        },
        {
          path: "/produtos",
          name: "Produtos",
          description: "Catálogo de produtos e serviços"
        },
        {
          path: "/blog",
          name: "Blog",
          description: "Artigos sobre marketing digital e IA"
        },
        {
          path: "/agentes-ia",
          name: "Agentes IA",
          description: "Página sobre agentes de inteligência artificial"
        },
        {
          path: "/websites",
          name: "Websites",
          description: "Desenvolvimento de websites"
        },
        {
          path: "/ecommerce",
          name: "E-commerce",
          description: "Soluções de e-commerce"
        },
        {
          path: "/crm",
          name: "CRM",
          description: "Sistema de gestão de relacionamento"
        },
        {
          path: "/trafego-pago",
          name: "Tráfego Pago",
          description: "Gestão de campanhas pagas"
        },
        {
          path: "/social-media",
          name: "Social Media",
          description: "Gestão de redes sociais"
        },
        {
          path: "/ferramentas",
          name: "Ferramentas",
          description: "Ferramentas digitais"
        },
        {
          path: "/landing-pages",
          name: "Landing Pages",
          description: "Desenvolvimento de landing pages"
        },
        {
          path: "/senvia-assistant",
          name: "SENVIA Assistant",
          description: "Assistente virtual baseado em IA"
        }
      ],
      services: [
        "Desenvolvimento de Websites",
        "E-commerce Solutions", 
        "CRM Systems",
        "Tráfego Pago",
        "Social Media Management",
        "Landing Pages",
        "Agentes de IA",
        "SENVIA Assistant"
      ]
    };

    return new Response(
      JSON.stringify({ 
        success: true,
        data: pageInfo
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Page info API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro ao buscar informações das páginas' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function getAllPublicData(supabase: any) {
  try {
    // Buscar produtos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        category,
        status,
        pricing_model,
        service_type,
        features,
        metadata,
        created_at,
        updated_at,
        product_plans(
          id,
          name,
          description,
          price_monthly,
          price_yearly,
          features,
          limits,
          currency,
          status
        )
      `)
      .eq('status', 'active');

    // Buscar posts do blog
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        author_name,
        featured_image,
        reading_time,
        seo_title,
        seo_description,
        published_at,
        created_at,
        updated_at
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    // Informações das páginas
    const pageInfo = {
      site: {
        name: "SENVIA Agency",
        description: "Inteligência Artificial para Negócios",
        domain: "senvia.pt"
      },
      pages: [
        { path: "/", name: "Página Inicial", description: "Landing page principal com foco em IA" },
        { path: "/produtos", name: "Produtos", description: "Catálogo de produtos e serviços" },
        { path: "/blog", name: "Blog", description: "Artigos sobre marketing digital e IA" },
        { path: "/agentes-ia", name: "Agentes IA", description: "Página sobre agentes de inteligência artificial" },
        { path: "/websites", name: "Websites", description: "Desenvolvimento de websites" },
        { path: "/ecommerce", name: "E-commerce", description: "Soluções de e-commerce" },
        { path: "/crm", name: "CRM", description: "Sistema de gestão de relacionamento" },
        { path: "/trafego-pago", name: "Tráfego Pago", description: "Gestão de campanhas pagas" },
        { path: "/social-media", name: "Social Media", description: "Gestão de redes sociais" },
        { path: "/ferramentas", name: "Ferramentas", description: "Ferramentas digitais" },
        { path: "/landing-pages", name: "Landing Pages", description: "Desenvolvimento de landing pages" },
        { path: "/senvia-assistant", name: "SENVIA Assistant", description: "Assistente virtual baseado em IA" }
      ],
      services: [
        "Desenvolvimento de Websites",
        "E-commerce Solutions", 
        "CRM Systems",
        "Tráfego Pago",
        "Social Media Management",
        "Landing Pages",
        "Agentes de IA",
        "SENVIA Assistant"
      ]
    };

    if (productsError) {
      console.error('Error fetching products:', productsError);
    }

    if (blogError) {
      console.error('Error fetching blog posts:', blogError);
    }

    const allData = {
      site_info: pageInfo,
      products: products || [],
      blog_posts: blogPosts || [],
      stats: {
        total_products: products?.length || 0,
        total_blog_posts: blogPosts?.length || 0,
        total_pages: pageInfo.pages.length,
        last_updated: new Date().toISOString()
      }
    };

    return new Response(
      JSON.stringify({ 
        success: true,
        data: allData
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('All public data API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro ao buscar todas as informações públicas' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}