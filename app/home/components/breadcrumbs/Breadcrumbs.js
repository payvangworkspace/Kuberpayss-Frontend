"use client";
import { usePathname } from "next/navigation";
import styles from "./Breadcrumbs.module.css";
const Breadcrumbs = () => {
  const pathName = usePathname();
  return <span className={styles.path}>{pathName.substring(0, 45)}</span>;
};

export default Breadcrumbs;
