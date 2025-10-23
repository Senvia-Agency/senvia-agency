
export interface Sale {
  id: string;
  customer_id?: string;
  lead_id?: string;
  sale_number: string;
  sale_date: string;
  service_id?: string;
  service_type: 'stripe_product' | 'custom_service' | 'manual';
  service_name: string;
  service_description?: string;
  total_value: number;
  paid_amount: number;
  remaining_amount: number;
  sale_status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue';
  payment_method?: string;
  expected_delivery_date?: string;
  delivered_at?: string;
  notes?: string;
  internal_notes?: string;
  commission_rate: number;
  assigned_to?: string;
  is_recurring?: boolean;
  recurring_billing_day?: number;
  recurring_start_date?: string;
  stripe_payment_intent_id?: string;
  stripe_session_id?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
  customers?: {
    full_name: string;
    email: string;
  };
  unified_leads?: {
    full_name: string;
    email: string;
  };
}
