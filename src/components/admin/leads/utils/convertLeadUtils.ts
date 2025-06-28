
export const getValueBySource = (sourcePage: string): number => {
  switch (sourcePage) {
    case 'landing_page_basic':
      return 4.99;
    case 'landing_page_premium':
      return 49.99;
    default:
      return 0;
  }
};

export const getInitialFormData = (lead: any) => ({
  full_name: lead?.full_name || '',
  email: lead?.email || '',
  phone: lead?.phone || '',
  company_name: lead?.company_name || '',
  website: lead?.website || '',
  project_status: 'pending' as const,
  customer_tier: 'basic' as const,
  conversion_value: lead?.conversion_value || getValueBySource(lead?.source_page || ''),
  notes: lead?.notes || ''
});
