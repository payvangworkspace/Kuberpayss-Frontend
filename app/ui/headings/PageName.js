import styles from "./Heading.module.css";
const PageName = ({ name = "" }) => {
  return <h6 className={styles.pagename}>{name}</h6>;
};

export default PageName;
