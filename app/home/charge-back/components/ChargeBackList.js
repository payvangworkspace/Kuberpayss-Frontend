"use client";
import Table from "@/app/ui/table/Table";
import React, { useEffect, useState } from "react";
import { headers } from "./Column";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import { queryStringWithKeyword } from "@/app/services/queryString";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { loadingMsg } from "@/app/utils/message";
import AcceptFightChargeback from "./AcceptFightChargebackModal";
import Link from "next/link";
import Comment from "./CommentModal";
import { Eye, MessageCircleIcon, Upload } from "lucide-react";
import UpdateResolution from "./UpdateResolutionModal";
import UpdateStatus from "./UpdateStatus";
import CloseChargeBack from "./CloseChargebackModal";
import UploadEvidence from "./UploadEvidenceModal";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";

const getStatusClass = (status) => {
  switch (String(status || "").trim().toUpperCase()) {
    case "WON":
    case "ACCEPTED":
      return `${styles.statusBadge} ${styles.statusWon}`;
    case "LOST":
    case "CLOSED":
      return `${styles.statusBadge} ${styles.statusLost}`;
    case "IN_PROGRESS":
      return `${styles.statusBadge} ${styles.statusInProgress}`;
    case "REPRESENTED":
      return `${styles.statusBadge} ${styles.statusRepresented}`;
    case "PENDING":
      return `${styles.statusBadge} ${styles.statusPending}`;
    default:
      return styles.statusBadge;
  }
};

