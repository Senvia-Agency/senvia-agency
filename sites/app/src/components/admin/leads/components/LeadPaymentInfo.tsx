
interface LeadPaymentInfoProps {
  lead: any;
}

const LeadPaymentInfo = ({ lead }: LeadPaymentInfoProps) => {
  const remainingAmount = (lead.total_value || 0) - (lead.paid_amount || 0);

  if (!(lead.total_value > 0 || lead.paid_amount > 0)) {
    return null;
  }

  return (
    <div className="mt-3 p-2 bg-gray-700 rounded-lg">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400">Pagamento:</span>
        <div className="flex items-center gap-2">
          <span className="text-green-500">€{(lead.paid_amount || 0).toFixed(2)}</span>
          <span className="text-gray-400">/</span>
          <span className="text-white">€{(lead.total_value || 0).toFixed(2)}</span>
          {remainingAmount > 0 && (
            <span className="text-yellow-500 ml-2">
              (Faltam €{remainingAmount.toFixed(2)})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadPaymentInfo;
