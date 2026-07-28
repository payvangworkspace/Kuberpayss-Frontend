import useGetRequest from "@/app/hooks/useFetch";
import { Fragment, useEffect, useState } from "react";
import styles from "./Document.module.css";
import { createPortal } from "react-dom";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const Overlay = ({ documentId, url, onClick, onSuccess }) => {
  const { getData, loading, error, response } = useGetRequest();
  useEffect(() => {
    getData(url + "/" + documentId + "/" + "download", true);
  }, []);
  // Reject Document Logic

  if (loading) {
    return (
      <div className={styles.document_modal}>
        <h6>Document Viewer</h6>
        <p className="text-center">Please wait while fetching your document</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.document_modal}>
        <h6>Document Viewer</h6>
        <p className="text-center">Error Loading Document</p>
      </div>
    );
  }

  if (response) {
    return (
      <>
        <div className={styles.document_modal}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6>Document Viewer</h6>
            <button className="btn btn-close" type="button" onClick={onClick}>
            </button>
          </div>
          <div className="frame overflow-hidden">
            <iframe
              src={response}
              width="80vw"
              height="80vh"
              allow="fullscreen"
              referrerPolicy="no-referrer"
              loading="lazy"
              style={{ overflow: "hidden" }}
            ></iframe>
          </div>
        </div>
      </>
    );
  }
};
const ViewDocument = ({ id, url, onClose, onSuccess }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          documentId={id}
          url={url}
          onClick={onClose}
          onSuccess={onSuccess}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default ViewDocument;
