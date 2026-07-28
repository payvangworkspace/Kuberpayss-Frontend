import styles from "../page.module.css";
export default function WalletCard({ wallet }) {
  return (
    <div className={styles.walletcard}>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{wallet.currency || "INR"}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            Balance: {wallet.balance || "0.00"}
          </h6>
        </div>
      </div>
    </div>
  );
}
