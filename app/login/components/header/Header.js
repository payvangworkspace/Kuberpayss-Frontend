import styles from "./Header.module.css";
import ActionButtons from "../action-buttons/ActionButtons";
import Logo from "@/app/home/components/logo/Logo";

const Header = () => {
  return (
    <div className={styles.header}>
      <Logo />
      <ActionButtons />
    </div>
  );
};

export default Header;
