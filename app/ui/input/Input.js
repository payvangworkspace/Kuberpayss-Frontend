"use client";
import styles from "./Input.module.css";
export default function Input({
  type,
  onChange,
  placeholder = "",
  required = false,
  name = "",
  id = "",
  defaultValue = "",
  value = "",
  className = "",
  autocomplete = "off",
}) {
  return (
    <input
      type={type}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      name={name}
      id={id}
      autoComplete={autocomplete}
      defaultValue={defaultValue}
      className={styles.input + " " + styles[className]}
    />
  );
}
