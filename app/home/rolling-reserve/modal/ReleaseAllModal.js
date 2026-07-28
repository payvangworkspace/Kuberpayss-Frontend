"use client";
import { Fragment, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { dateFormatter } from "@/app/utils/dateFormatter";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const Overlay = ({ name, onClick, data, role, onConfirm, loading }) => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    setDateFrom(iso);
    setDateTo(iso);
  }, [data]);

  const handleConfirm = () => {
    const formattedFrom = dateFormatter(new Date(dateFrom));
    const formattedTo = dateFormatter(new Date(dateTo));
    if (onConfirm)
      onConfirm({ dateFrom: formattedFrom, dateTo: formattedTo, item: data });
  };

  return (
    <div className="overlay w-40">
      <h6>Release (all)</h6>
      <h5 id="username">
        Merchant: &nbsp; {name || data?.merchantId || data?.id}
      </h5>
      <small>Generated Date:&nbsp;{data?.createdDate || "-"}</small>

      <div className="row mt-3">
        <div className="col-12 mb-2">
          <div className="mb-3">
            <label className="form-label">Date From</label>
            <input
              type="date"
              className="form-control"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Date To</label>
            <input
              type="date"
              className="form-control"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <p className="small text-muted">
            This will release all held reserves for the selected merchant
            between the chosen dates.
          </p>
        </div>
      </div>

      <div className="d-flex mt-1">
        <button
          className="btn btn-secondary me-2"
          onClick={onClick}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Release"}
        </button>
      </div>
    </div>
  );
};

const ReleaseAllModal = ({ name, onClose, data, role, onConfirm, loading }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop"),
      )}
      {createPortal(
        <Overlay
          name={name}
          onClick={onClose}
          data={data}
          role={role}
          onConfirm={onConfirm}
          loading={loading}
        />,
        document.getElementById("overlay"),
      )}
    </Fragment>
  );
};

export default ReleaseAllModal;
