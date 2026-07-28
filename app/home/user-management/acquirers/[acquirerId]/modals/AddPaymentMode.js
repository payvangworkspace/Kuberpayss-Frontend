import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { mapPaymentTypeAndMop } from "@/app/formBuilder/mapping";
import usePostRequest from "@/app/hooks/usePost";
const Backdrop = ({ onClick }) => {
  return <div className="backdrop" onClick={onClick}></div>;
};
const Overlay = ({ acquirer, id, onClick, onSuccess }) => {
  const { response: paymentTypes, getData: getAllPaymentTypes } =
    useGetRequest();
  const { response: mopTypes, getData: getAllMopTypes } = useGetRequest();
  useEffect(() => {
    getAllPaymentTypes(endPoints.settings.paymentType);
    getAllMopTypes(endPoints.settings.mop);
  }, []);
  const [paymentType, setPaymentType] = useState({
    id: "",
    name: "Select Payment Type",
  });
  const [modeOfPayment, setModeOfPayment] = useState({
    id: "",
    name: "Select Mode of Payment",
  });

  const { loading, postData, error, response } = usePostRequest(
    endPoints.mapping.all
  );
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = await mapPaymentTypeAndMop(
      id,
      paymentType.id,
      modeOfPayment.id
    );
    await postData(formData);
  };
  useEffect(() => {
    if (response && !error) {
      onSuccess();
      setModeOfPayment({ id: "", name: "Select Mode of Payment" });
      setPaymentType({ id: "", name: "Select Payment Type" });
      onClick();
    }
  }, [response, error]);

  if (paymentType && mopTypes) {
    return (
      <div className="overlay w-30">
        <h6>Add Payment Mode</h6>
        <label htmlFor="username">Aquirer Name:{acquirer}</label>
        <h5 id="username">ID:{id}</h5>
        <form id="add" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 mb-2">
              <Label htmlFor="payment" label="Payment Type" required={true} />
              <Dropdown
                initialLabel="Select Payment Type"
                selectedValue={paymentType}
                options={paymentTypes?.data || []}
                onChange={(id, name) => setPaymentType({ id, name })}
                id="paymentTypeId"
                value="paymentTypeName"
              />
            </div>
            <div className="col-12 mb-3">
              <Label htmlFor="mode" label="Mode of Payment" required={true} />
              <Dropdown
                initialLabel="Select Mode of Payment"
                selectedValue={modeOfPayment}
                options={mopTypes?.data || []}
                onChange={(id, name) => setModeOfPayment({ id, name })}
                id="mopTypeId"
                value="mopTypeName"
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
const AddPaymentMode = ({ name, id, onClose, onSuccess }) => {
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

export default AddPaymentMode;
