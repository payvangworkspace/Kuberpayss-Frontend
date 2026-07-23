import Link from "next/link";
import styles from "./Footer.module.css";
export default function Footer({ className = "" }) {
  const year = new Date().getFullYear();
  return (
    <div
      className={
        className !== ""
          ? styles.footer + " " + styles[className]
          : styles.footer
      }
    >
      <p>
        <span className={styles.copyright}>
          <i className="bi bi-c-circle" aria-hidden="true" />
          {year} <strong>Kuberpayss</strong>. All rights reserved
        </span>
        <span className={styles.dot} aria-hidden="true" />
        <Link href="/terms-and-conditions" className={styles.footerLink}>
          Terms and Conditions
        </Link>
        <span className={styles.dot} aria-hidden="true" />
        <Link href="/privacy-policy" className={styles.footerLink}>
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
