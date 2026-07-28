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
    <ul
      className={viewMenu ? styles.menu + " " + styles.active : styles.menu}
      ref={ref}
    >
      {search && (
        <li style={{ padding: "0px", width: "100%" }}>
          <input
            type="serach"
            style={{
              width: "100%",
              padding: "5px",
              fontSize: "14px",
              border: "1px solid #ccc",
            }}
            placeholder="Search here"
            onChange={(e) => handleSearch(id, e.target.value)}
          />
        </li>
      )}
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
  );
}
export default forwardRef(DropdownMenu);
