import usePostRequest from "@/app/hooks/usePost";
import styles from "./ExportExcel.module.css";
import { Fragment, useEffect } from "react";
import { createPortal } from "react-dom";
const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ downloadData, url, onClick, source }) => {
  const { postData, loading, error, response } = usePostRequest(url);
  const handleDownload = async () => {
    await postData(downloadData, false, true);
  };

  useEffect(() => {
    if (!error && response) {
      try {
        // Create a blob from the response data
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${source}_${new Date().toISOString()}.xlsx`
        ); // Set the file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Download failed:", err);
      }
      onClick();
    }
  }, [response, error]);

  return (
    <div className={styles.logo_modal}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6>Download Details</h6>
        <span className="d-flex align-items-center gap-2">
          <i className="bi bi-x-circle-fill" onClick={onClick}></i>
        </span>
      </div>
      <div className="d-flex justify-content-between mb-3">
        <div className={styles.span}>
          {downloadData?.merchantName !== "Select Merchant" && (
            <span>Merchant :</span>
          )}
          <span>Date From :</span>
          <span>Date To :</span>
        </div>
        <div className={styles.small}>
          {downloadData?.merchantName !== "Select Merchant" && (
            <small>{downloadData?.merchantName}</small>
          )}

          <small>{downloadData?.dateFrom}</small>
          <small>{downloadData?.dateTo}</small>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleDownload}>
        {loading ? "Downloading" : "Download"}
      </button>
    </div>
  );
};
const ExportExcel = ({ downloadUrl, downloadData, onClose, source }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          url={downloadUrl}
          downloadData={downloadData}
          onClick={onClose}
          source={source}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default ExportExcel;
