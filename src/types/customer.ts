
export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  website?: string;
  customer_status: string;
  customer_tier: string;
  project_status?: string;
  total_spent: number;
  acquisition_date: string;
  acquisition_source?: string;
  created_at: string;
  updated_at: string;
  original_lead?: any;
}

export interface CustomerTransaction {
  id: string;
  customer_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface CustomerSale {
  customer_id: string;
  paid_amount: number;
}

export interface ConvertLeadToCustomerData {
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  website?: string;
  project_status: string;
  customer_tier: string;
  conversion_value: number;
  notes?: string;
}
