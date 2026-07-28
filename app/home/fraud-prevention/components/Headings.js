import styles from "../page.module.css";

const Headings = ({ title, action }) => {
  return (
    <div className={styles.heading}>
      <h6>{title}</h6>
      <button className={styles.addbutton} onClick={action}>
        + Add
      </button>
    </div>
  );
};

export default Headings;
