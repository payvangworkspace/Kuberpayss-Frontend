import { Fragment, useEffect, useState } from "react";
import styles from "../page.module.css";
import { createPortal } from "react-dom";
import Label from "@/app/ui/label/Label";
import { addWithValue } from "@/app/formBuilder/fraudPrevention";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { validate } from "@/app/validations/forms/AddCurrencyValidation";
const Backdrop = ({ onClick }) => {
  return <div className="backdrop" onClick={onClick}></div>;
};
const Overlay = ({ merchant, type, id, onClick, onSuccess }) => {
  // Logic to fetch country
  // handling search keyword
  const [keyword, setKeyword] = useState({ currencyId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };
  const [currency, setCurrency] = useState({ id: "", name: "Select Currency" });

  const { response: currencies = [], postData: getAllCurrency } =
    usePostRequest(endPoints.settings.currencyList);

  useEffect(() => {
    getAllCurrency(
      queryStringWithKeyword(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword.currencyId
      )
    );
  }, [keyword.currencyId]);

  const handleCurrencyDropDownChange = (id, name) => {
    setCurrency({ id, name });
    console.log("currency", id, name);
    
    setFormData((prev) => ({
      ...prev,
      value: currencies.data.data.find((item) => item.currencyId === id)?.currencyCode,
    }));
    setErrors({});
  };
  // Country logic ends here

  const { postData, error, response, loading } = usePostRequest(
    endPoints.fraudPrevention.addNew
  );
  // form json state data
  const [formData, setFormData] = useState(() => addWithValue(id, type));
  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  // handle input change

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await postData(formData);
  };
  useEffect(() => {
    if (response && !error) {
      onSuccess();
      onClick();
      setFormData(() => addWithValue(id, type));
    }
  }, [response, error]);
  if (currencies)
    return (
      <div className={styles.modal}>
        <h6 className={styles.modalTitle}>Add Currency to Block</h6>
        <div className={styles.merchantMeta}>
        <span className={styles.merchantMetaLabel}>Merchant</span>
        <span className={styles.merchantMetaValue}>{merchant}</span>
        <span className={styles.merchantMetaLabel}>Merchant ID</span>
        <span className={styles.merchantMetaValue}>{id}</span>
      </div>
        <form id="add" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 mb-2">
              <Label htmlFor="value" label="Select Currency" required={true}/>
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
              {errors.value && (
                <small className="text-danger">
                  <span className="text-danger"> *</span>
                  {errors.value}
                </small>
              )}
            </div>
          </div>
          <div className={styles.drawerActions}>
          <button
            type={loading ? "button" : "submit"}
            form="add"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Processing..." : "Add"}
          </button>
          <button type="button" className={styles.closeBtn} onClick={onClick}>
            Close
          </button>
        </div>
        </form>
      </div>
    );
};
const AddCurrency = ({ merchant, type, id, onClose, onSuccess }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          merchant={merchant}
          id={id}
          type={type}
          onClick={onClose}
          onSuccess={onSuccess}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default AddCurrency;
