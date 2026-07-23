import styles from "../page.module.css";

export default function WalletCard({ wallet }) {
  return (
    <div className={styles.walletcard}>
      <div className={styles.walletTop}>
        <span className={styles.currencyBadge}>
          {wallet.currency || "INR"}
        </span>
        <i className={`bi bi-wallet2 ${styles.walletIcon}`} aria-hidden="true" />
      </div>
      <p className={styles.balanceLabel}>Balance</p>
      <h3 className={styles.balanceValue}>{wallet.balance || "0.00"}</h3>
      {wallet.lastUpdated && (
        <p className={styles.updatedAt}>Updated: {wallet.lastUpdated}</p>
      )}
    </div>
  );
}
