import styles from "./Loader.module.css";

const Loader = ({ loaderText = "Please wait while data is loading" }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles["payment-loader"]}>
        <div className={styles.pad}>
          <div className={styles.chip}></div>
          <div className={styles.line + " " + styles.line1}></div>
          <div className={styles.line + " " + styles.line2}></div>
        </div>
        <div className={styles["loader-text"]}>{loaderText}</div>
      </div>
    </div>
  );
};

export default Loader;
