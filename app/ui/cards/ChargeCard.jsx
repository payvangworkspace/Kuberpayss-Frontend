import styles from "./Card.module.css";

const ICON_MAP = {
  "Total GST/VAT": "bi bi-receipt",
  "Total Merchant Charge": "bi bi-shop",
  "Merchant Payable Amount": "bi bi-wallet2",
  "PG Charge": "bi bi-credit-card",
};

const TONE_CLASS = {
  blue: "toneBlue",
  purple: "tonePurple",
  teal: "toneTeal",
  orange: "toneOrange",
};

const ChargeCard = ({
  type,
  value = 0.0,
  symbol,
  onClick,
  allAmountsSettled,
  icon,
  tone = "blue",
}) => {
  const iconClass = icon || ICON_MAP[type] || "bi bi-cash-coin";
  const toneClass = styles[TONE_CLASS[tone] || TONE_CLASS.blue];

  return (
    <div className={`${styles.card} ${styles.charge}`}>
      <i className={`${iconClass} ${styles.chargeWatermark}`} aria-hidden="true" />
      <div className={styles.chargeTop}>
        <span className={`${styles.chargeIcon} ${toneClass}`}>
          <i className={iconClass} aria-hidden="true" />
        </span>
      </div>
      <h5 className={styles.chargeValue}>
        {symbol} {value}
      </h5>
      <h6 className={styles.chargeLabel}>{type}</h6>
      <div className={styles.chargeFooter}>
        <span />
        {onClick && value > 0.0 ? (
          <button
            type="button"
            disabled={allAmountsSettled}
            className={styles.settleBtn}
            onClick={onClick}
          >
            Settle Now
          </button>
        ) : (
          <button type="button" className={styles.arrowBtn} aria-label={type}>
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChargeCard;
