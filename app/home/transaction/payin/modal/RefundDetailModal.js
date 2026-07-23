"use client";
import { Fragment, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../page.module.css";
import Link from "next/link";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg, errorMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";

const REFUND_FEE = 5;

const TABS = {
  DETAILS: "details",
  FULL: "full",
  PARTIAL: "partial",
};

const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const RefundDetailsContent = ({ data }) => (
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
            <td>{data.paymentType?.paymentTypeName || "NA"}</td>
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
);

const Overlay = ({ name, onClick, data, onRefundSuccess }) => {
  const [activeTab, setActiveTab] = useState(TABS.DETAILS);
  const [fullReason, setFullReason] = useState("");
  const [partialReason, setPartialReason] = useState("");
  const [partialAmount, setPartialAmount] = useState("");
  const [formError, setFormError] = useState("");

  const { postData: postRefund, loading } = usePostRequest();

  const maxTxnAmount = parseFloat(data?.payableAmount) || 0;
  const partialRefundMaxAmount = Math.max(maxTxnAmount - REFUND_FEE, 0);

  const handleFullRefund = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!fullReason.trim()) {
      setFormError("Reason is required for full refund.");
      return;
    }

    try {
      await postRefund(
        {
          orderId: data.orderId,
          reason: fullReason.trim(),
        },
        false,
        false,
        { url: endPoints.payin.fullRefund }
      );
      successMsg("Full refund processed successfully");
      setFullReason("");
      onRefundSuccess?.();
      onClick();
    } catch (err) {
      console.error("Full refund failed:", err);
    }
  };

  const handlePartialRefund = async (e) => {
    e.preventDefault();
    setFormError("");

    const amount = parseFloat(partialAmount);

    if (!partialAmount || Number.isNaN(amount) || amount <= 0) {
      setFormError("Please enter a valid refund amount.");
      return;
    }

    if (amount > partialRefundMaxAmount) {
      setFormError(
        `Maximum amount is transaction amount ($${maxTxnAmount}) - $${REFUND_FEE}.`
      );
      return;
    }

    if (!partialReason.trim()) {
      setFormError("Reason is required for partial refund.");
      return;
    }

    try {
      await postRefund(
        {
          orderId: data.orderId,
          amount,
          reason: partialReason.trim(),
        },
        false,
        false,
        { url: endPoints.payin.partialRefund }
      );
      successMsg("Partial refund processed successfully");
      setPartialAmount("");
      setPartialReason("");
      onRefundSuccess?.();
      onClick();
    } catch (err) {
      console.error("Partial refund failed:", err);
    }
  };

  return (
    <div className="overlay w-50">
      <h6>Refund Details</h6>
      <h5 id="username">Merchant Name: &nbsp; {name}</h5>
      <small>
        Transaction ID:&nbsp;<b>{data.transactionId}</b>
      </small>
      <br />
      <small>Generated Date:&nbsp;{data.createdDate}</small>

      <div className={styles.tabBarWrap}>
        <div className={styles.tabBar} role="tablist" aria-label="Refund tabs">
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === TABS.DETAILS ? styles.tabActive : ""
            }`}
            onClick={() => {
              setActiveTab(TABS.DETAILS);
              setFormError("");
            }}
            role="tab"
            aria-selected={activeTab === TABS.DETAILS}
          >
            Details
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === TABS.FULL ? styles.tabActive : ""
            }`}
            onClick={() => {
              setActiveTab(TABS.FULL);
              setFormError("");
            }}
            role="tab"
            aria-selected={activeTab === TABS.FULL}
          >
            Full Refund
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === TABS.PARTIAL ? styles.tabActive : ""
            }`}
            onClick={() => {
              setActiveTab(TABS.PARTIAL);
              setFormError("");
            }}
            role="tab"
            aria-selected={activeTab === TABS.PARTIAL}
          >
            Partial Refund
          </button>
        </div>
      </div>

      {activeTab === TABS.DETAILS && <RefundDetailsContent data={data} />}

      {activeTab === TABS.FULL && (
        <form onSubmit={handleFullRefund} className="mt-2">
          <div className="mb-2">
            <Label htmlFor="fullOrderId" label="Order ID" required={true} />
            <input
              type="text"
              id="fullOrderId"
              className="forminput"
              value={data.orderId || ""}
              disabled
            />
          </div>
          <div className="mb-2">
            <Label htmlFor="fullReason" label="Reason" required={true} />
            <textarea
              id="fullReason"
              className="forminput"
              rows={3}
              placeholder="Enter reason for full refund"
              value={fullReason}
              onChange={(e) => setFullReason(e.target.value)}
              required
            />
          </div>
          {formError && <small className="text-danger d-block mb-2">{formError}</small>}
          <button type="submit" className="submit" disabled={loading}>
            {loading ? "Processing..." : "Submit Full Refund"}
          </button>
        </form>
      )}

      {activeTab === TABS.PARTIAL && (
        <form onSubmit={handlePartialRefund} className="mt-2">
          <div className="mb-2">
            <Label htmlFor="partialOrderId" label="Order ID" required={true} />
            <input
              type="text"
              id="partialOrderId"
              className="forminput"
              value={data.orderId || ""}
              disabled
            />
          </div>
          <div className="mb-2">
            <Label htmlFor="partialAmount" label="Amount" required={true} />
            <input
              type="number"
              id="partialAmount"
              className="forminput"
              placeholder="Enter refund amount"
              value={partialAmount}
              min="0.01"
              max={partialRefundMaxAmount || undefined}
              step="0.01"
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setPartialAmount("");
                  return;
                }
                const parsed = parseFloat(value);
                if (!Number.isNaN(parsed) && parsed > partialRefundMaxAmount) {
                  errorMsg(
                    `Maximum amount is transaction amount ($${maxTxnAmount}) - $${REFUND_FEE}.`
                  );
                  return;
                }
                setPartialAmount(value);
              }}
              required
            />
            <small className="text-muted d-block">
              {`Note: $${REFUND_FEE} is charged as refund fees. Maximum amount user can enter is transaction amount ($${maxTxnAmount}) - $${REFUND_FEE}.`}
            </small>
          </div>
          <div className="mb-2">
            <Label htmlFor="partialReason" label="Reason" required={true} />
            <textarea
              id="partialReason"
              className="forminput"
              rows={3}
              placeholder="Enter reason for partial refund"
              value={partialReason}
              onChange={(e) => setPartialReason(e.target.value)}
              required
            />
          </div>
          {formError && <small className="text-danger d-block mb-2">{formError}</small>}
          <button type="submit" className="submit" disabled={loading}>
            {loading ? "Processing..." : "Submit Partial refund"}
          </button>
        </form>
      )}

      <div className="d-flex mt-3">
        <button type="button" onClick={onClick}>
          Close
        </button>
      </div>
    </div>
  );
};

const RefundDetailModal = ({ name, onClose, data, onRefundSuccess }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay
          name={name}
          onClick={onClose}
          data={data}
          onRefundSuccess={onRefundSuccess}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default RefundDetailModal;
