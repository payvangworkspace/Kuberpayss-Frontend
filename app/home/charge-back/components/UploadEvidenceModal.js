import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import usePostRequest from "@/app/hooks/usePost";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess }) => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    file: null,
    description: "",
  });

  const { postData, error, response, loading } = usePostRequest(
    endPoints.chargeBack.uploadEvidence + `${id}` + "/" + "documents"
  );

  // handle input change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const body = new FormData();
    if (formData.file) {
      body.append("file", formData.file);
    }
    body.append("description", formData.description || "");

    await postData(body, true);
  };
  useEffect(() => {
    if (response && !error) {
      if (response.data.status === "success") {
        successMsg(response.data.message);
        setFormData({ file: null });
        formRef.current.reset();
        onSuccess();
        onClick();
      }
    }
  }, [response, error]);

  return (
    <div className="overlay w-30">
      {/* <h5 id="username">Merchant Name: {merchant}</h5> */}
      <form
        id="chargeback"
        onSubmit={handleSubmit}
        className="mt-4"
        ref={formRef}
      >
        <div className="col-12 mb-2">
          <Label htmlFor="file" label="Select File" />
          <input
            type="file"
            name="file"
            id="file"
            className="forminput"
            onChange={handleChange}
          />
        </div>
        <div className="col-12 mb-2">
          <Label htmlFor="description" label="Decription" />
          <textarea
            type="text"
            name="description"
            id="description"
            placeholder="Enter description here"
            className="forminput"
            onChange={handleChange}
          />
        </div>
        <div className="d-flex mt-4">
          <button
            type={loading ? "button" : "submit"}
            form="chargeback"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <span className="mx-2"></span>
          <button type="button" onClick={onClick} disabled={loading}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};
const UploadEvidence = ({ merchant, id, onClick, onSuccess }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClick} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          merchant={merchant}
          id={id}
          onClick={onClick}
          onSuccess={onSuccess}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default UploadEvidence;
