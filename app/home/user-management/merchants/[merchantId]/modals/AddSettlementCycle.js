import { bankAccount } from "@/app/formBuilder/account";
import { settlementCycle } from "@/app/formBuilder/settlementCycle";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";
import { validate } from "@/app/validations/forms/AddSettlementvalidation";
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Backdrop = ({ onClick }) => {
  return <div className="backdrop" onClick={onClick}></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess }) => {
  const { postData, error, response } = usePostRequest(
    endPoints.mapping.settlementCycle
  );
  // form json state data
  const [formData, setFormData] = useState(() => settlementCycle(id));
  // State to handle errors on form submission
  //   const [errors, setErrors] = useState({});
  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // const validationErrors = validate(formData);
    //     if (Object.keys(validationErrors).length > 0) {
    //       setErrors(validationErrors);
    //       return;
    //     }
    await postData(formData);
  };
  useEffect(() => {
    if (response && !error) {
      onSuccess();
      onClick();
    }
  }, [response, error]);
  return (
    <div className="overlay w-30">
      <h6>Add Settlement Cycle</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>

      <div className="d-flex flex-wrap gap-4 mt-3 mb-2">
        <span className="d-flex  align-items-center">
          <input
            type="radio"
            name="settlementType"
            onChange={handleChange}
            value="D"
            defaultChecked
          />
          <label htmlFor="">Daily</label>
        </span>
      </div>

      <form id="add" onSubmit={handleSubmit}>
        <>
          {formData.settlementType === "D" && (
            <>
              <div className="col-12 mb-2">
                <Label htmlFor="day" label="Day" required={true}></Label>
                <select
                  name="day"
                  id="day"
                  className="forminput"
                  defaultValue=""
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select day
                  </option>
                  <option value="1">T+1</option>
                  <option value="2">T+2</option>
                  <option value="3">T+3</option>
                  <option value="4">T+4</option>
                  <option value="5">T+5</option>
                  <option value="6">T+6</option>
                  <option value="7">T+7</option>
                </select>
              </div>

              <div className="col-12 mb-3">
                <Label
                  htmlFor="settlementTime"
                  label=" Settlement time"
                  required={true}
                />
                <select
                  name="settlementTime"
                  id="settlementTime"
                  defaultValue=""
                  className="forminput"
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select time
                  </option>
                  <option value="00:00">00:00</option>
                  <option value="01:00">01:00</option>
                  <option value="02:00">02:00</option>
                  <option value="03:00">03:00</option>
                  <option value="04:00">04:00</option>
                  <option value="05:00">05:00</option>
                  <option value="06:00">06:00</option>
                  <option value="07:00">07:00</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                  <option value="22:00">22:00</option>
                  <option value="23:00">23:00</option>
                </select>
              </div>
            </>
          )}
        </>

        <div className="d-flex mt-4">
          <button type="submit" form="add">
            Add
          </button>
          <span className="mx-2"></span>
          <button onClick={onClick}>Close</button>
        </div>
      </form>
    </div>
  );
};
const AddSettlementCycle = ({ name, id, onClose, onSuccess }) => {
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

export default AddSettlementCycle;
