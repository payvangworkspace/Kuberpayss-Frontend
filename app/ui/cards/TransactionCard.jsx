import styles from "./Card.module.css";
const TransactionCard = ({ icon, id, title, number, amount, symbol }) => {
  return (
    <div className={styles.card} id={styles[`${id}`]}>
      <span className="d-flex justify-content-between">
        <h6>{title} </h6> <i className={icon}></i>
      </span>
      <h3>{number}</h3>
      <span>
        <small>
          Amount &nbsp;&nbsp;&nbsp; {symbol} {amount}
        </small>
      </span>
    </div>
  );
};

export default TransactionCard;
