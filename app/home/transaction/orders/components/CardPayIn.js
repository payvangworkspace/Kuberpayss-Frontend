import TransactionCard from "@/app/ui/cards/TransactionCard";

const CardPayIn = ({ data = [], symbol }) => {
  return (
    <div className="row g-2 mb-2">
      <div className="col-lg-3 col-md-6 col-sm-12">
        <TransactionCard
          icon="bi bi-graph-up-arrow"
          secondaryIcon="bi bi-bar-chart-line"
          title="Total Orders"
          variant="success"
          number={data.totalOrders || 0}
          amount={data.totalOrdersAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12">
        <TransactionCard
          icon="bi bi-hand-thumbs-up"
          secondaryIcon="bi bi-table"
          title="Success Orders"
          variant="captured"
          number={data.successOrder || 0}
          amount={data.successOrderAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12">
        <TransactionCard
          icon="bi bi-exclamation-triangle"
          secondaryIcon="bi bi-activity"
          title="Failed Orders"
          variant="failed"
          number={data.failOrder || 0}
          amount={data.failOrderAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12">
        <TransactionCard
          icon="bi bi-stopwatch"
          secondaryIcon="bi bi-three-dots"
          title="Pending Orders"
          variant="pending"
          number={data.pendingOrder || 0}
          amount={data.pendingOrderAmount || 0}
          symbol={symbol}
        />
      </div>
    </div>
  );
};

export default CardPayIn;
