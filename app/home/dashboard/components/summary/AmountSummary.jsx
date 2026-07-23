import ChargeCard from "@/app/ui/cards/ChargeCard";

const AmountSummary = ({ response, symbol }) => {
  return (
    <div className="row g-2 mb-2">
      <div className="col-lg-3 col-md-6 col-sm-12">
        <ChargeCard
          type="Total GST/VAT"
          value={response?.totalGstVat || 0.0}
          symbol={symbol}
          icon="bi bi-receipt"
          tone="blue"
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12">
        <ChargeCard
          type="Total Merchant Charge"
          value={response?.totalMerchantCharge || 0.0}
          symbol={symbol}
          icon="bi bi-shop"
          tone="purple"
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12">
        <ChargeCard
          type="Merchant Payable Amount"
          value={response?.totalMerchantPayableAmount || 0.0}
          symbol={symbol}
          icon="bi bi-wallet2"
          tone="teal"
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12">
        <ChargeCard
          type="PG Charge"
          value={response?.totalPgCharge || 0.0}
          symbol={symbol}
          icon="bi bi-credit-card"
          tone="orange"
        />
      </div>
    </div>
  );
};

export default AmountSummary;
