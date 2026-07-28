import { endPoints } from "@/app/services/apiEndpoints";
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import usePostRequest from "@/app/hooks/usePost";
import Label from "@/app/ui/label/Label";
import { successMsg } from "@/app/services/notify";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { validate } from "@/app/validations/forms/UpdateLogoValidations";
const logoTypes = [
  { id: "brandLogo", name: "Brand Logo" },
  { id: "pageLogo", name: "Payment Page Logo" },
  { id: "loginImage", name: "Login Logo" },
];
const Backdrop = ({ onClick }) => {
  return <div className="backdrop" onClick={onClick}></div>;
};
const Overlay = ({ merchant, id, onClick, onSuccess }) => {
  const { postData, error, response } = usePostRequest(
    endPoints.users.account.logo
  );
  const [logoType, setLogoType] = useState({
    id: "",
    name: "Select Logo Type",
  });
  // form json state data
  const [formData, setFormData] = useState();
  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  // handle input change
  const handleChange = (e) => {
    const data = new FormData();
    data.append("userName", id);
    data.append("type", logoType.id);
    data.append(e.target.name, e.target.files[0]);
    setFormData(data);
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = await validate(formData, logoType);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await postData(formData, true);
  };
  useEffect(() => {
    if (response && !error) {
      if (response.data.status === "success") {
        successMsg(response.data.message);
        onSuccess();
        onClick();
      }
    }
  }, [response, error]);
  return (
    <div className="overlay w-30">
      <h6>Update Logo</h6>
      <h5 id="username">Merchant Name: {merchant}</h5>
      <small>ID:{id}</small>
      <form id="add" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-12 mb-2">
            <Label htmlFor="type" label="Select Logo Type" required={true} />
            <Dropdown
              initialLabel="Select Logo Type"
              selectedValue={logoType}
              options={logoTypes}
              onChange={(id, name) => setLogoType({ id, name })}
              id="id"
              value="name"
              all={false}
            />
          </div>
          <div className="col-12 mb-3">
            <Label htmlFor="image" label="Select Image" required={true} />
            <input
              type="file"
              name="image"
              id="image"
              className="forminput"
              required
              autoComplete="on"
              onChange={handleChange}
              accept=".png,.jpeg,.jpg"
            />
            {errors.image && (
              <small className="text-danger"> {errors.image}</small>
            )}
          </div>
        </div>
        <div className="d-flex mt-2">
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
const UpdateLogo = ({ name, id, onClose, onSuccess }) => {
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

export default UpdateLogo;
