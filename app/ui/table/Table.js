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
          <span className={styles.exportActions}>
            {download && (
              <button type="button" onClick={handleExportExcelModel}>
                <i className="bi bi-filetype-xlsx" aria-hidden="true" />
                Export To Excel
              </button>
            )}
            {additionalBtn.visible && (
              <button
                type="button"
                onClick={additionalBtnAction}
                className={additionalBtn.className || undefined}
              >
                {additionalBtn.icon ? (
                  <i className={`bi ${additionalBtn.icon}`} aria-hidden="true" />
                ) : null}
                {additionalBtn.label}
              </button>
            )}
          </span>
          <span className={styles.exportRight}>
            {search && <Search onChange={onChange} />}
            {link && <AddButton icon={icon} link={link} />}
          </span>
        </div>

        <div className={styles.tableScroll}>
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
