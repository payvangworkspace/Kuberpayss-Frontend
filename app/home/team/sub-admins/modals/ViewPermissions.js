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
  console.log("🚀 ~ Overlay ~ response:", response);
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
      <div className="overlay">
        <p className="text-center">
          Error: {error.message || "Something went wrong"}
        </p>
      </div>
    );
  if (response) {
    return (
      <div className="overlay">
        <h6>Permissions</h6>
        <h5 id="username">Name: {data.fullName}</h5>
        <small>ID:{data.userId}</small>
        <form id="add" className="mt-4" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewSubMerchants"
                id="viewSubMerchants"
                value="/home/team/sub-merchants"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewSubMerchants"
                )}
              />
              <span className="mx-1">View Sub Merchant</span>
            </div>{" "}
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewMerchant"
                id="viewMerchant"
                value="/home/user-management/merchants"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewMerchant"
                )}
              />
              <span className="mx-1">View Merchant</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addMerchant"
                id="addMerchant"
                value="/home/user-management/merchants/add-merchant"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "addMerchant"
                )}
              />
              <span className="mx-1">Add Merchant</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewResellers"
                id="viewResellers"
                value="/home/user-management/resellers"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewResellers"
                )}
              />
              <span className="mx-1">View Resellers</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addReseller"
                id="addReseller"
                value="/home/user-management/resellers/add-reseller"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "addReseller"
                )}
              />
              <span className="mx-1">Add Reseller</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewAcquirer"
                id="viewAcquirer"
                value="/home/user-management/acquirer"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewAcquirer"
                )}
              />
              <span className="mx-1">View Acquirer</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addAcquirer"
                id="addAcquirer"
                value="/home/user-management/acquirer/add-acquirer"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "addAcquirer"
                )}
              />
              <span className="mx-1">Add Acquirer</span>
            </div>
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
                name="viewCountry"
                id="viewCountry"
                value="/home/settings/country"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewCountry"
                )}
              />
              <span className="mx-1">View Country</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addCountry"
                id="addCountry"
                value="/home/settings/country/add-country"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "addCountry"
                )}
              />
              <span className="mx-1">Add Country</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addCurrency"
                id="addCurrency"
                value="/home/settings/currency/add-currency"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "addCurrency"
                )}
              />
              <span className="mx-1">Add Currency</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewCurrency"
                id="viewCurrency"
                value="/home/settings/currency"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewCurrency"
                )}
              />
              <span className="mx-1">View Currency</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addPaymentType"
                id="addPaymentType"
                value="/home/settings/payment-type/add-payment-type"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "addPaymentType"
                )}
              />
              <span className="mx-1">Add Payment Type</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewPaymentType"
                id="viewPaymentType"
                value="/home/settings/payment-type"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewPaymentType"
                )}
              />
              <span className="mx-1">View Payment Type</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addMopType"
                id="addMopType"
                value="/home/settings/mop-type/add-mop-type"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "addMopType"
                )}
              />
              <span className="mx-1">Add MOP Type</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewMopType"
                id="viewMopType"
                value="/home/settings/mop-type"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewMopType"
                )}
              />
              <span className="mx-1">View MOP Type</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addSurcharge"
                id="addSurcharge"
                value="/home/settings/surcharge/add-surcharge"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "addSurcharge"
                )}
              />
              <span className="mx-1">Add Surcharge</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewSurcharge"
                id="viewSurcharge"
                value="/home/settings/surcharge"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewSurcharge"
                )}
              />
              <span className="mx-1">View Surcharge</span>
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
              <span className="mx-1">Authorized Settlement</span>
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
              <span className="mx-1">Captured Settlement</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="allSettlement"
                id="allSettlement"
                value="/home/settlements/auth-settlements"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "allSettlement"
                )}
              />
              <span className="mx-1">All Settlement</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2 flex-wrap">
              <input
                type="checkbox"
                name="refund"
                id="refund"
                value="/home/settlements/refund"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes("refund")}
              />
              <span className="mx-1">Refund</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2 flex-wrap">
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
            <div className="col-md-6 col-sm-12 mb-2 flex-wrap">
              <input
                type="checkbox"
                name="addPaymentLink"
                id="addPaymentLink"
                value="/home/payment-links/add-payment-link"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "addPaymentLink"
                )}
              />
              <span className="mx-1">Add Payment Link</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2 flex-wrap">
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
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewChargeBack"
                id="viewChargeBack"
                value="/home/charge-back"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "viewChargeBack"
                )}
              />
              <span className="mx-1">Charge Back</span>
            </div>
            <div className="col-md-6 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="fraudPrevention"
                id="fraudPrevention"
                value="/home/fraud-prevention"
                onChange={handleChange}
                defaultChecked={Object.keys(response.data).includes(
                  "fraudPrevention"
                )}
              />
              <span className="mx-1">Fraud Prevention</span>
            </div>
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
