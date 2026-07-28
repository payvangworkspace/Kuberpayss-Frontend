import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import {
  mapPaymentTypeAndMop,
  transferModeMapping,
} from "@/app/formBuilder/mapping";
import usePostRequest from "@/app/hooks/usePost";
const Backdrop = ({ onClick }) => {
  return <div className="backdrop" onClick={onClick}></div>;
};
const Overlay = ({ acquirer, id, onClick, onSuccess }) => {
  const { response: transferModes, postData: getAllTransferModes } =
    usePostRequest(endPoints.settings.getTransferMode);

  useEffect(() => {
    getAllTransferModes({
      start: 0,
      size: 100,
    });
  }, []);

  const [transferMode, setTransferMode] = useState({
    id: "",
    name: "Select Transfer Mode",
  });
  console.log("🚀 ~ Overlay ~ transferMode:", transferMode)

  const { loading, postData, error, response } = usePostRequest(
    endPoints.mapping.addTransferMode
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = await transferModeMapping(id, transferMode.id);
    await postData(formData);
  };

  useEffect(() => {
    if (response && !error) {
      onSuccess();
      setTransferMode({
        id: "",
        name: "Select Transfer Mode",
      });
      onClick();
    }
  }, [response, error]);

  if (transferModes) {
    return (
      <div className="overlay w-30">
        <h6>Add Payment Mode</h6>
        <label htmlFor="username">Transfer Mode:{acquirer}</label>
        <h5 id="username">ID:{id}</h5>
        <form id="add" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 mb-2">
              <Label
                htmlFor="transferMode"
                label="Payment Type"
                required={true}
              />
              <Dropdown
                initialLabel="Select Transfer Mode"
                selectedValue={transferMode}
                options={transferModes?.data.data || []}
                onChange={(id, name) => setTransferMode({ id, name })}
                id="transferModeCode"
                value="transferModeName"
              />
            </div>
          </div>
          <div className="d-flex mt-2">
            <button
              type={loading ? "button" : "submit"}
              form="add"
              disabled={loading}
            >
              {loading ? "processing.." : "Add"}
            </button>
            <span className="mx-2"></span>
            <button type="button" onClick={onClick}>
              Close
            </button>
          </div>
        </form>
      </div>
    );
  }
};
const AddTransferMode = ({ name, id, onClose, onSuccess }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          acquirer={name}
          id={id}
          onClick={onClose}
          onSuccess={onSuccess}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default AddTransferMode;
