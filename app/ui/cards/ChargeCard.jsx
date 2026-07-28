import styles from "./Card.module.css";
const ChargeCard = ({
  type,
  value = 0.0,
  symbol,
  onClick,
  allAmountsSettled,
}) => {
  return (
    <div className={styles.card} id={styles.charge}>
      <div className={styles.cardBody}>
        <div>
          <h5>
            <span>{symbol} </span>
            {value}
          </h5>
          <h6>{type}</h6>
        </div>
        {onClick && value > 0.0 && (
          <div>
            <button
              disabled={allAmountsSettled}
              className={styles.settleBtn}
              onClick={onClick}
            >
              Settle Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChargeCard;
