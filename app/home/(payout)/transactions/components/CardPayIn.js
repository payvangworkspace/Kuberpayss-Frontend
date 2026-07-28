import ChargeCard from "@/app/ui/cards/ChargeCard";
import TransactionCard from "@/app/ui/cards/TransactionCard";

const CardPayIn = ({ data = [], symbol }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
          <TransactionCard
            icon="bi bi-graph-up-arrow text-info"
            title="Total Transactions"
            id="total"
            number={data.totalTransactions || 0}
            amount={data.totalTransactionsAmount || 0}
            symbol={symbol}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
          <TransactionCard
            icon="bi bi-hand-thumbs-up text-success"
            title="Success Transactions"
            id="success"
            number={data.capturedTransactions || 0}
            amount={data.capturedTransactionsAmount || 0}
            symbol={symbol}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
          <TransactionCard
            icon="bi bi-exclamation-triangle text-danger"
            title="Failed Transactions"
            id="failed"
            number={data.failsTransactions || 0}
            amount={data.failsTransactionsAmount || 0}
            symbol={symbol}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
          <TransactionCard
            icon="bi bi-patch-question text-primary"
            title="Pending Transactions"
            id="pending"
            number={data.pendingTransactions || 0}
            amount={data.pendingTransactionsAmount || 0}
            symbol={symbol}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
          <ChargeCard type="Total GST/VAT" value={data.totalGstVat} symbol={symbol} />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
          <ChargeCard
            type="Total Merchant Charge"
            value={data.totalMerchantCharge}
            symbol={symbol}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
          <ChargeCard
            type="Merchant Payable Amount"
            value={data.totalMerchantPayableAmount}
            symbol={symbol}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
          <ChargeCard type="PG Charge" value={data.totalPgCharge} symbol={symbol} />
        </div>
      </div>
    </>
  );
};

export default CardPayIn;
