import styles from "./Label.module.css";
export default function Label({
  htmlFor = "",
  label = "",
  className = "",
  required = false,
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={
        className !== "" ? styles.label + " " + styles[className] : styles.label
      }
    >
      {label.toUpperCase()}
      {required && <span>*</span>}
    </label>
  );
}
