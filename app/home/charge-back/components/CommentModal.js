import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import usePostRequest from "@/app/hooks/usePost";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess, type }) => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    comment: "",
  });

  const { postData, error, response, loading } = usePostRequest(
    endPoints.chargeBack.getAllComments + `${id}` + "/" + `${type}`
  );

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const body = {
      comment: formData.comment || "",
    };

    await postData(body);
  };
  useEffect(() => {
    if (response && !error) {
      if (response.data.status === "success") {
        successMsg(response.data.message);
        setFormData({ comment: "" });
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
          <Label htmlFor="comment" label="Comment" />
          <input
            type="text"
            name="comment"
            id="comment"
            placeholder="Enter comment here"
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
const Comment = ({ merchant, id, onClick, onSuccess, type }) => {
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
          type={type}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default Comment;
