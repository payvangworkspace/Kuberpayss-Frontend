import TransactionCard from "@/app/ui/cards/TransactionCard";
const CardPayIn = ({ data = [], symbol }) => {
  return (
    <div className="row">
      <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
        <TransactionCard
          icon="bi bi-graph-up-arrow text-info"
          title="Total Orders"
          id="total"
          number={data.totalOrders || 0}
          amount={data.totalOrdersAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
        <TransactionCard
          icon="bi bi-hand-thumbs-up text-success"
          title="Success Orders"
          id="success"
          number={data.successOrder || 0}
          amount={data.successOrderAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
        <TransactionCard
          icon="bi bi-exclamation-triangle text-danger"
          title="Failed Orders"
          id="failed"
          number={data.failOrder || 0}
          amount={data.failOrderAmount || 0}
          symbol={symbol}
        />
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
        <TransactionCard
          icon="bi bi-patch-question text-primary"
          title="Pending Orders"
          id="pending"
          number={data.pendingOrder || 0}
          amount={data.pendingOrderAmount || 0}
          symbol={symbol}
        />
      </div>
    </div>
  );
};

export default CardPayIn;
