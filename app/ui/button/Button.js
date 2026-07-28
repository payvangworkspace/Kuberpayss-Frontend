"use client";
import React from "react";
import styles from "./Button.module.css";
const Button = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      className={styles.button + " " + styles[className]}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
