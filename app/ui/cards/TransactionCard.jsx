import styles from "./Card.module.css";

const VARIANT_MAP = {
  success: styles.success,
  failed: styles.failed,
  pending: styles.pending,
  captured: styles.captured,
  settled: `${styles.metric} ${styles.settled}`,
  unsettled: `${styles.metric} ${styles.unsettled}`,
  refund: `${styles.metric} ${styles.refund}`,
};

const TransactionCard = ({
  icon,
  secondaryIcon,
  id,
  variant,
  title,
  number,
  amount,
  symbol,
}) => {
  const tone = variant || id || "success";
  const variantClass = VARIANT_MAP[tone] || styles.success;
  const isMetric = ["settled", "unsettled", "refund"].includes(tone);

  return (
    <div className={`${styles.card} ${variantClass}`}>
      {isMetric && <span className={styles.metricWave} aria-hidden="true" />}
      <div className={styles.cardTop}>
        <span className={styles.iconCircle}>
          <i className={icon} aria-hidden="true" />
        </span>
        {secondaryIcon && (
          <i className={`${secondaryIcon} ${styles.secondaryIcon}`} aria-hidden="true" />
        )}
      </div>
      <h6 className={styles.title}>{title}</h6>
      <h3 className={styles.number}>{number ?? 0}</h3>
      <div className={styles.amountRow}>
        <span>Amount</span>
        <span className={styles.amountValue}>
          {symbol} {amount ?? 0}
        </span>
      </div>
      {!isMetric && <span className={styles.bottomBar} aria-hidden="true" />}
    </div>
  );
};

export default TransactionCard;
