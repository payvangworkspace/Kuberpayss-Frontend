import { Fragment, useEffect } from "react";
import { createPortal } from "react-dom";
import usePutRequest from "@/app/hooks/usePut";
import { endPoints } from "@/app/services/apiEndpoints";
import Label from "@/app/ui/label/Label";
import { successMsg } from "@/app/services/notify";
const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ id, onSuccess, onClick, onClose }) => {
  const { response, loading, putData, error } = usePutRequest(
    endPoints.rejectDocument
  );
  async function handleSubmit(event) {
    event.preventDefault();
    await putData({ documentId: id, reason: event.target.reason.value });
  }
  useEffect(() => {
    if (response && !error) {
      successMsg(response.data.message);
      onSuccess();
      onClose();
      onClick();
    }
  }, [response, error]);
  return (
    <div className="overlay w-30">
      <h6>
        <i className="bi bi-exclamation-diamond-fill"></i>Rejection Reason
      </h6>
      <form id="form" onSubmit={handleSubmit}>
        <div className="row mb-2">
          <Label
            htmlFor="reason"
            label="What is the rejection reason??"
            required={true}
          />
          <div className="col-12">
            <textarea
              name="reason"
              id="reason"
              autoComplete="off"
              className="forminput"
              rows={5}
              placeholder="write your summarized reason(max:256 characters)"
            ></textarea>
          </div>
        </div>
      </form>
      <div className="d-flex">
        <button
          type={loading ? "button" : "submit"}
          form="form"
          disabled={loading}
        >
          {loading ? "Processing" : "Submit"}
        </button>
        <span className="mx-2"></span>
        <button onClick={onClick}>Back</button>
      </div>
    </div>
  );
};
export default function RejectDocument({ data, onSuccess, onClose, onClick }) {
  return (
    <Fragment>
      {createPortal(<Backdrop />, document.getElementById("backdrop"))}
      {createPortal(
        <Overlay
          id={data}
          onSuccess={onSuccess}
          onClick={onClose}
          onClose={onClick}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
}