const BodyMapping = ({
  data = [],
  loading = true,
  merchant,
  handleViewModel,
  admin,
}) => {
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={8}>
            <div className={tableStyles.emptyMessage}>
              {loadingMsg("charge back")}
            </div>
          </td>
        </tr>
      ) : data && data.length > 0 ? (
        data.map((item) => (
          <tr key={item.chargebackId}>
            <td>{item.chargebackId || "NA"}</td>
            <td>{item.transactionId || "NA"}</td>
            <td>{item.chargebackAmount || "NA"}</td>
            <td>{item.chargebackDate || "NA"}</td>
            <td>{item.chargebackType}</td>
            <td>{item.merchantName || "NA"}</td>
            <td>
              <span className={getStatusClass(item.status)}>
                {item.status || "NA"}
              </span>
            </td>
            <td>
              <span className={styles.actionGroup}>
                {merchant &&
                  item.status !== "WON" &&
                  item.status !== "LOST" &&
                  item.status !== "CLOSED" &&
                  item.status !== "REPRESENTED" &&
                  item.status !== "ACCEPTED" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleViewModel(item.chargebackId, "accept")
                        }
                        className={`${styles.actionBtn} ${styles.actionBtnSuccess}`}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleViewModel(item.chargebackId, "represent")
                        }
                        type="button"
                        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                      >
                        Fight
                      </button>
                    </>
                  )}
                {admin && item.status === "REPRESENTED" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleViewModel(item.chargebackId, "status")
                    }
                    className={styles.actionBtn}
                  >
                    Start
                  </button>
                )}
                {admin && item.status === "IN_PROGRESS" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleViewModel(item.chargebackId, "resolution")
                    }
                    className={styles.actionBtn}
                  >
                    Update
                  </button>
                )}
                {admin &&
                  (item.status === "WON" ||
                    item.status === "LOST" ||
                    item.status === "ACCEPTED") &&
                  item.status !== "CLOSED" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleViewModel(item.chargebackId, "close")
                      }
                      className={styles.actionBtn}
                    >
                      Close
                    </button>
                  )}
                {(admin || merchant) &&
                  item.status !== "WON" &&
                  item.status !== "LOST" &&
                  item.status !== "CLOSED" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleViewModel(item.chargebackId, "documents")
                      }
                      className={styles.iconBtn}
                      title="Upload Evidence"
                    >
                      <Upload size={16} />
                    </button>
                  )}
                <Link
                  href={`/home/charge-back/${
                    item.chargebackId
                  }?merchantName=${encodeURIComponent(
                    item.merchantName || "",
                  )}`}
                  className={styles.iconBtn}
                  title="View Details"
                >
                  <Eye size={16} />
                </Link>
                {item.status !== "WON" &&
                  item.status !== "LOST" &&
                  item.status !== "CLOSED" && (
                    <button
                      onClick={() =>
                        handleViewModel(item.chargebackId, "comments")
                      }
                      className={`${styles.iconBtn} ${styles.iconBtnComment}`}
                      type="button"
                      title="Comments"
                    >
                      <MessageCircleIcon size={16} />
                    </button>
                  )}
              </span>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={8}>
            <div className={tableStyles.emptyMessage}>No Data Found</div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const ChargeBackList = ({ role, isMerchant, userId, subAdmin }) => {
  const [keyword, setKeyword] = useState({ userId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };
  const [merchant, setMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });
  const {
    response: merchantResponse = [],
    postData: getAllMerchants,
    error: merchantError,
    loading: merchantLoading,
  } = usePostRequest(endPoints.users.allMerchantList);

  const handleChangeMerchant = async (id, name) => {
    setMerchant({ id, name });
  };

  useEffect(() => {
    getAllMerchants(
      queryStringWithKeyword(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword.userId,
      ),
    );
  }, [keyword.userId]);
  // end of merchant fetch logic
  useEffect(() => {
    if (merchantResponse && !merchantError) {
      setMerchant({
        id: merchantResponse?.data?.data[0]?.userId || "",
        name: merchantResponse?.data?.data[0]?.fullName || "Select Merchant",
      });
    }
  }, [merchantError, merchantResponse]);

  const [loader, setLoader] = useState(false);
  // Handle for pagination

  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: dateFormatter(value),
    }));
  };

  const {
    postData: getChargebackData,
    response: chargebackResponse,
    loading: chargebackLoading,
  } = usePostRequest(endPoints.chargeBack.allChargeBack);

  const fetchChargebacks = () => {
    getChargebackData({
      userName: isMerchant ? userId : merchant.id,
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
      start: currentPage,
      size: process.env.NEXT_PUBLIC_PAGINATION_SIZE,
    });
  };

  useEffect(() => {
    fetchChargebacks();
  }, [merchant.id, dateRange.dateFrom, dateRange.dateTo, currentPage]);

  useEffect(() => {
    if (chargebackLoading) setLoader(true);
  }, [chargebackLoading]);

  const [viewModal, setViewModal] = useState(false);
  const [type, setType] = useState("");
  const [chargebackId, setChargebackId] = useState("");

  const handleViewModel = (id, type) => {
    setType(type);
    setChargebackId(id);
    setViewModal(true);
  };

  return (
    <>
      {viewModal && (type === "accept" || type === "represent") && (
        <AcceptFightChargeback
          id={chargebackId}
          type={type}
          merchant={merchant.name}
          onClick={() => setViewModal(false)}
          onSuccess={fetchChargebacks}
        />
      )}

      {viewModal && type === "comments" && (
        <Comment
          id={chargebackId}
          type={type}
          merchant={merchant.name}
          onClick={() => setViewModal(false)}
          onSuccess={fetchChargebacks}
        />
      )}
      {viewModal && type === "resolution" && (
        <UpdateResolution
          id={chargebackId}
          type={type}
          merchant={merchant.name}
          onClick={() => setViewModal(false)}
          onSuccess={fetchChargebacks}
        />
      )}
      {viewModal && type === "status" && (
        <UpdateStatus
          id={chargebackId}
          type={type}
          merchant={merchant.name}
          onClick={() => setViewModal(false)}
          onSuccess={fetchChargebacks}
        />
      )}
      {viewModal && type === "close" && (
        <CloseChargeBack
          id={chargebackId}
          type={type}
          merchant={merchant.name}
          onClick={() => setViewModal(false)}
          onSuccess={fetchChargebacks}
        />
      )}

      {viewModal && type === "documents" && (
        <UploadEvidence
          id={chargebackId}
          type={type}
          merchant={merchant.name}
          onClick={() => setViewModal(false)}
          onSuccess={fetchChargebacks}
        />
      )}
      <div className={`wrapper ${styles.page}`}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>Disputes</p>
            <h1 className={styles.title}>Charge Back</h1>
            <p className={styles.subtitle}>
              Filter and manage chargeback cases
            </p>
          </div>
        </div>

        <div className={styles.filterBar}>
          <div className={styles.filterHeader}>
            <span className={styles.filterHeaderIcon}>
              <i className="bi bi-funnel" aria-hidden="true" />
            </span>
            <h5 className={styles.filterHeaderTitle}>Filters</h5>
          </div>
          <div className={styles.filterRow}>
            {(role || subAdmin) && (
              <div className={styles.filterField}>
                <Label htmlFor="merchant" label="Merchant" />
                <div className={styles.iconField}>
                  <i
                    className={`bi bi-people ${styles.fieldIcon}`}
                    aria-hidden="true"
                  />
                  <Dropdown
                    initialLabel="Select Merchant"
                    selectedValue={merchant}
                    options={merchantResponse?.data?.data}
                    onChange={handleChangeMerchant}
                    id="userId"
                    value="fullName"
                    search={true}
                    onSearch={handleKeyword}
                  />
                </div>
              </div>
            )}
            <div className={styles.filterField}>
              <Label htmlFor="dateFrom" label="Date From" />
              <div className={styles.iconField}>
                <i
                  className={`bi bi-calendar3 ${styles.fieldIcon}`}
                  aria-hidden="true"
                />
                <input
                  type="date"
                  id="inputDate"
                  name="dateFrom"
                  onChange={handleDateChange}
                  value={inputFieldDateFormatter(dateRange.dateFrom)}
                />
              </div>
            </div>
            <div className={styles.filterField}>
              <Label htmlFor="dateTo" label="Date To" />
              <div className={styles.iconField}>
                <i
                  className={`bi bi-calendar3 ${styles.fieldIcon}`}
                  aria-hidden="true"
                />
                <input
                  type="date"
                  id="inputDate"
                  name="dateTo"
                  onChange={handleDateChange}
                  value={inputFieldDateFormatter(dateRange.dateTo)}
                />
              </div>
            </div>
            <button
              type="button"
              className={styles.applyBtn}
              onClick={fetchChargebacks}
            >
              <i className="bi bi-funnel-fill" aria-hidden="true" />
              Apply Filters
            </button>
          </div>
        </div>

        <Table
          headers={headers}
          currentPage={chargebackResponse?.data?.pageNumber || 0}
          pageSize={chargebackResponse?.data?.pageSize || 0}
          totalElement={chargebackResponse?.data?.totalElement || 0}
          handleNext={handleNext}
          handlePrev={handlePrev}
          link={false}
          download={false}
          search={false}
        >
          <BodyMapping
            merchant={isMerchant}
            data={chargebackResponse?.data?.data}
            loading={loader}
            handleViewModel={handleViewModel}
            admin={role}
          />
        </Table>
      </div>
    </>
  );
};

export default ChargeBackList;
