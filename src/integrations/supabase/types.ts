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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_history: {
        Row: {
          action: string
          activity_type: string | null
          created_at: string
          description: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          performed_by: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          action: string
          activity_type?: string | null
          created_at?: string
          description?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          action?: string
          activity_type?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_metrics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          period_end?: string
          period_start?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          admin_user_id: string
          created_at: string
          id: string
          settings_key: string
          settings_value: Json
          updated_at: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          id?: string
          settings_key: string
          settings_value: Json
          updated_at?: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          id?: string
          settings_key?: string
          settings_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string
          category: string
          content: string
          created_at: string
          created_by: string | null
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
          created_by?: string | null
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
          created_by?: string | null
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
          access_token: string | null
          calendar_id: string | null
          created_at: string
          id: string
          provider: string
          refresh_token: string | null
          status: string
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string
          id?: string
          provider?: string
          refresh_token?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string
          id?: string
          provider?: string
          refresh_token?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
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
          description: string | null
          id: string
          product_type: string | null
          status: string
          stripe_payment_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_id: string
          description?: string | null
          id?: string
          product_type?: string | null
          status?: string
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_id?: string
          description?: string | null
          id?: string
          product_type?: string | null
          status?: string
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          acquisition_date: string
          acquisition_source: string | null
          company_name: string | null
          created_at: string
          customer_status: string
          customer_tier: string
          email: string
          full_name: string
          id: string
          main_product_service: string | null
          notes: string | null
          objective: string | null
          original_lead_id: string | null
          phone: string | null
          project_status: string | null
          stripe_customer_id: string | null
          total_spent: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          acquisition_date?: string
          acquisition_source?: string | null
          company_name?: string | null
          created_at?: string
          customer_status?: string
          customer_tier?: string
          email: string
          full_name: string
          id?: string
          main_product_service?: string | null
          notes?: string | null
          objective?: string | null
          original_lead_id?: string | null
          phone?: string | null
          project_status?: string | null
          stripe_customer_id?: string | null
          total_spent?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          acquisition_date?: string
          acquisition_source?: string | null
          company_name?: string | null
          created_at?: string
          customer_status?: string
          customer_tier?: string
          email?: string
          full_name?: string
          id?: string
          main_product_service?: string | null
          notes?: string | null
          objective?: string | null
          original_lead_id?: string | null
          phone?: string | null
          project_status?: string | null
          stripe_customer_id?: string | null
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
      entity_contacts: {
        Row: {
          contact_email: string | null
          contact_name: string
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
          contact_email?: string | null
          contact_name: string
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
          contact_email?: string | null
          contact_name?: string
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
          customer_id: string | null
          date: string
          description: string
          id: string
          is_recurring: boolean | null
          movement_date: string | null
          movement_type: string | null
          notes: string | null
          payment_method: string | null
          reference_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          customer_id?: string | null
          date?: string
          description: string
          id?: string
          is_recurring?: boolean | null
          movement_date?: string | null
          movement_type?: string | null
          notes?: string | null
          payment_method?: string | null
          reference_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          customer_id?: string | null
          date?: string
          description?: string
          id?: string
          is_recurring?: boolean | null
          movement_date?: string | null
          movement_type?: string | null
          notes?: string | null
          payment_method?: string | null
          reference_id?: string | null
          type?: string
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
      landing_page_leads: {
        Row: {
          assigned_to: string | null
          business_name: string | null
          conversion_date: string | null
          conversion_value: number | null
          converted: boolean | null
          country_code: string
          created_at: string
          email: string
          full_name: string
          id: string
          ip_address: string | null
          last_contact: string | null
          next_followup: string | null
          notes: string | null
          objective: string
          phone: string
          priority: number | null
          source: string | null
          status: string
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          website: string | null
        }
        Insert: {
          assigned_to?: string | null
          business_name?: string | null
          conversion_date?: string | null
          conversion_value?: number | null
          converted?: boolean | null
          country_code: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          ip_address?: string | null
          last_contact?: string | null
          next_followup?: string | null
          notes?: string | null
          objective: string
          phone: string
          priority?: number | null
          source?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          website?: string | null
        }
        Update: {
          assigned_to?: string | null
          business_name?: string | null
          conversion_date?: string | null
          conversion_value?: number | null
          converted?: boolean | null
          country_code?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          ip_address?: string | null
          last_contact?: string | null
          next_followup?: string | null
          notes?: string | null
          objective?: string
          phone?: string
          priority?: number | null
          source?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          website?: string | null
        }
        Relationships: []
      }
      lead_notes: {
        Row: {
          admin_user_id: string | null
          completed: boolean | null
          content: string
          created_at: string
          id: string
          lead_id: string
          lead_type: string
          note_type: string
          scheduled_for: string | null
          updated_at: string
        }
        Insert: {
          admin_user_id?: string | null
          completed?: boolean | null
          content: string
          created_at?: string
          id?: string
          lead_id: string
          lead_type: string
          note_type?: string
          scheduled_for?: string | null
          updated_at?: string
        }
        Update: {
          admin_user_id?: string | null
          completed?: boolean | null
          content?: string
          created_at?: string
          id?: string
          lead_id?: string
          lead_type?: string
          note_type?: string
          scheduled_for?: string | null
          updated_at?: string
        }
        Relationships: []
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
      notification_logs: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          notification_type: string
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          notification_type: string
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          notification_type?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          payment_type: string | null
          status: string
          stripe_payment_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_type?: string | null
          status?: string
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_type?: string | null
          status?: string
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
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
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
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
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
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
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
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
          images: string[] | null
          metadata: Json | null
          name: string
          pricing_model: string
          service_type: string | null
          status: string
          stripe_product_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category: string
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          images?: string[] | null
          metadata?: Json | null
          name: string
          pricing_model?: string
          service_type?: string | null
          status?: string
          stripe_product_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          images?: string[] | null
          metadata?: Json | null
          name?: string
          pricing_model?: string
          service_type?: string | null
          status?: string
          stripe_product_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recurring_receivables: {
        Row: {
          amount: number
          billing_period_end: string | null
          billing_period_start: string | null
          created_at: string
          customer_id: string | null
          due_date: string
          id: string
          notes: string | null
          paid_amount: number | null
          paid_at: string | null
          paid_date: string | null
          payment_method: string | null
          payment_status: string
          recurring_service_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string
          customer_id?: string | null
          due_date: string
          id?: string
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_status?: string
          recurring_service_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string
          customer_id?: string | null
          due_date?: string
          id?: string
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_status?: string
          recurring_service_id?: string
          status?: string | null
          updated_at?: string
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
          created_at: string
          customer_id: string | null
          end_date: string | null
          id: string
          last_billed_date: string | null
          metadata: Json | null
          monthly_amount: number | null
          next_billing_date: string | null
          recurrence_type: string
          sale_id: string | null
          service_description: string | null
          service_id: string | null
          service_name: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          billing_day?: number
          created_at?: string
          customer_id?: string | null
          end_date?: string | null
          id?: string
          last_billed_date?: string | null
          metadata?: Json | null
          monthly_amount?: number | null
          next_billing_date?: string | null
          recurrence_type?: string
          sale_id?: string | null
          service_description?: string | null
          service_id?: string | null
          service_name: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          billing_day?: number
          created_at?: string
          customer_id?: string | null
          end_date?: string | null
          id?: string
          last_billed_date?: string | null
          metadata?: Json | null
          monthly_amount?: number | null
          next_billing_date?: string | null
          recurrence_type?: string
          sale_id?: string | null
          service_description?: string | null
          service_id?: string | null
          service_name?: string
          start_date?: string
          status?: string
          updated_at?: string
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
          {
            foreignKeyName: "recurring_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "custom_services"
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
          sale_status: string
          service_description: string | null
          service_id: string | null
          service_name: string
          service_type: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_value: number
          unified_lead_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          commission_rate?: number | null
          created_at?: string
          customer_id?: string | null
          delivered_at?: string | null
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
          sale_number: string
          sale_status?: string
          service_description?: string | null
          service_id?: string | null
          service_name: string
          service_type: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_value?: number
          unified_lead_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          commission_rate?: number | null
          created_at?: string
          customer_id?: string | null
          delivered_at?: string | null
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
          sale_status?: string
          service_description?: string | null
          service_id?: string | null
          service_name?: string
          service_type?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_value?: number
          unified_lead_id?: string | null
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
            foreignKeyName: "sales_unified_lead_id_fkey"
            columns: ["unified_lead_id"]
            isOneToOne: false
            referencedRelation: "unified_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      senvia_assistant_subscriptions: {
        Row: {
          billing_cycle: string
          created_at: string
          email: string
          end_date: string | null
          id: string
          monthly_price: number | null
          plan_type: string
          start_date: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          billing_cycle?: string
          created_at?: string
          email: string
          end_date?: string | null
          id?: string
          monthly_price?: number | null
          plan_type?: string
          start_date?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          email?: string
          end_date?: string | null
          id?: string
          monthly_price?: number | null
          plan_type?: string
          start_date?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      generate_sale_number: { Args: never; Returns: string }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      send_notification: {
        Args: { p_data?: Json; p_title: string; p_type: string }
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
