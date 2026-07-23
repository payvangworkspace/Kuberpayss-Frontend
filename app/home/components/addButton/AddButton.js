import Link from "next/link";
import styles from "./AddButton.module.css";

const AddButton = ({ link = "" }) => {
  return (
    <Link href={link} className={styles.add}>
      <i className="bi bi-plus-circle" aria-hidden="true" />
      Add
    </Link>
  );
};

export default AddButton;
