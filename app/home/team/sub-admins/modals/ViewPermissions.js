"use client";
import { updatePermission } from "@/app/formBuilder/admin";
import useGetRequest from "@/app/hooks/useFetch";
import usePutRequest from "@/app/hooks/usePut";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ViewPermissions.module.css";

const PERMISSION_ITEMS = [
  {
    name: "viewSubMerchants",
    label: "View Sub Merchant",
    value: "/home/team/sub-merchants",
  },
  {
    name: "viewMerchant",
    label: "View Merchant",
    value: "/home/user-management/merchants",
  },
  {
    name: "addMerchant",
    label: "Add Merchant",
    value: "/home/user-management/merchants/add-merchant",
  },
  {
    name: "viewResellers",
    label: "View Resellers",
    value: "/home/user-management/resellers",
  },
  {
    name: "addReseller",
    label: "Add Reseller",
    value: "/home/user-management/resellers/add-reseller",
  },
  {
    name: "viewAcquirer",
    label: "View Acquirer",
    value: "/home/user-management/acquirer",
  },
  {
    name: "addAcquirer",
    label: "Add Acquirer",
    value: "/home/user-management/acquirer/add-acquirer",
  },
  {
    name: "viewOrders",
    label: "View Orders",
    value: "/home/transaction/orders",
  },
  {
    name: "viewTransaction",
    label: "View Transaction",
    value: "/home/transaction/payin",
  },
  {
    name: "viewCountry",
    label: "View Country",
    value: "/home/settings/country",
  },
  {
    name: "addCountry",
    label: "Add Country",
    value: "/home/settings/country/add-country",
  },
  {
    name: "addCurrency",
    label: "Add Currency",
    value: "/home/settings/currency/add-currency",
  },
  {
    name: "viewCurrency",
    label: "View Currency",
    value: "/home/settings/currency",
  },
  {
    name: "addPaymentType",
    label: "Add Payment Type",
    value: "/home/settings/payment-type/add-payment-type",
  },
  {
    name: "viewPaymentType",
    label: "View Payment Type",
    value: "/home/settings/payment-type",
  },
  {
    name: "addMopType",
    label: "Add MOP Type",
    value: "/home/settings/mop-type/add-mop-type",
  },
  {
    name: "viewMopType",
    label: "View MOP Type",
    value: "/home/settings/mop-type",
  },
  {
    name: "addSurcharge",
    label: "Add Surcharge",
    value: "/home/settings/surcharge/add-surcharge",
  },
  {
    name: "viewSurcharge",
    label: "View Surcharge",
    value: "/home/settings/surcharge",
  },
  {
    name: "authSettlement",
    label: "Authorized Settlement",
    value: "/home/settlements/auth-settlement",
  },
  {
    name: "saleSettlement",
    label: "Captured Settlement",
    value: "/home/settlements/sale-settlement",
  },
  {
    name: "allSettlement",
    label: "All Settlement",
    value: "/home/settlements/auth-settlements",
  },
  {
    name: "refund",
    label: "Refund",
    value: "/home/settlements/refund",
  },
  {
    name: "viewPaymentLink",
    label: "View Payment Link",
    value: "/home/payment-links",
  },
  {
    name: "addPaymentLink",
    label: "Add Payment Link",
    value: "/home/payment-links/add-payment-link",
  },
  {
    name: "viewRemittance",
    label: "Remittance",
    value: "/home/remittance",
  },
  {
    name: "viewChargeBack",
    label: "Charge Back",
    value: "/home/charge-back",
  },
  {
    name: "fraudPrevention",
    label: "Fraud Prevention",
    value: "/home/fraud-prevention",
  },
];

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
      successMsg(response?.data?.message || "Permission Updated Successfully");
      onSuccess();
      onClick();
    }
  }, [editError, editResponse]);

  if (error)
    return (
      <div className="overlay">
        <h6>Permissions</h6>
        <p className="text-center">
          Error: {error.message || "Something went wrong"}
        </p>
        <div className={styles.actions}>
          <button type="button" onClick={onClick}>
            Close
          </button>
        </div>
      </div>
    );

  if (loading || !response) {
    return (
      <div className="overlay">
        <h6>Permissions</h6>
        <h5 id="username">Name: {data.fullName}</h5>
        <small>ID: {data.userId}</small>
        <div className={styles.loadingWrap}>
          {Array.from({ length: 10 }).map((_, index) => (
            <span key={index} className={styles.shimmer} />
          ))}
        </div>
      </div>
    );
  }

  const permissionKeys = Object.keys(response.data || {});

  return (
    <div className="overlay">
      <h6>Permissions</h6>
      <h5 id="username">Name: {data.fullName}</h5>
      <small>ID: {data.userId}</small>
      <form id="add" onSubmit={handleSubmit}>
        <div className={styles.permGrid}>
          {PERMISSION_ITEMS.map((item) => (
            <label
              key={item.name}
              className={styles.permItem}
              htmlFor={item.name}
            >
              <input
                type="checkbox"
                name={item.name}
                id={item.name}
                value={item.value}
                onChange={handleChange}
                defaultChecked={permissionKeys.includes(item.name)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
        <div className={styles.actions}>
          <button
            type={editLoading ? "button" : "submit"}
            form="add"
            disabled={editLoading}
          >
            {editLoading ? "Processing..." : "Update"}
          </button>
          <button type="button" onClick={onClick}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
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
