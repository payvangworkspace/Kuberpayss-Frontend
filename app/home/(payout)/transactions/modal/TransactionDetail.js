import { Fragment, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../page.module.css";
import Link from "next/link";
import useGetRequest from "@/app/hooks/useFetch";
const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const Overlay = ({ name, onClick, data, isAdmin }) => {

  const { getData, loading, error, response } = useGetRequest();

  useEffect(() => {
    //console.log('Transaction data is data is ---'+JSON.stringify(data));
    if (data && data.beneficiaryId) {

      getData(`/beneficiaries/${data.beneficiaryId}`);
    }
  }, [data]);


  

  return (
    <div className="overlay w-50">
      <h6>Transaction Details</h6>
      <h5 id="username">Merchant : {data?.userId}</h5>
      <small>
        Currency:&nbsp;<b>{data.currencyCode}</b>
      </small>
      <small>Country:&nbsp;{data.countryCode}</small>
      <small>
        Created On: {data.createdDate}
        </small>

      <div className="row">
        <div className="col-12 mb-2">
          <h4>Order Details</h4>
          <table className="table table-sm" id={styles.transactionTable}>
            <tbody>
              <tr>
                <td>Order Id</td>
                <td>{data.orderId}</td>
                <td>Transaction Id</td>
                <td>{data.transactionPayoutId}</td>
              </tr>
              <tr>
                <td>Amount</td>
                <td>
                  <b>{data.amount || 0.0}</b>
                </td>
                <td>Transfer Mode</td>
                <td>
                  <b>{data.transferModeCode || 0.0}</b>
                </td>
              </tr>
              <tr>
                <td>Txn Status</td>
                <td>{data.transactionStatus || 0.0}</td>
                <td>Txn Type</td>
                <td>
                  <b>{data.transferType || "NA"}</b>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>Txn Status Message</td>
                <td colSpan={2}>{data.transactionType || "NA"}</td>
              </tr>
              <tr>
                <td>UTR Number</td>
                <td>{data.bankUtr || "NA"}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        {!loading && !error && response?.data && (
          <div className="col-12 mb-2">
            <h4>Beneficiary Details</h4>
            <table className="table table-sm" id={styles.transactionTable}>
              <tbody>
                <tr>
                  <td>Beneficiary Name</td>
                  <td>{response?.data?.beneficiaryName || "NA"}</td>{" "}
                  <td>Account Number</td>
                  <td>{response?.data?.accountNumber || "NA"}</td>
                </tr>

                <tr>
                  <td>Beneficiary Contact No.</td>
                  <td>{response?.data?.beneficiaryContactNumber || "NA"}</td>
                  <td>Beneficiary Email</td>
                  <td>{response?.data?.beneficiaryEmail || "NA"}</td>
                </tr>
                <tr>
                  <td>Currency Code</td>
                  <td>{response?.data?.currency?.currencyCode || "NA"}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {isAdmin && (
          <div className="col-12 mb-2">
            <h4>Acquirer Details</h4>
            <table className="table table-sm" id={styles.transactionTable}>
              <tbody>
                <tr>
                  <td>Acquirer Name</td>
                  <td>{data.acquirerCode || "NA"}</td>
                  <td>Acquirer Code</td>
                  <td>{data.acquirerOrderId || "NA"}</td>
                </tr>
                <tr>
                  <td>Acquirer Status</td>
                  <td>{data.acquirerTxnStatus || "NA"}</td>
                  <td>Acquirer Status Code</td>
                  <td>{data.acquirerTxnDate || "NA"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="d-flex mt-1">
        <button onClick={onClick}>Close</button>
      </div>
    </div>
  );
};

const TransactionDetails = ({ name, onClose, data, isAdmin }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay name={name} onClick={onClose} data={data} isAdmin={isAdmin} />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default TransactionDetails;
