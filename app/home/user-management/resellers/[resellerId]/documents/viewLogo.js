import useGetRequest from "@/app/hooks/useFetch";
import { Fragment, useEffect, useState } from "react";
import styles from "./Document.module.css";
import { createPortal } from "react-dom";
import { endPoints } from "@/app/services/apiEndpoints";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const Overlay = ({ id, onClick, logoId }) => {
  const { getData, loading, error, response } = useGetRequest();
  const [imgUrl, setImgUrl] = useState();
  const getImage = async () => {
    await getData(endPoints.logo + logoId + "/" + id, true);
  };
  useEffect(() => {
    getImage();
  }, []);

  useEffect(() => {
    if (response && !error) {
      const fetchImage = async () => {
        const blob = await imageUrlToBytesClient(response);
        const blobUrl = URL.createObjectURL(blob);
        setImgUrl(blobUrl);
      };
      fetchImage();
    }
  }, [response, error]);

  async function imageUrlToBytesClient(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Error fetching or converting image:", error);
      return null;
    }
  }

  if (loading) {
    return (
      <div className={styles.logo_modal}>
        <h6>Logo Viewer</h6>
        <p className="text-center">Please while fetching your logo</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.logo_modal}>
        <h6>Logo Viewer</h6>
        <p className="text-center">Error Loading Logo</p>
      </div>
    );
  }

  if (response) {
    return (
      <div className={styles.logo_modal}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6>Logo Viewer</h6>
          <span className="d-flex align-items-center gap-2">
            <i className="bi bi-x-circle-fill" onClick={onClick}></i>
          </span>
        </div>
        <div className="d-flex justify-content-center align-items-center w-100">
          <img
            src={imgUrl}
            alt="Logo"
            className="img-fluid"
            style={{
              width: "50vh",
              height: "40vh",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    );
  }
};
const ViewLogo = ({ merchantId, onClose, logoId }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay id={merchantId} logoId={logoId} onClick={onClose} />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default ViewLogo;
