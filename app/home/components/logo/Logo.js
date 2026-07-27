import Image from "next/image";
import styles from "./Logo.module.css";
import logo from "../../../../public/images/kuberPays_logo.svg";
import Link from "next/link";

export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={styles.brandLink}>
      <Image
        src={logo}
        alt="Kuber Pays Logo"
        className={styles.logo + " " + styles[className]}
        priority
      />
    </Link>
  );
}
