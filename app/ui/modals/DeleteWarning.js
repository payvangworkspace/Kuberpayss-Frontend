import React, { Fragment } from "react";
import styles from "./Modal.module.css";
import { createPortal } from "react-dom";
const Backdrop = () => {
  return <div className={styles.wrapper}></div>;
};
const Overlay = ({ content, confirm, onClick }) => {
  return (
    <div className={styles.modal}>
      <h6>
        <i className="bi bi-exclamation-diamond-fill"></i>
        Delete Warning
      </h6>
      <p>Do you want to procceed with deletion?</p>
      <div className="d-flex">
        <button className="submit" onClick={confirm}>
          Yes
        </button>
        <span className="mx-2"></span>
        <button className="reset" onClick={onClick}>
          No
        </button>
      </div>
    </div>
  );
};
export default function DeleteWarning({ onConfirm, onClose }) {
  return (
    <Fragment>
      {createPortal(<Backdrop />, document.getElementById("backdrop"))}
      {createPortal(
        <Overlay confirm={onConfirm} onClick={onClose} />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
}
