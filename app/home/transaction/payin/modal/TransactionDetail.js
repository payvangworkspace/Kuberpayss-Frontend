import { Fragment } from "react";
import { createPortal } from "react-dom";
import styles from "../page.module.css";
import Link from "next/link";
const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const Overlay = ({ name, onClick, data }) => {
  console.log("🚀 ~ Overlay ~ data:", data);
  return (
    <div className="overlay w-50">
      <h6>Transaction Details</h6>
      <h5 id="username">Merchant Name: &nbsp; {name}</h5>
      <small>
        Transaction ID:&nbsp;<b>{data.transactionId}</b>
      </small>
      <small>Generated Date:&nbsp;{data.createdDate}</small>

      <div className="row">
        <div className="col-12 mb-2">
          <h4>Order Details</h4>
          <table className="table table-sm" id={styles.transactionTable}>
            <tbody>
              <tr>
                <td>Order Id</td>
                <td>{data.orderId}</td>
                <td>Order Request Id</td>
                <td>{data.ordRequestId}</td>
              </tr>
              <tr>
                <td>Payable Amount</td>
                <td>
                  <b>{data.payableAmount || 0.0}</b>
                </td>
                <td>Due Amount</td>
                <td>
                  <b>{data.dueAmount || 0.0}</b>
                </td>
              </tr>
              <tr>
                <td>Merchant Charges</td>
                <td>{data.merchantCharges || 0.0}</td>
                <td>Txn Status</td>
                <td>
                  <b>{data.transactionStatus || "NA"}</b>
                </td>
              </tr>
              <tr>
                <td>Txn Type</td>
                <td>{data.transactionType || "NA"}</td>
                <td>Txn Date</td>
                <td>{data.transactionDate || "NA"}</td>
              </tr>
              <tr>
                <td>UTR Number</td>
                <td>{data.utrNumber || "NA"}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-12 mb-2">
          <h4>Customer and Payment Type Details</h4>
          <table className="table table-sm" id={styles.transactionTable}>
            <tbody>
              <tr>
                <td>Payment Type</td>
                <td>{data.paymentType?.paymentTypeName || "NA"}</td>{" "}
                <td>MOP Type</td>
                <td>{data.mopType?.mopTypeName || "NA"}</td>
              </tr>
              <tr>
                <td>Cutomer Name</td>
                <td>{data.customerName || "NA"}</td>
                <td>Customer Email</td>
                <td>{data.customerEmail || "NA"}</td>
              </tr>
              <tr>
                <td>Customer Contact No.</td>
                <td>{data.customerContactNumber || "NA"}</td>
                <td>Country Code</td>
                <td>{data.countryCode || "NA"}</td>
              </tr>
              <tr>
                <td>Currency Code</td>
                <td>{data.currencyCode || "NA"}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-12 mb-2">
          <h4>Acquirer Details</h4>
          <table className="table table-sm" id={styles.transactionTable}>
            <tbody>
              <tr>
                <td>Acquirer Code</td>
                <td>{data.acquirerCode || "NA"}</td>
                <td>Acquirer Order ID</td>
                <td>{data.acquirerOrderId || "NA"}</td>
              </tr>
              <tr>
                <td>Acquirer Txn Status</td>
                <td>{data.acquirerTxnStatus || "NA"}</td>
                <td>Acquirer Txn Date</td>
                <td>{data.acquirerTxnDate || "NA"}</td>
              </tr>
              <tr>
                <td>Acquirer Message</td>
                <td>{data.acquirerMessage || "NA"}</td>
                <td>Acquirer Status Code</td>
                <td>{data.acquirerStatusCode || "NA"}</td>
              </tr>
              <tr>
                <td>Acquirer UPI Link</td>
                <td>{data.acquirerUpiLink || "NA"}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-12 mb-2">
          <h4>URLs and Links</h4>
          <table className="table table-sm" id={styles.transactionTable}>
            <tbody>
              <tr>
                <td>Return URL</td>
                <td colSpan={3}>
                  {data.returnUrl ? (
                    <Link href={data.returnUrl}>{data.returnUrl}</Link>
                  ) : (
                    "NA"
                  )}
                </td>
              </tr>
              <tr>
                <td>Payment Link</td>
                <td colSpan={3}>
                  {data.paymentLink ? (
                    <Link href={data.paymentLink}>{data.paymentLink}</Link>
                  ) : (
                    "NA"
                  )}
                </td>
              </tr>
              <tr>
                <td>UPI Link</td>
                <td colSpan={3}>
                  {data.upiLink ? (
                    <Link href={data.upiLink}>{data.upiLink}</Link>
                  ) : (
                    "NA"
                  )}
                </td>
              </tr>
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

const TransactionDetails = ({ name, onClose, data }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay name={name} onClick={onClose} data={data} />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default TransactionDetails;
