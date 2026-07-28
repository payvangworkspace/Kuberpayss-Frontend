import Image from "next/image";
import styles from "./SideImages.module.css";
export default function SideImage({ label, img, className = "" }) {
  return (
    <div className={styles.image + " " + styles[className]}>
      <Image src={img} alt={label} priority />
    </div>
  );
}
