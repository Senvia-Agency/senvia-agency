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
      financial_movements: {
        Row: {
          amount: number
          category: string
          created_at: string
          customer_id: string | null
          date: string
          description: string
          id: string
          notes: string | null
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
          notes?: string | null
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
          notes?: string | null
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
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string
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
      is_admin: { Args: { user_id: string }; Returns: boolean }
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
