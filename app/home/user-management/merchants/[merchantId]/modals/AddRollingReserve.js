import useGetRequest from "@/app/hooks/useFetch";
import usePostRequest from "@/app/hooks/usePost";
import usePutRequest from "@/app/hooks/usePut";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { endPoints } from "@/app/services/apiEndpoints";
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import { queryStringWithKeyword } from "@/app/services/queryString";

const Backdrop = ({ onClick }) => {
  return <div className="backdrop" onClick={onClick}></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess }) => {
  const { postData, error, response } = usePostRequest(
    endPoints.rollingReserve.rollingReserve + id,
  );
  const {
    loading,
    error: currencyError,
    response: currencyResponse = [],
    postData: currencyData,
  } = usePostRequest(endPoints.settings.currencyList);

  useEffect(() => {
    currencyData(
      queryStringWithKeyword(0, process.env.NEXT_PUBLIC_PAGINATION_SIZE, ""),
    );
  }, []);
  // form json state data
  const [formData, setFormData] = useState({
    reservePercentage: "",
    holdDays: "",
    currency: "",
  });
  const [selectedCurrency, setSelectedCurrency] = useState({
    id: "",
    name: "Select Currency",
    label: "Select Currency",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCurrencyChange = (idVal, nameVal) => {
    setSelectedCurrency({ id: idVal, name: nameVal, label: nameVal });
    setFormData((prev) => ({ ...prev, currency: nameVal }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // build payload for create/update
    const payload = {
      reservePercentage: parseFloat(formData.reservePercentage) || 0,
      holdDays: parseInt(formData.holdDays) || 0,
      currency: formData.currency || selectedCurrency.name,
    };
    await postData(payload);
  };

  useEffect(() => {
    if (response && !error) {
      onSuccess();
      onClick();
    }
  }, [response, error]);

  return (
    <div className="overlay w-30">
      <h6>Add Rolling Reserve</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>

      <form id="add" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label
              htmlFor="reservePercentage"
              label="Reserve Percentage"
              required={true}
            />
            <input
              type="number"
              step="0.1"
              name="reservePercentage"
              id="reservePercentage"
              placeholder="Enter reserve percentage (e.g. 5.0)"
              className="forminput"
              value={formData.reservePercentage}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 mb-2">
            <Label htmlFor="holdDays" label="Hold Days" required={true} />
            <input
              type="number"
              name="holdDays"
              id="holdDays"
              placeholder="Enter number of hold days (e.g. 120)"
              className="forminput"
              value={formData.holdDays}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 mb-2">
            <Label htmlFor="currency" label="Currency" required={true} />
            <Dropdown
              initialLabel="Select Currency"
              selectedValue={selectedCurrency}
              options={
                currencyResponse?.data?.data ||
                currencyResponse?.data ||
                currencyResponse ||
                []
              }
              onChange={handleCurrencyChange}
              id="currencyId"
              value="currencyCode"
              search={true}
            />
          </div>
        </div>

        <div className="d-flex mt-4 align-items-center gap-3">
          <button type="submit" form="add">
            Add
          </button>
          <button type="button" onClick={onClick}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};
const AddRollingReserve = ({ name, id, onClose, onSuccess }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop"),
      )}
      {createPortal(
        <Overlay
          merchant={name}
          id={id}
          onClick={onClose}
          onSuccess={onSuccess}
        />,
        document.getElementById("overlay"),
      )}
    </Fragment>
  );
};

export default AddRollingReserve;
