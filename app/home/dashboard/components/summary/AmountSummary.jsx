import ChargeCard from "@/app/ui/cards/ChargeCard";

const AmountSummary = ({ response, symbol }) => {
  return (
    <div className="row">
      <div className="col-md-3 col-sm-12 mb-3">
        <ChargeCard
          type="Total GST/VAT"
          value={response?.totalGstVat || 0.0}
          symbol={symbol}
        />
      </div>
      <div className="col-md-3 col-sm-12 mb-3">
        <ChargeCard
          type="Total Merchant Charge"
          value={response?.totalMerchantCharge || 0.0}
          symbol={symbol}
        />
      </div>
      <div className="col-md-3 col-sm-12 mb-3">
        <ChargeCard
          type="Merchant Payable Amount"
          value={response?.totalMerchantPayableAmount || 0.0}
          symbol={symbol}
        />
      </div>
      <div className="col-md-3 col-sm-12 mb-3">
        <ChargeCard
          type="PG Charge"
          value={response?.totalPgCharge || 0.0}
          symbol={symbol}
        />
      </div>
    </div>
  );
};

export default AmountSummary;
