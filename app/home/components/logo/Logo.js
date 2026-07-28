import Image from "next/image";
import styles from "./Logo.module.css";
import logo from "../../../../public/images/kuberPay_logo.png";
import Link from "next/link";
export default function Logo({ className = "" }) {
  return (
    <Link href="/">
      <Image
        src={logo}
        alt="Kuberpayss Logo"
        className={styles.logo + " " + styles[className]}
      />
    </Link>
  );
}
