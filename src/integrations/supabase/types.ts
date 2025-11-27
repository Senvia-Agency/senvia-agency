export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_history: {
        Row: {
          activity_type: string
          contact_method: string | null
          contact_person: string | null
          created_at: string
          created_by: string | null
          description: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          activity_type: string
          contact_method?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          activity_type?: string
          contact_method?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          admin_user_id: string
          created_at: string
          id: string
          settings_key: string
          settings_value: Json | null
          updated_at: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          id?: string
          settings_key: string
          settings_value?: Json | null
          updated_at?: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          id?: string
          settings_key?: string
          settings_value?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      agents: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: boolean | null
          system_prompt: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: boolean | null
          system_prompt?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: boolean | null
          system_prompt?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string
          category: string
          content: string
          created_at: string
          created_by: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          reading_time: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string
          category?: string
          content: string
          created_at?: string
          created_by: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          category?: string
          content?: string
          created_at?: string
          created_by?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contatos_agente: {
        Row: {
          agente: string | null
          created_at: string | null
          email: string | null
          id: number
          interesse_duvida: string | null
          role: string | null
          status: string | null
          user_name: string | null
          user_number: string | null
          user_profile: string | null
        }
        Insert: {
          agente?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          interesse_duvida?: string | null
          role?: string | null
          status?: string | null
          user_name?: string | null
          user_number?: string | null
          user_profile?: string | null
        }
        Update: {
          agente?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          interesse_duvida?: string | null
          role?: string | null
          status?: string | null
          user_name?: string | null
          user_number?: string | null
          user_profile?: string | null
        }
        Relationships: []
      }
      custom_services: {
        Row: {
          base_price: number
          category: string
          created_at: string
          description: string | null
          estimated_hours: number | null
          id: string
          includes_features: Json | null
          name: string
          pricing_model: string
          service_type: string
          status: string
          updated_at: string
        }
        Insert: {
          base_price?: number
          category?: string
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          includes_features?: Json | null
          name: string
          pricing_model?: string
          service_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          category?: string
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          includes_features?: Json | null
          name?: string
          pricing_model?: string
          service_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_calendar_integrations: {
        Row: {
          access_token: string
          calendar_id: string | null
          created_at: string
          email: string | null
          id: string
          last_synced_at: string | null
          provider: string
          refresh_token: string
          scopes: string[]
          sync_enabled: boolean | null
          token_expires_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_token: string
          calendar_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_synced_at?: string | null
          provider?: string
          refresh_token: string
          scopes: string[]
          sync_enabled?: boolean | null
          token_expires_at: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_token?: string
          calendar_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_synced_at?: string | null
          provider?: string
          refresh_token?: string
          scopes?: string[]
          sync_enabled?: boolean | null
          token_expires_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      customer_settings: {
        Row: {
          billing_address: Json | null
          billing_email: string | null
          billing_notifications: boolean | null
          created_at: string
          email_notifications: boolean | null
          id: string
          language: string | null
          product_preferences: Json | null
          product_updates: boolean | null
          tax_id: string | null
          theme: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address?: Json | null
          billing_email?: string | null
          billing_notifications?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          product_preferences?: Json | null
          product_updates?: boolean | null
          tax_id?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: Json | null
          billing_email?: string | null
          billing_notifications?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          product_preferences?: Json | null
          product_updates?: boolean | null
          tax_id?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_subscriptions: {
        Row: {
          billing_cycle: string
          cancelled_at: string | null
          created_at: string
          end_date: string | null
          id: string
          next_billing_date: string | null
          plan_id: string
          product_config: Json | null
          product_id: string
          start_date: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          usage_data: Json | null
          user_id: string
        }
        Insert: {
          billing_cycle?: string
          cancelled_at?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          next_billing_date?: string | null
          plan_id: string
          product_config?: Json | null
          product_id: string
          start_date?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          usage_data?: Json | null
          user_id: string
        }
        Update: {
          billing_cycle?: string
          cancelled_at?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          next_billing_date?: string | null
          plan_id?: string
          product_config?: Json | null
          product_id?: string
          start_date?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          usage_data?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "product_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_id: string
          id: string
          lead_id: string | null
          metadata: Json | null
          product_description: string | null
          product_type: string
          status: string
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_id: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          product_description?: string | null
          product_type: string
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_id?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          product_description?: string | null
          product_type?: string
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_transactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "unified_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          acquisition_date: string
          acquisition_source: string | null
          address: Json | null
          communication_preferences: Json | null
          company_name: string | null
          created_at: string
          customer_status: string
          customer_tier: string | null
          email: string
          full_name: string
          id: string
          last_payment_date: string | null
          notes: string | null
          original_lead_id: string | null
          phone: string | null
          project_status: string | null
          stripe_customer_id: string | null
          tags: string[] | null
          total_spent: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          acquisition_date?: string
          acquisition_source?: string | null
          address?: Json | null
          communication_preferences?: Json | null
          company_name?: string | null
          created_at?: string
          customer_status?: string
          customer_tier?: string | null
          email: string
          full_name: string
          id?: string
          last_payment_date?: string | null
          notes?: string | null
          original_lead_id?: string | null
          phone?: string | null
          project_status?: string | null
          stripe_customer_id?: string | null
          tags?: string[] | null
          total_spent?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          acquisition_date?: string
          acquisition_source?: string | null
          address?: Json | null
          communication_preferences?: Json | null
          company_name?: string | null
          created_at?: string
          customer_status?: string
          customer_tier?: string | null
          email?: string
          full_name?: string
          id?: string
          last_payment_date?: string | null
          notes?: string | null
          original_lead_id?: string | null
          phone?: string | null
          project_status?: string | null
          stripe_customer_id?: string | null
          tags?: string[] | null
          total_spent?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_original_lead_id_fkey"
            columns: ["original_lead_id"]
            isOneToOne: false
            referencedRelation: "unified_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      database: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      entity_contacts: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          contact_email: string | null
          contact_person: string
          contact_phone: string | null
          contact_role: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          is_primary: boolean | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          contact_email?: string | null
          contact_person: string
          contact_phone?: string | null
          contact_role?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          contact_email?: string | null
          contact_person?: string
          contact_phone?: string | null
          contact_role?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      financial_movements: {
        Row: {
          amount: number
          category: string
          created_at: string
          currency: string
          customer_id: string | null
          description: string
          id: string
          movement_date: string
          movement_type: string
          notes: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          currency?: string
          customer_id?: string | null
          description: string
          id?: string
          movement_date?: string
          movement_type: string
          notes?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          customer_id?: string | null
          description?: string
          id?: string
          movement_date?: string
          movement_type?: string
          notes?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_movements_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up: {
        Row: {
          created_at: string | null
          id: number
          last_message: string | null
          user_number: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          last_message?: string | null
          user_number?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          last_message?: string | null
          user_number?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          invoice_number: string
          line_items: Json | null
          metadata: Json | null
          period_end: string
          period_start: string
          status: string
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          invoice_number: string
          line_items?: Json | null
          metadata?: Json | null
          period_end: string
          period_start: string
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          invoice_number?: string
          line_items?: Json | null
          metadata?: Json | null
          period_end?: string
          period_start?: string
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "customer_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      leads_ia: {
        Row: {
          agent_conversation_status: string | null
          company_name: string | null
          created_at: string
          diagnostic_answers: Json | null
          email: string
          full_name: string
          id: string
          lead_status: string
          monthly_clients: number | null
          notes: string | null
          qualification_score: number | null
          segment: string | null
          source_page: string
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          whatsapp: string
        }
        Insert: {
          agent_conversation_status?: string | null
          company_name?: string | null
          created_at?: string
          diagnostic_answers?: Json | null
          email: string
          full_name: string
          id?: string
          lead_status?: string
          monthly_clients?: number | null
          notes?: string | null
          qualification_score?: number | null
          segment?: string | null
          source_page?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp: string
        }
        Update: {
          agent_conversation_status?: string | null
          company_name?: string | null
          created_at?: string
          diagnostic_answers?: Json | null
          email?: string
          full_name?: string
          id?: string
          lead_status?: string
          monthly_clients?: number | null
          notes?: string | null
          qualification_score?: number | null
          segment?: string | null
          source_page?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      marketing_reports: {
        Row: {
          ad_sets_count: number | null
          campaign_name: string
          clicks: number | null
          client_name: string
          conversion_rate: number | null
          conversions: number | null
          cost_per_conversion: number | null
          cpc: number | null
          created_at: string
          created_by: string | null
          ctr: number | null
          id: string
          impressions: number | null
          notes: string | null
          report_period_end: string
          report_period_start: string
          report_type: string
          roas: number | null
          spend: number | null
          status: string
          updated_at: string
        }
        Insert: {
          ad_sets_count?: number | null
          campaign_name: string
          clicks?: number | null
          client_name: string
          conversion_rate?: number | null
          conversions?: number | null
          cost_per_conversion?: number | null
          cpc?: number | null
          created_at?: string
          created_by?: string | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          notes?: string | null
          report_period_end: string
          report_period_start: string
          report_type?: string
          roas?: number | null
          spend?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          ad_sets_count?: number | null
          campaign_name?: string
          clicks?: number | null
          client_name?: string
          conversion_rate?: number | null
          conversions?: number | null
          cost_per_conversion?: number | null
          cpc?: number | null
          created_at?: string
          created_by?: string | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          notes?: string | null
          report_period_end?: string
          report_period_start?: string
          report_type?: string
          roas?: number | null
          spend?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_fila_mensagens: {
        Row: {
          id: number
          id_mensagem: string
          mensagem: string | null
          telefone: string
          timestamp: string
        }
        Insert: {
          id?: number
          id_mensagem: string
          mensagem?: string | null
          telefone: string
          timestamp?: string
        }
        Update: {
          id?: number
          id_mensagem?: string
          mensagem?: string | null
          telefone?: string
          timestamp?: string
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          brevo_message_id: string | null
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          id: string
          notification_type: string
          recipient_email: string
          sent_at: string
          status: string
          subject: string
        }
        Insert: {
          brevo_message_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          id?: string
          notification_type: string
          recipient_email: string
          sent_at?: string
          status?: string
          subject: string
        }
        Update: {
          brevo_message_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          id?: string
          notification_type?: string
          recipient_email?: string
          sent_at?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          email: string
          id: string
          lead_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_payment_id: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          email: string
          id?: string
          lead_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          email?: string
          id?: string
          lead_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      product_plans: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          features: Json | null
          id: string
          limits: Json | null
          name: string
          price_monthly: number | null
          price_yearly: number | null
          product_id: string
          status: string
          stripe_active: boolean | null
          stripe_billing_scheme: string | null
          stripe_created: number | null
          stripe_currency_options: Json | null
          stripe_custom_unit_amount: Json | null
          stripe_lookup_key: string | null
          stripe_metadata: Json | null
          stripe_nickname: string | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          stripe_product_id: string | null
          stripe_recurring: Json | null
          stripe_tax_behavior: string | null
          stripe_tiers: Json | null
          stripe_tiers_mode: string | null
          stripe_transform_quantity: Json | null
          stripe_type: string | null
          stripe_unit_amount: number | null
          stripe_unit_amount_decimal: string | null
          stripe_updated: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          limits?: Json | null
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
          product_id: string
          status?: string
          stripe_active?: boolean | null
          stripe_billing_scheme?: string | null
          stripe_created?: number | null
          stripe_currency_options?: Json | null
          stripe_custom_unit_amount?: Json | null
          stripe_lookup_key?: string | null
          stripe_metadata?: Json | null
          stripe_nickname?: string | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          stripe_product_id?: string | null
          stripe_recurring?: Json | null
          stripe_tax_behavior?: string | null
          stripe_tiers?: Json | null
          stripe_tiers_mode?: string | null
          stripe_transform_quantity?: Json | null
          stripe_type?: string | null
          stripe_unit_amount?: number | null
          stripe_unit_amount_decimal?: string | null
          stripe_updated?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          limits?: Json | null
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          product_id?: string
          status?: string
          stripe_active?: boolean | null
          stripe_billing_scheme?: string | null
          stripe_created?: number | null
          stripe_currency_options?: Json | null
          stripe_custom_unit_amount?: Json | null
          stripe_lookup_key?: string | null
          stripe_metadata?: Json | null
          stripe_nickname?: string | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          stripe_product_id?: string | null
          stripe_recurring?: Json | null
          stripe_tax_behavior?: string | null
          stripe_tiers?: Json | null
          stripe_tiers_mode?: string | null
          stripe_transform_quantity?: Json | null
          stripe_type?: string | null
          stripe_unit_amount?: number | null
          stripe_unit_amount_decimal?: string | null
          stripe_updated?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_plans_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category: string
          created_at: string
          description: string | null
          features: Json | null
          id: string
          metadata: Json | null
          name: string
          pricing_model: string
          service_type: string | null
          status: string
          stripe_created: number | null
          stripe_default_price_id: string | null
          stripe_images: string[] | null
          stripe_package_dimensions: Json | null
          stripe_product_id: string | null
          stripe_shippable: boolean | null
          stripe_statement_descriptor: string | null
          stripe_tax_code: string | null
          stripe_unit_label: string | null
          stripe_updated: number | null
          stripe_url: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category: string
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          metadata?: Json | null
          name: string
          pricing_model?: string
          service_type?: string | null
          status?: string
          stripe_created?: number | null
          stripe_default_price_id?: string | null
          stripe_images?: string[] | null
          stripe_package_dimensions?: Json | null
          stripe_product_id?: string | null
          stripe_shippable?: boolean | null
          stripe_statement_descriptor?: string | null
          stripe_tax_code?: string | null
          stripe_unit_label?: string | null
          stripe_updated?: number | null
          stripe_url?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          metadata?: Json | null
          name?: string
          pricing_model?: string
          service_type?: string | null
          status?: string
          stripe_created?: number | null
          stripe_default_price_id?: string | null
          stripe_images?: string[] | null
          stripe_package_dimensions?: Json | null
          stripe_product_id?: string | null
          stripe_shippable?: boolean | null
          stripe_statement_descriptor?: string | null
          stripe_tax_code?: string | null
          stripe_unit_label?: string | null
          stripe_updated?: number | null
          stripe_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recurring_receivables: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string
          due_date: string
          id: string
          notes: string | null
          paid_amount: number | null
          paid_at: string | null
          payment_method: string | null
          payment_status: string
          recurring_service_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id: string
          due_date: string
          id?: string
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string
          recurring_service_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string
          due_date?: string
          id?: string
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string
          recurring_service_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_receivables_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_receivables_recurring_service_id_fkey"
            columns: ["recurring_service_id"]
            isOneToOne: false
            referencedRelation: "recurring_services"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_services: {
        Row: {
          amount: number
          billing_day: number
          created_at: string | null
          customer_id: string | null
          end_date: string | null
          id: string
          next_billing_date: string | null
          recurrence_type: string
          sale_id: string | null
          service_description: string | null
          service_name: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount?: number
          billing_day: number
          created_at?: string | null
          customer_id?: string | null
          end_date?: string | null
          id?: string
          next_billing_date?: string | null
          recurrence_type?: string
          sale_id?: string | null
          service_description?: string | null
          service_name: string
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          billing_day?: number
          created_at?: string | null
          customer_id?: string | null
          end_date?: string | null
          id?: string
          next_billing_date?: string | null
          recurrence_type?: string
          sale_id?: string | null
          service_description?: string | null
          service_name?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_services_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_services_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          payment_date: string
          payment_method: string
          payment_reference: string | null
          payment_status: string
          sale_id: string
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method: string
          payment_reference?: string | null
          payment_status?: string
          sale_id: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_reference?: string | null
          payment_status?: string
          sale_id?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_payments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          assigned_to: string | null
          commission_rate: number | null
          created_at: string
          customer_id: string | null
          delivered_at: string | null
          due_date: string | null
          expected_delivery_date: string | null
          id: string
          internal_notes: string | null
          is_recurring: boolean | null
          lead_id: string | null
          notes: string | null
          paid_amount: number
          payment_method: string | null
          payment_status: string
          recurring_billing_day: number | null
          recurring_start_date: string | null
          remaining_amount: number | null
          sale_date: string
          sale_number: string
          service_description: string | null
          service_id: string | null
          service_name: string
          service_type: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_value: number
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          commission_rate?: number | null
          created_at?: string
          customer_id?: string | null
          delivered_at?: string | null
          due_date?: string | null
          expected_delivery_date?: string | null
          id?: string
          internal_notes?: string | null
          is_recurring?: boolean | null
          lead_id?: string | null
          notes?: string | null
          paid_amount?: number
          payment_method?: string | null
          payment_status?: string
          recurring_billing_day?: number | null
          recurring_start_date?: string | null
          remaining_amount?: number | null
          sale_date?: string
          sale_number?: string
          service_description?: string | null
          service_id?: string | null
          service_name: string
          service_type: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_value?: number
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          commission_rate?: number | null
          created_at?: string
          customer_id?: string | null
          delivered_at?: string | null
          due_date?: string | null
          expected_delivery_date?: string | null
          id?: string
          internal_notes?: string | null
          is_recurring?: boolean | null
          lead_id?: string | null
          notes?: string | null
          paid_amount?: number
          payment_method?: string | null
          payment_status?: string
          recurring_billing_day?: number | null
          recurring_start_date?: string | null
          remaining_amount?: number | null
          sale_date?: string
          sale_number?: string
          service_description?: string | null
          service_id?: string | null
          service_name?: string
          service_type?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "unified_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      senvia_assistant_subscriptions: {
        Row: {
          billing_cycle: string
          cancelled_at: string | null
          created_at: string
          currency: string
          email: string
          id: string
          monthly_price: number | null
          next_billing_date: string | null
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_end_date: string | null
          subscription_metadata: Json | null
          subscription_start_date: string | null
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
          usage_data: Json | null
          user_id: string
        }
        Insert: {
          billing_cycle?: string
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          email: string
          id?: string
          monthly_price?: number | null
          next_billing_date?: string | null
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_metadata?: Json | null
          subscription_start_date?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          usage_data?: Json | null
          user_id: string
        }
        Update: {
          billing_cycle?: string
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          email?: string
          id?: string
          monthly_price?: number | null
          next_billing_date?: string | null
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_metadata?: Json | null
          subscription_start_date?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          usage_data?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          active_agent: string
          context: Json | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active_agent: string
          context?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active_agent?: string
          context?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          stripe_event_id: string | null
          subscription_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          stripe_event_id?: string | null
          subscription_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          stripe_event_id?: string | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "senvia_assistant_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      unified_leads: {
        Row: {
          assigned_to: string | null
          call_to_action: string | null
          client_testimonials: string | null
          company_name: string | null
          competitive_advantage: string | null
          contact_channels: Json | null
          conversion_date: string | null
          conversion_value: number | null
          converted: boolean | null
          country_code: string | null
          created_at: string
          data_consent: boolean | null
          desired_style: string | null
          email: string
          full_name: string
          id: string
          interest_type: string
          ip_address: string | null
          last_contact: string | null
          lead_status: string
          logo_images: Json | null
          main_product_service: string | null
          next_followup: string | null
          notes: string | null
          objective: string | null
          payment_status: string | null
          phone: string | null
          plan: string | null
          priority: number | null
          social_networks: string | null
          source_page: string
          stripe_customer_id: string | null
          stripe_payment_id: string | null
          stripe_session_id: string | null
          target_audience: string | null
          temperature: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          website: string | null
        }
        Insert: {
          assigned_to?: string | null
          call_to_action?: string | null
          client_testimonials?: string | null
          company_name?: string | null
          competitive_advantage?: string | null
          contact_channels?: Json | null
          conversion_date?: string | null
          conversion_value?: number | null
          converted?: boolean | null
          country_code?: string | null
          created_at?: string
          data_consent?: boolean | null
          desired_style?: string | null
          email: string
          full_name: string
          id?: string
          interest_type: string
          ip_address?: string | null
          last_contact?: string | null
          lead_status?: string
          logo_images?: Json | null
          main_product_service?: string | null
          next_followup?: string | null
          notes?: string | null
          objective?: string | null
          payment_status?: string | null
          phone?: string | null
          plan?: string | null
          priority?: number | null
          social_networks?: string | null
          source_page: string
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          target_audience?: string | null
          temperature?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          website?: string | null
        }
        Update: {
          assigned_to?: string | null
          call_to_action?: string | null
          client_testimonials?: string | null
          company_name?: string | null
          competitive_advantage?: string | null
          contact_channels?: Json | null
          conversion_date?: string | null
          conversion_value?: number | null
          converted?: boolean | null
          country_code?: string | null
          created_at?: string
          data_consent?: boolean | null
          desired_style?: string | null
          email?: string
          full_name?: string
          id?: string
          interest_type?: string
          ip_address?: string | null
          last_contact?: string | null
          lead_status?: string
          logo_images?: Json | null
          main_product_service?: string | null
          next_followup?: string | null
          notes?: string | null
          objective?: string | null
          payment_status?: string | null
          phone?: string | null
          plan?: string | null
          priority?: number | null
          social_networks?: string | null
          source_page?: string
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          target_audience?: string | null
          temperature?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          website?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          nome: string | null
          whatsapp_number: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          whatsapp_number: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          whatsapp_number?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_next_billing_date: {
        Args: { billing_day: number }
        Returns: string
      }
      calculate_revenue_metrics: {
        Args: { end_date?: string; start_date?: string }
        Returns: {
          avg_transaction_value: number
          landing_page_revenue: number
          subscription_revenue: number
          total_revenue: number
          total_transactions: number
        }[]
      }
      clean_phone_number: { Args: { phone_input: string }; Returns: string }
      convert_lead_to_customer: { Args: { lead_id: string }; Returns: string }
      convert_lead_to_sale: {
        Args: {
          p_lead_id: string
          p_notes?: string
          p_service_id?: string
          p_service_name?: string
          p_service_type?: string
          p_total_value?: number
        }
        Returns: string
      }
      generate_blog_slug: { Args: { title: string }; Returns: string }
      generate_recurring_receivables: { Args: never; Returns: number }
      generate_sale_number: { Args: never; Returns: string }
      get_leads_stats: {
        Args: { end_date?: string; start_date?: string }
        Returns: {
          conversion_rate: number
          landing_page_leads: number
          pending_leads: number
          senvia_landing_leads: number
          total_leads: number
        }[]
      }
      get_recurring_stats: {
        Args: never
        Returns: {
          net_monthly_balance: number
          overdue_receivables_amount: number
          overdue_receivables_count: number
          pending_receivables_amount: number
          pending_receivables_count: number
          total_active_expense_services: number
          total_active_revenue_services: number
          total_active_services: number
          total_monthly_expenses: number
          total_monthly_revenue: number
        }[]
      }
      get_trial_days_remaining: {
        Args: { subscription_id: string }
        Returns: number
      }
      is_admin: { Args: { user_uuid?: string }; Returns: boolean }
      is_admin_user: { Args: never; Returns: boolean }
      is_trial_expired: { Args: { subscription_id: string }; Returns: boolean }
      match_database: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      migrate_existing_leads: { Args: never; Returns: undefined }
      migrate_missing_recurring_services: { Args: never; Returns: number }
      migrate_paid_leads_to_customers: { Args: never; Returns: undefined }
      send_notification: {
        Args: {
          notification_data: Json
          notification_subject: string
          notification_type: string
          recipient_email?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
