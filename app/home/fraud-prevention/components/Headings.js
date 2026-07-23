import styles from "../page.module.css";

const Headings = ({ title, action }) => {
  return (
    <div className={styles.heading}>
      <h6>{title}</h6>
      <button type="button" className={styles.addbutton} onClick={action}>
        <i className="bi bi-plus-circle" aria-hidden="true" />
        Add
      </button>
    </div>
  );
};

export default Headings;
