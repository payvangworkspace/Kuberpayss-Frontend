import { countryMapping } from "@/app/formBuilder/mapping";
import { endPoints } from "@/app/services/apiEndpoints";
import { queryStringWithKeyword } from "@/app/services/queryString";

import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import usePostRequest from "@/app/hooks/usePost";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/AddCountryValidation";
const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess }) => {
  // handling search keyword
  const [keyword, setKeyword] = useState({ countryId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };

  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  // logic to fetch allcurrency
  const { response: countries = [], postData: getAllCountry } = usePostRequest(
    endPoints.settings.countryList
  );
  const [country, setCountry] = useState({ id: "", name: "Select Country" });
  useEffect(() => {
    getAllCountry(queryStringWithKeyword(0, 25, keyword.countryId));
  }, [keyword.countryId]);

  const { postData, response, error } = usePostRequest(
    endPoints.mapping.country
  );
  const handleCurrencyDropDownChange = (id, name) => {
    setCountry({ id, name });
    setErrors({});
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // const validationErrors = validate(country);
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }
    const formdata = await countryMapping(id, country);
    await postData(formdata);
  };
  useEffect(() => {
    if (response && !error) {
      setCountry({ id: "", name: "Select Currency" });
      onSuccess();
      onClick();
    }
  }, [response, error]);
  if (countries)
    return (
      <div className="overlay w-30">
        <h6>Add Country</h6>
        <h5 id="username">Merchant Name: {merchant}</h5>
        <small>ID:{id}</small>
        <form onSubmit={handleSubmit}>
          <div className="row mt-3">
            <div className="col-12 mb-2">
              <Label htmlFor="country" label="Country" required={true} />
              <Dropdown
                initialLabel="Select Country"
                selectedValue={country}
                options={countries.data.data}
                onChange={handleCurrencyDropDownChange}
                id="countryId"
                value="countryName"
                search={true}
                onSearch={handleKeyword}
              />
              {errors.countryId && (
  <small className="text-danger">
    <span className="text-danger"> *</span> {errors.countryId}
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
const AddCountry = ({ name, id, onClose, onSuccess }) => {
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

export default AddCountry;
