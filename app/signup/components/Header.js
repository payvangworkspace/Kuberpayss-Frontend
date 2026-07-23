import Logo from "@/app/home/components/logo/Logo";
import styles from "../../login/components/header/Header.module.css";
import ActionButton from "./ActionButton";

const Header = () => {
  return (
    <div className={styles.header}>
      <Logo />
      <ActionButton />
    </div>
  );
};

export default Header;
