import styles from "./Heading.module.css";
export default function Title({ label, className = "" }) {
  return <h1 className={styles.title + " " + styles[className]}>{label}</h1>;
}
