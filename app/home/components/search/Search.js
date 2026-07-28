import styles from "./Search.module.css";
const Search = ({ onChange }) => {
  return (
    <div className={styles.search}>
      <input type="text" placeholder="Search here..." onChange={onChange} />
      <i className="bi bi-search"></i>
    </div>
  );
};

export default Search;
