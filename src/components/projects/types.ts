
export interface Project {
  id: string;
  sale_number: string;
  service_name: string;
  service_description?: string;
  total_value: number;
  paid_amount: number;
  sale_status: string;
  payment_status: string;
  sale_date: string;
  expected_delivery_date?: string;
  delivered_at?: string;
  assigned_to?: string;
  internal_notes?: string;
  customers?: {
    full_name: string;
    email: string;
    phone?: string;
    company_name?: string;
  };
}

export interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}
