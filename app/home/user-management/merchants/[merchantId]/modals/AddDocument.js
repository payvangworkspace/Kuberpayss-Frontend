"use client";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { Fragment, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import { documentFormData } from "@/app/formBuilder/uploads";
const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ documentType, merchant, id, onClick, onSuccess }) => {
  const formRef = useRef(null);
  const { postData, error, response } = usePostRequest(endPoints.document);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = await documentFormData(
      id,
      documentType,
      event.target.file.files[0]
    );
    await postData(formData, true);
  };
  useEffect(() => {
    if (response && !error) {
      formRef.current.reset();
      onSuccess();
      onClick();
    }
  }, [response, error]);
  return (
    <div className="overlay w-30">
      <h6>Upload {documentType}</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>
      <form id="add" onSubmit={handleSubmit} ref={formRef}>
        <div className="row mt-3">
          <div className="col-12">
            <Label label="Upload file" htmlFor="file" required={true} />
            <input
              type="file"
              name="file"
              id="file"
              className="text-sm"
              required
            />
          </div>
        </div>
        <div className="d-flex mt-4">
          <button type="submit" form="add">
            Upload
          </button>
          <span className="mx-2"></span>
          <button onClick={onClick}>Close</button>
        </div>
      </form>
    </div>
  );
};
const AddDocument = ({ type, name, id, onClose, onSuccess }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          documentType={type}
          merchant={name}
          id={id}
          onClick={onClose}
          onSuccess={onSuccess}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default AddDocument;
