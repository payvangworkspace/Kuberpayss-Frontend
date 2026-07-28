import { Fragment } from "react";
import { createPortal } from "react-dom";
import styles from "../page.module.css";
const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const Overlay = ({ name, onClick, data, role }) => {
  return (
    <div className="overlay w-50">
      <h6>Transaction Details</h6>
      <h5 id="username">Merchant Name: &nbsp; {name}</h5>
      <small>Generated Date:&nbsp;{data.createdDate}</small>

      <div className="row">
        <div className="col-12 mb-2">
          <h4>Remittance Details</h4>
          <table className="table table-sm" id={styles.transactionTable}>
            <tbody>
              <tr>
                <td colSpan={3}>UTR</td>
                <td>
                  <b>{data.utr || "N/A"}</b>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>Paymable Ammount</td>
                <td>
                  <b>{data.payableAmount || "N/A"}</b>
                </td>
              </tr>
              <tr>
                <td>Merchant</td>
                <td>
                  <b>{data.merchant.fullName}</b>
                </td>
                <td>Aquirer Code</td>
                <td>
                  <b>{data.acquirerCode || "N/A"}</b>
                </td>
              </tr>
              <tr>
                <td>Currency Code</td>
                <td>
                  <b>{data.currencyCode}</b>
                </td>
                <td>Country Code</td>
                <td>
                  <b>{data.countryCode}</b>
                </td>
              </tr>
              <tr>
                <td>Customer Name</td>
                <td>
                  <b>{data.customerName || "N/A"}</b>
                </td>
                <td>Customer Email</td>
                <td>
                  <b>{data.customerEmail || "N/A"}</b>
                </td>
              </tr>
              <tr>
                <td>Customer Contact No.</td>
                <td>
                  <b>{data.customerContactNumber || "N/A"}</b>
                </td>
                <td>Txn Status</td>
                <td>
                  <b>{data.settlementStatus || "N/A"}</b>
                </td>
              </tr>
              {role && (
                <tr>
                  <td>Txn Date From</td>
                  <td>
                    <b>{data.transactionType || "N/A"}</b>
                  </td>
                  <td>Txn Date To</td>
                  <td>
                    <b>{data.transactionDate || "N/A"}</b>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="d-flex mt-1">
        <button onClick={onClick}>Close</button>
      </div>
    </div>
  );
};

const RemittanceDetails = ({ name, onClose, data, role }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay name={name} onClick={onClose} role={role} data={data} />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default RemittanceDetails;
