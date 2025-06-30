
// Re-export all sales hooks from their individual files for backward compatibility
export { useSales } from "./sales/useSalesQuery";
export { useCreateSale } from "./sales/useCreateSale";
export { useUpdateSale } from "./sales/useUpdateSale";
export { useConvertLeadToSale } from "./sales/useConvertLeadToSale";
export type { Sale } from "./sales/types";
