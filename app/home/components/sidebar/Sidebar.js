import Logo from "../logo/Logo";
import classes from "./Sidebar.module.css";
import Menu from "./components/Menu";

export default function Sidebar() {
  return (
    <aside className={classes.sidebar}>
      <div className={classes.brand}>
        <Logo className="dashboard" />
      </div>
      <Menu />
    </aside>
  );
}
