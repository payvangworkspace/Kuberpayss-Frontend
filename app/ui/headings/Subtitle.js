import styles from "./Heading.module.css";
export default function Subtitle({ label, className = "" }) {
  return <h1 className={styles.subtitle + " " + styles[className]}>{label}</h1>;
}
