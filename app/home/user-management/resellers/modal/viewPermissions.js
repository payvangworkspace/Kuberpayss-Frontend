import { updatePermission } from "@/app/formBuilder/admin";
import useGetRequest from "@/app/hooks/useFetch";
import usePutRequest from "@/app/hooks/usePut";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ data, onClick, onSuccess }) => {
  const { getData, error, response, loading } = useGetRequest();
  useEffect(() => {
    getData(endPoints.settings.getPermission + data.userId);
  }, []);

  const [formData, setFormData] = useState(null);
  useEffect(() => {
    if (response && !error) {
      setFormData(() => updatePermission(data.userId, response.data));
    }
  }, [response, error]);
  // Edit Permission logic goes here

  const {
    response: editResponse,
    error: editError,
    loading: editLoading,
    putData,
  } = usePutRequest(endPoints.settings.updatePermission);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      const updatedPermissions = { ...prev.permissions };
      if (updatedPermissions[name] === value) {
        delete updatedPermissions[name];
      } else {
        updatedPermissions[name] = value;
      }
      return { ...prev, permissions: updatedPermissions };
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    await putData(formData);
  };
  useEffect(() => {
    if (editResponse && !editError) {
      successMsg(response.data.message || "Permission Updated Successfully");
      onSuccess();
      onClick();
    }
  }, [editError, editResponse]);
  if (error)
    return (
      <p className="text-center">
        Error: {error.message || "Something went wrong"}
      </p>
    );
  if (response) {
    return (
      <div className="overlay w-30">
        <h6>Permissions</h6>
        <h5 id="username">Name: {data.fullName}</h5>
        <small>ID:{data.userId}</small>
        <form id="add" className="mt-4" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewOrders"
                id="viewOrders"
                value="/home/transaction/orders"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewOrders"
                )}
              />
              <span className="mx-1">View Orders</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewTransaction"
                id="viewTransaction"
                value="/home/transaction/payin"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewTransaction"
                )}
              />
              <span className="mx-1">View Transaction</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="authSettlement"
                id="authSettlement"
                value="/home/settlements/auth-settlement"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "authSettlement"
                )}
              />
              <span className="mx-1">Auth Settlement</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="saleSettlement"
                id="saleSettlement"
                value="/home/settlements/sale-settlement"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "saleSettlement"
                )}
              />
              <span className="mx-1">Sale Settlement</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="allSettlement"
                id="allSettlement"
                value="/home/settlements/all-allSettlement"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "allSettlement"
                )}
              />
              <span className="mx-1">All Settlement</span>
            </div>
            {/* <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewPaymentLink"
                id="viewPaymentLink"
                value="/home/payment-links"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewPaymentLink"
                )}
              />
              <span className="mx-1">View Payment Link</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewRefund"
                id="viewRefund"
                value="/home/refund"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewRefund"
                )}
              />
              <span className="mx-1">Refund</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewRemittance"
                id="viewRemittance"
                value="/home/remittance"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewRemittance"
                )}
              />
              <span className="mx-1">Remittance</span>
            </div> */}
          </div>
          <div className="d-flex mt-4">
            <button
              type={loading ? "button" : "submit"}
              form="add"
              disabled={loading}
            >
              {loading ? "Processing..." : "Update"}
            </button>
            <span className="mx-2"></span>
            <button onClick={onClick}>Close</button>
          </div>
        </form>
      </div>
    );
  }
};
const ViewPermissions = ({ data, onClose, onSuccess }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay data={data} onClick={onClose} onSuccess={onSuccess} />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default ViewPermissions;
