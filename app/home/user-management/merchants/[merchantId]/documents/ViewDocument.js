import useGetRequest from "@/app/hooks/useFetch";
import usePutRequest from "@/app/hooks/usePut";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import { Fragment, useEffect, useState } from "react";
import RejectDocument from "./RejectDocument";
import styles from "./Document.module.css";
import { createPortal } from "react-dom";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const Overlay = ({
  documentId,
  url,
  onClick,
  onSuccess,
  isMerchant,
  isVerified,
  isRejected,
}) => {
  const { getData, loading, error, response } = useGetRequest();
  useEffect(() => {
    getData(url + "/" + documentId, true);
  }, []);

  const {
    response: verifyResponse,
    error: verifyError,
    loading: verifyLoading,
    putData,
  } = usePutRequest(endPoints.verifyDocument + documentId);
  const handleVerifyDocument = async () => {
    await putData();
  };
  useEffect(() => {
    if (verifyResponse && !verifyError) {
      successMsg(
        verifyResponse.data.message || "Document Verified Successfully"
      );
      onSuccess();
      onClick();
    }
  }, [verifyResponse, verifyError]);
  // Reject Document Logic
  const [viewRejectReason, setViewRejectReason] = useState(false);

  const handleRejectDocument = () => {
    setViewRejectReason(true);
  };

  if (loading) {
    return (
      <div className={styles.document_modal}>
        <h6>Document Viewer</h6>
        <p className="text-center">Please while fetching your document</p>;
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
        {viewRejectReason && (
          <RejectDocument
            data={documentId}
            onSuccess={onSuccess}
            onClick={onClick}
            onClose={() => setViewRejectReason(!viewRejectReason)}
          />
        )}
        <div className={styles.document_modal}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6>Document Viewer</h6>
            <span className="d-flex align-items-center gap-2">
              {!isMerchant && !isVerified && !isRejected && (
                <>
                  <button
                    className={styles.document_verify_button}
                    onClick={handleVerifyDocument}
                    disabled={verifyLoading}
                  >
                    {loading ? "Processing..." : "Verify Document"}
                  </button>
                  <button
                    className={styles.document_reject_button}
                    onClick={handleRejectDocument}
                  >
                    Reject Document
                  </button>
                </>
              )}
              <i className="bi bi-x-circle-fill" onClick={onClick}></i>
            </span>
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
const ViewDocument = ({
  id,
  url,
  onClose,
  onSuccess,
  merchant,
  verified,
  rejected,
}) => {
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
          isMerchant={merchant}
          isVerified={verified}
          isRejected={rejected}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default ViewDocument;
