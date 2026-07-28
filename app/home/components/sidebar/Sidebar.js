import Logo from "../logo/Logo";
import classes from "./Sidebar.module.css";
import Menu from "./components/Menu";

export default function Sidebar() {
  return (
    <div className={classes.sidebar}>
      <Logo className="dashboard" />
      <Menu />
    </div>
  );
}
