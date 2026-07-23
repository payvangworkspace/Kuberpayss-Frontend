import TransactionCard from "@/app/ui/cards/TransactionCard";

const CardPayIn = ({ data = [], symbol }) => {
  return (
    <div className="row g-2 mb-2">
      <div className="col-lg-3 col-md-6 col-sm-12">
        <TransactionCard
          icon="bi bi-graph-up-arrow"
          secondaryIcon="bi bi-bar-chart-line"
          title="Total Transactions"
          variant="success"
          number={data.totalTransactions || 0}
          amount={data.totalTransactionsAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12">
        <TransactionCard
          icon="bi bi-hand-thumbs-up"
          secondaryIcon="bi bi-table"
          title="Success Transactions"
          variant="captured"
          number={data.capturedTransactions || 0}
          amount={data.capturedTransactionsAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12">
        <TransactionCard
          icon="bi bi-exclamation-triangle"
          secondaryIcon="bi bi-activity"
          title="Failed Transactions"
          variant="failed"
          number={data.failsTransactions || 0}
          amount={data.failsTransactionsAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12">
        <TransactionCard
          icon="bi bi-stopwatch"
          secondaryIcon="bi bi-three-dots"
          title="Pending Transactions"
          variant="pending"
          number={data.pendingTransactions || 0}
          amount={data.pendingTransactionsAmount || 0}
          symbol={symbol}
        />
      </div>
    </div>
  );
};

export default CardPayIn;
