import styles from "./KycBanner.module.css";

const KycBanner = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.badge}>
        <p className={styles.badgeEyebrow}>KYC</p>
        <p className={styles.badgeTitle}>User Verification</p>
      </div>
      <div className={styles.message}>
        Congratulations, now you can accept unlimited payments. Settlements to
        your bank account have been enabled. Please note that as part of routine
        compliance checks mandated by our banking partners, we may review your
        KYC again and reach out in case of further clarifications.
      </div>
    </div>
  );
};

export default KycBanner;
