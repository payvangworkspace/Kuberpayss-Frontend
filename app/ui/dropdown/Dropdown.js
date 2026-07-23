"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.css";
import DropdownMenu from "./Dropdown-menu";
import ClickAwayListener from "react-click-away-listener";
import { usePathname } from "next/navigation";

const DEFAULT_OPTIONS = ["No data available"];

export default function Dropdown({
  initialLabel,
  selectedValue,
  options,
  onChange,
  id,
  value,
  search = false,
  onSearch,
  all = false,
}) {
  const [viewMenu, setViewMenu] = useState(false);
  const ref = useRef();
  const resolvedOptions = options ?? DEFAULT_OPTIONS;

  const [dataToSend, setDataToSend] = useState([]);

  const path = usePathname();

  useEffect(() => {
    if (resolvedOptions?.[0] == null) {
      return;
    }

    const hasAllOption =
      resolvedOptions?.find((option) =>
        String(option?.[value] ?? "").includes("All"),
      ) !== undefined;

    const nextOptions =
      hasAllOption || path?.includes("add-") || all === false
        ? resolvedOptions
        : [{ [id]: "", [value]: "All" }, ...resolvedOptions];

    setDataToSend((prev) => {
      if (
        prev.length === nextOptions.length &&
        prev.every((item, index) => item === nextOptions[index])
      ) {
        return prev;
      }
      return nextOptions;
    });
  }, [path, id, value, resolvedOptions, all]);

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
