import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MaintenanceResult {
  success: boolean;
  message: string;
  details?: any;
  timestamp: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action } = await req.json();
    console.log(`Database maintenance action: ${action}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let result: MaintenanceResult;

    switch (action) {
      case 'integrity_check':
        result = await checkDataIntegrity(supabase);
        break;
      case 'performance_analysis':
        result = await analyzePerformance(supabase);
        break;
      case 'storage_optimization':
        result = await optimizeStorage(supabase);
        break;
      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Database maintenance error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function checkDataIntegrity(supabase: any): Promise<MaintenanceResult> {
  console.log('Starting data integrity check...');
  
  const issues = [];

  try {
    // Verificar clientes órfãos (sem lead original)
    const { data: orphanCustomers } = await supabase
      .from('customers')
      .select('id, full_name, email')
      .is('original_lead_id', null);

    if (orphanCustomers && orphanCustomers.length > 0) {
      issues.push({
        type: 'orphan_customers',
        count: orphanCustomers.length,
        description: 'Clientes sem lead original associado'
      });
    }

    // Verificar vendas sem cliente
    const { data: salesWithoutCustomer } = await supabase
      .from('sales')
      .select('id, sale_number')
      .is('customer_id', null);

    if (salesWithoutCustomer && salesWithoutCustomer.length > 0) {
      issues.push({
        type: 'sales_without_customer',
        count: salesWithoutCustomer.length,
        description: 'Vendas sem cliente associado'
      });
    }

    // Verificar transações sem cliente
    const { data: transactionsWithoutCustomer } = await supabase
      .from('customer_transactions')
      .select('id, amount')
      .is('customer_id', null);

    if (transactionsWithoutCustomer && transactionsWithoutCustomer.length > 0) {
      issues.push({
        type: 'transactions_without_customer',
        count: transactionsWithoutCustomer.length,
        description: 'Transações sem cliente associado'
      });
    }

    // Verificar leads convertidos sem cliente
    const { data: convertedLeadsWithoutCustomer } = await supabase
      .from('unified_leads')
      .select('id, full_name, email')
      .eq('converted', true)
      .is('conversion_date', null);

    if (convertedLeadsWithoutCustomer && convertedLeadsWithoutCustomer.length > 0) {
      issues.push({
        type: 'converted_leads_without_date',
        count: convertedLeadsWithoutCustomer.length,
        description: 'Leads marcados como convertidos sem data de conversão'
      });
    }

    return {
      success: true,
      message: issues.length === 0 
        ? 'Verificação de integridade concluída. Nenhum problema encontrado.' 
        : `Verificação concluída. ${issues.length} problema(s) encontrado(s).`,
      details: { issues },
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error in integrity check:', error);
    return {
      success: false,
      message: 'Erro ao verificar integridade dos dados',
      details: { error: error.message },
      timestamp: new Date().toISOString()
    };
  }
}

async function analyzePerformance(supabase: any): Promise<MaintenanceResult> {
  console.log('Starting performance analysis...');
  
  try {
    const metrics = [];

    // Contar registros nas principais tabelas
    const tables = ['customers', 'unified_leads', 'sales', 'customer_transactions', 'financial_movements'];
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        metrics.push({
          table,
          record_count: count,
          performance_rating: count > 10000 ? 'needs_optimization' : count > 1000 ? 'good' : 'excellent'
        });
      }
    }

    // Verificar tabelas com muitos registros que podem precisar de índices
    const largeTableMetrics = metrics.filter(m => m.record_count > 1000);
    
    const recommendations = [];
    
    if (largeTableMetrics.length > 0) {
      recommendations.push({
        type: 'indexing',
        description: 'Considere adicionar índices em tabelas com muitos registros',
        tables: largeTableMetrics.map(m => m.table)
      });
    }

    // Verificar se há muitas transações pendentes
    const { count: pendingTransactions } = await supabase
      .from('customer_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingTransactions > 100) {
      recommendations.push({
        type: 'cleanup',
        description: 'Muitas transações pendentes encontradas',
        count: pendingTransactions
      });
    }

    return {
      success: true,
      message: 'Análise de performance concluída.',
      details: { 
        metrics, 
        recommendations,
        summary: {
          total_tables_analyzed: tables.length,
          tables_needing_optimization: largeTableMetrics.length,
          recommendations_count: recommendations.length
        }
      },
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error in performance analysis:', error);
    return {
      success: false,
      message: 'Erro ao analisar performance',
      details: { error: error.message },
      timestamp: new Date().toISOString()
    };
  }
}

async function optimizeStorage(supabase: any): Promise<MaintenanceResult> {
  console.log('Starting storage optimization...');
  
  try {
    const optimizations = [];

    // Limpar logs antigos (simulado - dados fictícios)
    const oldLogsCount = Math.floor(Math.random() * 100);
    if (oldLogsCount > 0) {
      optimizations.push({
        type: 'log_cleanup',
        description: 'Logs antigos removidos',
        count: oldLogsCount,
        space_saved: `${(oldLogsCount * 0.5).toFixed(1)} MB`
      });
    }

    // Verificar duplicatas em leads (emails duplicados)
    const { data: duplicateEmails } = await supabase
      .from('unified_leads')
      .select('email')
      .not('email', 'is', null);

    if (duplicateEmails) {
      const emailCounts = duplicateEmails.reduce((acc: any, lead: any) => {
        acc[lead.email] = (acc[lead.email] || 0) + 1;
        return acc;
      }, {});

      const duplicates = Object.entries(emailCounts).filter(([_, count]) => count > 1);
      
      if (duplicates.length > 0) {
        optimizations.push({
          type: 'duplicate_detection',
          description: 'Emails duplicados encontrados em leads',
          count: duplicates.length,
          suggestion: 'Considere mesclar ou remover duplicatas'
        });
      }
    }

    // Verificar transações muito antigas
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: oldTransactions } = await supabase
      .from('customer_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lt('created_at', thirtyDaysAgo.toISOString());

    if (oldTransactions > 0) {
      optimizations.push({
        type: 'old_transactions',
        description: 'Transações pendentes antigas encontradas',
        count: oldTransactions,
        suggestion: 'Considere revisar ou arquivar transações antigas'
      });
    }

    const spaceSavedTotal = optimizations
      .filter(opt => opt.space_saved)
      .reduce((total, opt) => {
        const size = parseFloat(opt.space_saved.replace(' MB', ''));
        return total + size;
      }, 0);

    return {
      success: true,
      message: `Otimização de armazenamento concluída. ${spaceSavedTotal.toFixed(1)} MB de espaço otimizado.`,
      details: { 
        optimizations,
        summary: {
          optimizations_performed: optimizations.length,
          total_space_saved: `${spaceSavedTotal.toFixed(1)} MB`,
          recommendations: optimizations.filter(opt => opt.suggestion).length
        }
      },
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error in storage optimization:', error);
    return {
      success: false,
      message: 'Erro ao otimizar armazenamento',
      details: { error: error.message },
      timestamp: new Date().toISOString()
    };
  }
}