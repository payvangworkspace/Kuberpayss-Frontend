"use client";
import Table from "@/app/ui/table/Table";
import { useState, useEffect } from "react";
import { headers } from "./Column";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import {
  queryStringWithDate,
  queryStringWithKeyword,
} from "@/app/services/queryString";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { loadingMsg } from "@/app/utils/message";
import RemittanceDetails from "../modal/remittanceDetails";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";

const currencyTypes = [
  // { id: "INR", name: "Indian Rupee" },
  // { id: "UGX", name: "Uganda Shilling" },
  { id: "USD", name: "US Dollar" },
  // { id: "EUR", name: "Euro" },
  // { id: "GBP", name: "Pound Sterling" },
];

const BodyMapping = ({ data = [], loading = true, role, merchant }) => {
  const [viewModal, setViewModal] = useState(false);
  const [remittanceData, setRemittanceData] = useState(null);
  const handleViewRemittanceDetail = (data) => {
    setRemittanceData(data);
    setViewModal(true);
  };
  const colCount = role ? 7 : 6;

  return (
    <>
      {viewModal && (
        <RemittanceDetails
          role={role}
          name={merchant}
          onClose={() => setViewModal(!viewModal)}
          data={remittanceData}
        />
      )}
      <tbody>
        {!loading ? (
          <tr>
            <td colSpan={colCount}>
              <div className={tableStyles.emptyMessage}>
                {loadingMsg("remittance")}
              </div>
            </td>
          </tr>
        ) : data && data.length > 0 ? (
          data.map((item) => (
            <tr key={item.remittanceId}>
              <td>{item.utr || "N/A"}</td>
              <td>{item.payableAmount || "NA"}</td>
              <td>{item.createdDate || "NA"}</td>
              <td>{item.merchant?.fullName || "NA"}</td>
              <td>{item.currencyCode || "NA"}</td>
              {role && <td>{item.acquirerCode || "NA"}</td>}
              <td>
                <i
                  className={`bi bi-display-fill ${styles.actionIcon}`}
                  title="View Details"
                  onClick={() => handleViewRemittanceDetail(item)}
                ></i>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={colCount}>
              <div className={tableStyles.emptyMessage}>No Data Found</div>
            </td>
          </tr>
        )}
      </tbody>
    </>
  );
};

const Details = ({ role, isMerchant, isSubMerchant }) => {
  const [keyword, setKeyword] = useState({ userId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };
  const [merchant, setMerchant] = useState({
    id: "",
    name: "All",
  });
  const {
    response: merchantResponse = [],
    postData: getAllMerchants,
    error: merchantError,
    loading: merchantLoading,
  } = usePostRequest(endPoints.users.merchantList);
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
        name: merchantResponse?.data?.data[0]?.fullName || "",
      });
    }
  }, [merchantError, merchantResponse]);

  const [currencyType, setCurrencyType] = useState({
    id: currencyTypes[0].id,
    name: currencyTypes[0].name,
  });

  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const { postData, response, error, loading } = usePostRequest(
    endPoints.remittance.remittance,
  );

  const fetchRemittance = () => {
    postData(
      queryStringWithDate(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        "",
        "ALL",
        "",
        "",
        merchant.id,
        currencyType.id,
      ),
    );
  };

  useEffect(() => {
    fetchRemittance();
  }, [merchant.id, currencyType.id, currentPage]);

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (loading) setLoader(true);
  }, [loading]);

  return (
    <div className={`wrapper ${styles.page}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Settlements</p>
          <h1 className={styles.title}>Remittance</h1>
          <p className={styles.subtitle}>
            Filter and manage remittance records
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
          {role && (
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
            <Label htmlFor="paymentStatus" label="Currency" />
            <div className={styles.iconField}>
              <i
                className={`bi bi-currency-dollar ${styles.fieldIcon}`}
                aria-hidden="true"
              />
              <Dropdown
                initialLabel="Select Currency"
                selectedValue={currencyType}
                options={currencyTypes}
                onChange={(id, name) => setCurrencyType({ id, name })}
                id="id"
                value="name"
              />
            </div>
          </div>
          <button
            type="button"
            className={styles.applyBtn}
            onClick={fetchRemittance}
          >
            <i className="bi bi-funnel-fill" aria-hidden="true" />
            Apply Filters
          </button>
        </div>
      </div>

      <Table
        headers={headers(role, isSubMerchant)}
        currentPage={response?.data.pageNumber || 0}
        pageSize={response?.data.pageSize || 0}
        totalElement={response?.data.totalElement || 0}
        handleNext={handleNext}
        handlePrev={handlePrev}
        link={(isMerchant || role) && "/home/remittance/add-remittance"}
        download={false}
        search={false}
      >
        <BodyMapping
          role={role}
          data={response?.data.data || null}
          loading={loader}
          merchant={merchant.name || ""}
        />
      </Table>
    </div>
  );
};

export default Details;
