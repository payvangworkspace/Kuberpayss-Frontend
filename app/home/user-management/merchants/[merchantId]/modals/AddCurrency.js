import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import { endPoints } from "@/app/services/apiEndpoints";
import usePostRequest from "@/app/hooks/usePost";

import { currencyMapping } from "@/app/formBuilder/mapping";
import { queryStringWithKeyword } from "@/app/services/queryString";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { validate } from "@/app/validations/forms/AddCurrencyValidations";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess }) => {
  // handling search keyword
  const [keyword, setKeyword] = useState({ currencyId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };

  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  // logic to fetch allcurrency
  const { response: currencies = [], postData: getAllCurrency } =
    usePostRequest(endPoints.settings.currencyList);
  const [currency, setCurrency] = useState({ id: "", name: "Select Currency" });
  useEffect(() => {
    getAllCurrency(queryStringWithKeyword(0, 25, keyword.currencyId));
  }, [keyword.currencyId]);

  const { postData, response, error } = usePostRequest(
    endPoints.mapping.currency
  );
  const handleCurrencyDropDownChange = (id, name) => {
    setCurrency({ id, name });
    setErrors({});
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(currency.id);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const formdata = await currencyMapping(id, currency);
    await postData(formdata);
  };
  useEffect(() => {
    if (response && !error) {
      setCurrency({ id: "", name: "Select Currency" });
      onSuccess();
      onClick();
    }
  }, [response, error]);
  if (currencies)
    return (
      <div className="overlay w-30">
        <h6>Add Currency</h6>
        <h5 id="username">Merchant Name: {merchant}</h5>
        <small>ID:{id}</small>
        <form onSubmit={handleSubmit}>
          <div className="row mt-3">
            <div className="col-12 mb-2">
              <Label htmlFor="currency" label="Currency" required={true} />
              <Dropdown
                initialLabel="Select Currency"
                selectedValue={currency}
                options={currencies.data.data}
                onChange={handleCurrencyDropDownChange}
                id="currencyId"
                value="currencyName"
                search={true}
                onSearch={handleKeyword}
              />
              {errors.empty && (
                <small className="">
                  <span className="text-danger"> *</span>
                  {errors.empty}
                </small>
              )}
            </div>
          </div>
          <div className="d-flex mt-2">
            <button type="submit">Add</button>
            <span className="mx-2"></span>
            <button onClick={onClick}>Close</button>
          </div>
        </form>
      </div>
    );
};
const AddCurrency = ({ name, id, onClose, onSuccess }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
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

export default AddCurrency;
