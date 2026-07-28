import styles from "./InfoLabel.module.css";
const InfoLabel = ({ content }) => {
  return (
    <div className={styles.info}>
      <i className="bi bi-info-circle-fill text-info"></i> {content}
    </div>
  );
};

export default InfoLabel;
