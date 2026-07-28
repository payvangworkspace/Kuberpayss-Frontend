import styles from "./KycBanner.module.css";

const KycBanner = () => {
  return (
    <div className="row">
      <div className="col-md-2 col-sm-12 mb-2">
        <div className={styles.banner}>
          KYC <br /> User Verification
        </div>
      </div>
      <div className="col-md-10 col-sm-12 mb-2 text-start" id={styles.heading}>
        Congratulations, now you can accept unlimited payments. Settlements to
        your bank account have been enabled. Please note that as part of routine
        compliance checks mandated by our banking partners, we may review your
        KYC again and reach out in case of further clarifications
      </div>
    </div>
  );
};

export default KycBanner;
