import TransactionCard from "@/app/ui/cards/TransactionCard";

const TransactionsSummary = ({ response, symbol }) => {
  return (
    <div className="row">
      <div className="col-md-3 col-sm-12 mb-3">
        <TransactionCard
          icon="bi bi-graph-up-arrow text-success"
          title="Total Transaction"
          id="success"
          number={response?.totalTransactions || 0}
          amount={response?.totalTransactionsAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-md-3 col-sm-12 mb-3">
        <TransactionCard
          icon="bi bi-exclamation-triangle text-danger"
          title="Failed Transaction"
          id="failed"
          number={response?.failsTransactions || 0}
          amount={response?.failsTransactionsAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
        <TransactionCard
          icon="bi bi-arrow-counterclockwise text-primary"
          title="Pending Transaction"
          id="total"
          number={response?.pendingTransactions || 0}
          amount={response?.pendingTransactionsAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
        <TransactionCard
          icon="bi bi-hand-thumbs-down text-danger"
          title="Captured Transaction"
          id="success"
          number={response?.capturedTransactions || 0}
          amount={response?.capturedTransactionsAmount || 0}
          symbol={symbol}
        />
      </div>

      <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
        <TransactionCard
          icon="bi bi-info-circle text-info"
          title="Settled Amount"
          id="info"
          number={response?.capturedTransactions || 0}
          amount={response?.capturedTransactionsAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
        <TransactionCard
          icon="bi bi-info-circle text-info"
          title="Unsettled Amount"
          id="info"
          number={response?.capturedTransactions || 0}
          amount={response?.capturedTransactionsAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
        <TransactionCard
          icon="bi bi-info-circle text-info"
          title="Refund Transactions"
          id="info"
          number={response?.capturedTransactions || 0}
          amount={response?.capturedTransactionsAmount || 0}
          symbol={symbol}
        />
      </div>
    </div>
  );
};

export default TransactionsSummary;
