import Search from "@/app/home/components/search/Search";
import styles from "./Table.module.css";
import AddButton from "@/app/home/components/addButton/AddButton";
import React from "react";
const Table = ({
  headers = [],
  currentPage = 0,
  pageSize = 25,
  totalElement = 0,
  children,
  handleNext,
  handlePrev,
  icon = "",
  link = "",
  download = true,
  onChange,
  search = true,
  pagination = true,
  handleExportExcelModel,
  selectable = false,
  selectedRows = [],
  onToggleRow,
  onToggleAll,
  additionalBtnAction,
  additionalBtn = { label: "New Btn", icon: "", visible: false, className: "" },
}) => {
  return (
    <>
      <div className={styles.table}>
        <div className={styles.export}>
          <span className="d-flex gap-3 align-items-center">
            {download &&
              [
                {
                  onClick: handleExportExcelModel,
                  icon: "bi-filetype-xlsx",
                  label: "Export To Excel",
                },
              ].map(({ onClick, icon, label }) => (
                <button key={label} onClick={onClick}>
                  <i className={`bi ${icon}`}></i> {label}
                </button>
              ))}
          </span>
          <span className="d-flex gap-3 align-items-center">
            {additionalBtn.visible &&
              [
                {
                  onClick: additionalBtnAction,
                  icon: additionalBtn.icon,
                  label: additionalBtn.label,
                  className: additionalBtn.className,
                },
              ].map(({ onClick, icon, label, className }) => (
                <button key={label} onClick={onClick} className={className}>
                  <i className={`bi ${icon}`}></i> {label}
                </button>
              ))}
          </span>
          <span className="d-flex justify-content-between gap-2">
            {search && <Search onChange={onChange} />}
          </span>
          <span className="d-flex justify-content-end">
            {link && <AddButton icon={icon} link={link} />}
          </span>
        </div>

        <div style={{ overflow: "auto" }}>
          <table>
            <thead>
              <tr>
                {selectable && (
                  <th className={styles.checkboxCol}>
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length > 0 &&
                        selectedRows.length === totalElement
                      }
                      onChange={onToggleAll}
                    />
                  </th>
                )}
                {headers.map((item) => (
                  <th key={item}>{item}</th>
                ))}
              </tr>
            </thead>

            {/* Passing selectable props to BodyMapping */}
            {React.cloneElement(children, {
              selectable,
              selectedRows,
              onToggleRow,
            })}
          </table>
        </div>

        {pagination && (
          <div className={styles.pagination}>
            <button onClick={handlePrev} disabled={currentPage === 0}>
              Prev
            </button>
            <span>
              Result{" "}
              {totalElement === 0 ? currentPage : currentPage * pageSize + 1}-
              {(currentPage + 1) * pageSize < totalElement
                ? (currentPage + 1) * pageSize
                : totalElement}{" "}
              of Total {totalElement}
            </span>
            <button
              onClick={handleNext}
              disabled={(currentPage + 1) * pageSize >= totalElement}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Table;
