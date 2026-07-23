import usePostRequest from "@/app/hooks/usePost";
import styles from "./UtilityResponseModel.module.css";
import { Fragment, useEffect } from "react";
import { createPortal } from "react-dom";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg } from "@/app/services/notify";

const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({
  onClick,
  data,
  selectedMerchant,
  type,
  selectedTransferModeRef,
}) => {
  const { postData, error, response, loading } = usePostRequest(
    endPoints.payout.notifyElectricity
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const date = new Date();
    const Proccdate = `${String(date.getDate()).padStart(2, "0")}${String(
      date.getMonth() + 1
    ).padStart(2, "0")}${date.getFullYear()}`;
    // Create data to send
    const dataToSend = {
      appKey: selectedMerchant.id,
      transactionRef: selectedTransferModeRef.id,
      ProccDate: Proccdate,
      account: data?.account,
      Location: "Jinja",
      serviceProviderID: type,
      DrAccount: "50000012001",
      RemitName: data?.beneficiaryName,
      Amount: data?.billAmount,
      Mssdin: data?.contactNumber,
    };
    await postData(dataToSend);
  }

  useEffect(() => {
    if (response && !error) {
      if (response.data.status === "success") {
        successMsg(response.data.data.message);
        onClick();
      }
    }
  }, [response, error]);

  return (
    <div className={styles.logo_modal}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6>Payment Info</h6>
        <span className="d-flex align-items-center gap-2">
          <i className="bi bi-x-circle-fill" onClick={onClick}></i>
        </span>
      </div>

      <div className="mb-4">
        <div className="row mb-3">
          <div className="col-5">
            <strong>Beneficiary Name:</strong>
          </div>
          <div className="col-7">{data?.beneficiaryName || "N/A"}</div>
        </div>

        <div className="row mb-3">
          <div className="col-5">
            <strong>Bill Amount:</strong>
          </div>
          <div className="col-7">₹{data?.billAmount || "0.00"}</div>
        </div>

        <div className="row mb-3">
          <div className="col-5">
            <strong>Account:</strong>
          </div>
          <div className="col-7">{data?.account || "N/A"}</div>
        </div>

        <div className="row mb-3">
          <div className="col-5">
            <strong>Reason for Payment:</strong>
          </div>
          <div className="col-7">{data?.reasonForPayment || "N/A"}</div>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3">
        <button className="reset" onClick={onClick}>
          Cancel
        </button>
        {/* {data?.responsecode === "A" && ( */}
        <button className="submit" onClick={handleSubmit}>
          {loading ? "Paying" : "Pay"}
        </button>
        {/* )} */}
      </div>
    </div>
  );
};
const ElectricityResponse = ({
  onClose,
  response,
  selectedMerchant,
  type,
  selectedTransferModeRef,
}) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          onClick={onClose}
          data={response}
          selectedMerchant={selectedMerchant}
          type={type}
          selectedTransferModeRef={selectedTransferModeRef}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default ElectricityResponse;
