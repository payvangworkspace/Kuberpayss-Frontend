"use client";
import useGetRequest from "@/app/hooks/useFetch";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { queryStringWithKeyword } from "@/app/services/queryString";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import Table from "@/app/ui/table/Table";
import { useEffect, useState } from "react";
import { headers } from "./Columns";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import { loadingMsg } from "@/app/utils/message";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";

const BodyMapping = ({ data = [], loading }) => {
  return (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={10}>
            <div className={tableStyles.emptyMessage}>
              {loadingMsg("load money")}
            </div>
          </td>
        </tr>
      ) : data && data.length > 0 ? (
        data.map((item) => (
          <tr key={item.userAccountId}>
            <td>{item?.userAccount?.user?.fullName || "NA"}</td>
            <td>{item?.createdDate || "NA"}</td>
            <td>
              {item.currency?.currencyName} ({item.currency?.currencyCode})
            </td>
            <td>{item.previousBalance || "0.0"}</td>
            <td>{item.amount || "0.0"}</td>
            <td>{item.updatedBalance || "0.0"}</td>
            <td>
              <span className={styles.typeBadge}>
                {item.transactionTypes || "CREDIT"}
              </span>
            </td>
            <td>{item.remark || "NA"}</td>
            <td>{item.receiptId || "NA"}</td>
            <td>
              {item.image ? (
                <i
                  className={`bi bi-file-earmark-image ${styles.actionIcon}`}
                  title="View Image"
                ></i>
              ) : (
                "NA"
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={10}>
            <div className={tableStyles.emptyMessage}>No Data Found</div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const Details = ({ isAdmin, isMerchant, isSubMerchant, userId }) => {
  const [keyword, setKeyword] = useState({ userId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };
  // fetch all merchants
  const [merchant, setMerchant] = useState({
    id: "",
    name: "All",
  });
  const { response: merchantResponse = [], postData: getAllMerchants } =
    usePostRequest(endPoints.users.merchantList);

  const handleChangeMerchant = async (id, name) => {
    setCurrencyType({
      id: "",
      name: "All",
    });
    setMerchant({ id, name });
    setCurrentPage(0);
  };

  useEffect(() => {
    if (isAdmin) {
      if (merchant.id) {
        getCurrencyData(endPoints.users.mappedCurrency + merchant.id);
      }
    } else if (isMerchant) {
      getCurrencyData(endPoints.users.mappedCurrency + userId);
    }
  }, [isAdmin, merchant.id, userId]);

  useEffect(() => {
    getAllMerchants(
      queryStringWithKeyword(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword.userId,
      ),
    );
  }, [keyword.userId]);

  const [currencyType, setCurrencyType] = useState({
    id: "",
    name: "All",
  });
  // API for getting currencies based on merchant
  const { getData: getCurrencyData, response: currencyResponse } =
    useGetRequest();

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

  // API for getting user accounts based on merchant
  const { postData, response, loading } = usePostRequest(
    endPoints.payout.loadMoney,
  );
  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const fetchLoadMoney = () => {
    const userName = isAdmin ? merchant.id : userId;
    postData({
      userName,
      currencyCode: currencyType.id,
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
      start: currentPage,
      size: process.env.NEXT_PUBLIC_PAGINATION_SIZE,
    });
  };

  useEffect(() => {
    fetchLoadMoney();
  }, [
    isAdmin,
    merchant.id,
    userId,
    currencyType.id,
    dateRange.dateFrom,
    dateRange.dateTo,
    currentPage,
  ]);

  return (
    <div className={`wrapper ${styles.page}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Payout</p>
          <h1 className={styles.title}>Load Money</h1>
          <p className={styles.subtitle}>
            Filter, export, and manage load money transactions
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
          {isAdmin && (
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
            <Label htmlFor="currency" label="Currency" />
            <div className={styles.iconField}>
              <i
                className={`bi bi-currency-dollar ${styles.fieldIcon}`}
                aria-hidden="true"
              />
              <Dropdown
                initialLabel="Select Currency"
                selectedValue={currencyType}
                options={currencyResponse?.data || []}
                onChange={(id, name) => setCurrencyType({ id, name })}
                id="currencyId"
                value="currencyName"
                search={false}
              />
            </div>
          </div>
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
            onClick={fetchLoadMoney}
          >
            <i className="bi bi-funnel-fill" aria-hidden="true" />
            Apply Filters
          </button>
        </div>
      </div>

      <Table
        headers={headers}
        link={isAdmin ? "/home/load-money/add-load-money" : undefined}
        currentPage={response?.data?.pageNumber || 0}
        pageSize={response?.data?.pageSize || 0}
        totalElement={response?.data?.totalElement || 0}
        search={false}
        handleNext={handleNext}
        handlePrev={handlePrev}
      >
        <BodyMapping data={response?.data?.data || []} loading={loading} />
      </Table>
    </div>
  );
};

export default Details;
