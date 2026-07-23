import { forwardRef } from "react";
import styles from "./Dropdown.module.css";
import Link from "next/link";
function DropdownMenu(
  {
    viewMenu,
    selectedValue,
    handleView,
    optionData = [],
    onChange,
    id,
    value,
    search,
    handleSearch,
  },
  ref
) {
  return (
    <div
      className={viewMenu ? styles.menu + " " + styles.active : styles.menu}
      ref={ref}
    >
      {search && (
        <div className={styles.searchItem}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search here"
            onChange={(e) => handleSearch(id, e.target.value)}
          />
        </div>
      )}
      <ul className={styles.list}>
        {optionData && optionData.length > 0 ? (
          optionData.map((option, index) => (
            <li
              key={index}
              className={
                selectedValue.name === option[value] ? styles.activelink : ""
              }
            >
              <Link
                href=""
                onClick={() => {
                  onChange(option[id], option[value], index);
                  handleView();
                }}
              >
                {option[value]}
              </Link>
            </li>
          ))
        ) : (
          <li>
            <Link href="">No data available</Link>
          </li>
        )}
      </ul>
    </div>
  );
}
export default forwardRef(DropdownMenu);
