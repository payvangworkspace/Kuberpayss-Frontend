import TransactionCard from "@/app/ui/cards/TransactionCard";

const TransactionsSummary = ({ response, symbol }) => {
  return (
    <>
      <div className="row g-2 mb-2">
        <div className="col-lg-3 col-md-6 col-sm-12">
          <TransactionCard
            icon="bi bi-graph-up-arrow"
            secondaryIcon="bi bi-bar-chart-line"
            title="Total Transactions"
            variant="success"
            number={response?.totalTransactions || 0}
            amount={response?.totalTransactionsAmount || 0}
            symbol={symbol}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <TransactionCard
            icon="bi bi-exclamation-triangle"
            secondaryIcon="bi bi-activity"
            title="Failed Transactions"
            variant="failed"
            number={response?.failsTransactions || 0}
            amount={response?.failsTransactionsAmount || 0}
            symbol={symbol}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <TransactionCard
            icon="bi bi-stopwatch"
            secondaryIcon="bi bi-three-dots"
            title="Pending Transactions"
            variant="pending"
            number={response?.pendingTransactions || 0}
            amount={response?.pendingTransactionsAmount || 0}
            symbol={symbol}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <TransactionCard
            icon="bi bi-hand-thumbs-up"
            secondaryIcon="bi bi-table"
            title="Captured Transactions"
            variant="captured"
            number={response?.capturedTransactions || 0}
            amount={response?.capturedTransactionsAmount || 0}
            symbol={symbol}
          />
        </div>
      </div>

      <div className="row g-2 mb-2">
        <div className="col-lg-4 col-md-6 col-sm-12">
          <TransactionCard
            icon="bi bi-coin"
            secondaryIcon="bi bi-info-circle"
            title="Settled Amount"
            variant="settled"
            number={response?.capturedTransactions || 0}
            amount={response?.capturedTransactionsAmount || 0}
            symbol={symbol}
          />
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          <TransactionCard
            icon="bi bi-wallet2"
            secondaryIcon="bi bi-info-circle"
            title="Unsettled Amount"
            variant="unsettled"
            number={response?.capturedTransactions || 0}
            amount={response?.capturedTransactionsAmount || 0}
            symbol={symbol}
          />
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          <TransactionCard
            icon="bi bi-arrow-counterclockwise"
            secondaryIcon="bi bi-info-circle"
            title="Refund Transactions"
            variant="refund"
            number={response?.capturedTransactions || 0}
            amount={response?.capturedTransactionsAmount || 0}
            symbol={symbol}
          />
        </div>
      </div>
    </>
  );
};

export default TransactionsSummary;
