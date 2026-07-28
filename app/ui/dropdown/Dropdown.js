"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.css";
import DropdownMenu from "./Dropdown-menu";
import ClickAwayListener from "react-click-away-listener";
import { usePathname } from "next/navigation";
export default function Dropdown({
  initialLabel,
  selectedValue,
  options = ["No data available"],
  onChange,
  id,
  value,
  search = false,
  onSearch,
  all = false,
}) {
  const [viewMenu, setViewMenu] = useState(false);
  const ref = useRef();

  const [dataToSend, setDataToSend] = useState([]);

  const path = usePathname();

  useEffect(() => {
    if (options?.[0] == null) {
      return;
    }
    if (options?.find((option) => option?.[value]?.includes("All")) !== undefined) {
      console.log("All option found");
    }

    if (options?.find((option) => option?.[value]?.includes("All")) !== undefined || path?.includes("add-") || all === false) {
      setDataToSend(options);
    } else {
      setDataToSend([
        { [id]: "", [value]: "All" },
        ...options,
      ]);
    }
  }, [path, id, value, options, all]);

  return (
    <div
      className="d-flex justify-content-between position-relative align-items-center"
      style={{ width: "100%" }}
    >
      <input
        name="dropdown"
        className={
          selectedValue.name !== initialLabel
            ? styles.dropdown + " " + styles.active
            : styles.dropdown
        }
        value={selectedValue.label || selectedValue.name}
        readOnly
        onClick={() => setViewMenu(!viewMenu)}
      />
      <i
        className="bi bi-chevron-down"
        id={styles.icon}
        onClick={() => setViewMenu(!viewMenu)}
      ></i>
      {viewMenu && (
        <ClickAwayListener
          onClickAway={() => {
            setViewMenu(false);
          }}
        >
          <DropdownMenu
            viewMenu={viewMenu}
            selectedValue={selectedValue.name}
            ref={ref}
            handleView={() => setViewMenu(false)}
            optionData={dataToSend}
            onChange={onChange}
            id={id}
            value={value}
            search={search}
            handleSearch={onSearch}
          />
        </ClickAwayListener>
      )}
    </div>
  );
}
