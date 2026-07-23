"use client";
import styles from "./Filter.module.css";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { useEffect, useMemo, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import apiClient from "@/app/services/apiClient";
import TransactionsSummary from "../summary/TransactionsSummary";
import AmountSummary from "../summary/AmountSummary";
import Label from "@/app/ui/label/Label";
import usePostRequest from "@/app/hooks/usePost";
import {
  queryStringWithDate,
} from "@/app/services/queryString";
import TransactionCount from "../../graphs/TransactionCount";
import TransactionAmount from "../../graphs/TransactionAmount";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import PaymentTypeData from "../../graphs/PaymentTypeData";
import useGetRequest from "@/app/hooks/useFetch";

const ALL_CURRENCIES = [
  { currencyCode: "USD", currencyName: "US Dollar" },
  // { currencyCode: "INR", currencyName: "Indian Rupee" },
  // { currencyCode: "GBP", currencyName: "Pound Sterling" },
  // { currencyCode: "EUR", currencyName: "Euro" },
  // { currencyCode: "UGX", currencyName: "Uganda Shilling" },
];

const ALL_MERCHANT_OPTION = {
  id: "",
  name: "All",
  userId: "",
  fullName: "All",
};

const sumNum = (a, b) => (Number(a) || 0) + (Number(b) || 0);

const DASHBOARD_SUMMARY_KEYS = [
  "totalTransactions",
  "totalTransactionsAmount",
  "capturedTransactions",
  "capturedTransactionsAmount",
  "failsTransactions",
  "failsTransactionsAmount",
  "pendingTransactions",
  "pendingTransactionsAmount",
  "totalGstVat",
  "totalMerchantCharge",
  "totalMerchantPayableAmount",
  "totalPgCharge",
];

const emptyDashboardSummary = () =>
  Object.fromEntries(DASHBOARD_SUMMARY_KEYS.map((key) => [key, 0]));

const mergeDashboardSummaries = (summaries) =>
  summaries.reduce((acc, summary) => {
    if (!summary) return acc;
    DASHBOARD_SUMMARY_KEYS.forEach((key) => {
      acc[key] = sumNum(acc[key], summary[key]);
    });
    return acc;
  }, emptyDashboardSummary());

const normalizeGraphTransactionStatus = (status) => {
  const normalizedStatus = String(status || "").trim().toUpperCase();
  if (normalizedStatus === "CAPTURED") return "SUCCESS";
  return normalizedStatus;
};

const mergeGraphDateEntries = (arr1 = [], arr2 = []) => {
  const byStatus = {};
  [...arr1, ...arr2].forEach((item) => {
    const status = normalizeGraphTransactionStatus(item.transactionStatus);
    if (!byStatus[status]) {
      byStatus[status] = { ...item, transactionStatus: status };
      return;
    }
    const merged = { ...byStatus[status] };
    Object.keys(item).forEach((key) => {
      if (key === "transactionStatus") return;
      merged[key] = sumNum(merged[key], item[key]);
    });
    byStatus[status] = merged;
  });
  return Object.values(byStatus);
};

const mergeGraphData = (graphResponses) => {
  const merged = {};
  graphResponses.forEach((res) => {
    const data = res?.data?.data || {};
    Object.keys(data).forEach((dateKey) => {
      if (!merged[dateKey]) {
        merged[dateKey] = [...(data[dateKey] || [])];
      } else {
        merged[dateKey] = mergeGraphDateEntries(merged[dateKey], data[dateKey]);
      }
    });
  });
  return merged;
};

const mergePieData = (pieResponses) => {
  const merged = {};
  pieResponses.forEach((res) => {
    const pieObj = res?.data?.data || {};
    Object.keys(pieObj).forEach((key) => {
      merged[key] = sumNum(merged[key], pieObj[key]);
    });
  });
  return { data: { data: merged } };
};

const Filter = ({ role, isSubMerchant, userEmail, isAdmin, reseller }) => {
  const [symbol, setSymbol] = useState("USh");
  const [allMerchants, setAllMerchants] = useState([]);

  const [merchant, setMerchant] = useState(ALL_MERCHANT_OPTION);

  const {
    response: merchantResponse,
    postData: getAllMerchants,
    error: merchantError,
  } = usePostRequest(endPoints.users.merchantListOnly);
  const { postData: getMapData, response: mapData } = usePostRequest(
    endPoints.settings.allMapMerchant,
  );

  useEffect(() => {
    if (reseller) return;

    const fetchAllMerchants = async () => {
      try {
        let allData = [];
        let page = 0;
        let totalPages = 1;

        while (page < totalPages) {
          const res = await getAllMerchants({
            start: page,
            size: 25,
          });

          const data = res?.data?.data || [];
          totalPages = res?.data?.totalPage || 1;

          allData = [...allData, ...data];
          page++;
        }

        setAllMerchants(allData);
      } catch {
        setAllMerchants([]);
      }
    };

    fetchAllMerchants();
  }, [reseller]);

  useEffect(() => {
    if (!reseller) return;

    getMapData(
      queryStringWithDate(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        "",
        "",
        "",
        "",
        userEmail,
        "",
        "",
      ),
    ).catch(() => {});
  }, [reseller, userEmail]);

  const { response: currencyResponse, getData: getAllCurrencies } =
    useGetRequest();

  const currencyTypes = useMemo(() => {
    if (merchant.id === "") {
      // "All" merchants selected, show all currencies (without 'All' option)
      return ALL_CURRENCIES.map((currency) => ({
        id: currency.currencyCode,
        name: currency.currencyName,
      }));
    }
    // A specific merchant is selected
    if (!currencyResponse || !currencyResponse.data) return [];
    return currencyResponse.data.map((currency) => ({
      id: currency.currencyCode,
      name: currency.currencyName,
    }));
  }, [currencyResponse, merchant.id]);

  useEffect(() => {
    if ((isAdmin || reseller) && merchant.id) {
      getAllCurrencies(endPoints.users.mappedCurrency + merchant.id);
    } else if (!isAdmin && !reseller && userEmail) {
      getAllCurrencies(endPoints.users.mappedCurrency + userEmail);
    }
  }, [merchant.id, userEmail, isAdmin, reseller]);

  useEffect(() => {
    if (reseller || !merchantResponse || merchantError) return;
    setMerchant(ALL_MERCHANT_OPTION);
  }, [merchantResponse, merchantError, reseller]);

  const merchantOptions = useMemo(() => {
    if (reseller) {
      return [
        ALL_MERCHANT_OPTION,
        ...(mapData?.data?.data || []).map((item) => ({
          userId: item.merchantUserName,
          fullName: item.merchantFullName,
        })),
      ];
    }
    return allMerchants;
  }, [reseller, mapData, allMerchants]);

  const handleMerchantChange = async (id, name) => {
    setMerchant({ id, name, userId: id, fullName: name });
    // Reset currency when merchant changes
    setCurrencyType({ id: "", name: "Select Currency" });
  };

  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date().toISOString()),
    dateTo: dateFormatter(new Date().toISOString()),
  });
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev, // Spread the previous state
      [name]: dateFormatter(value), // Update the specific property
    }));
  };

  const [currencyType, setCurrencyType] = useState({
    id: "",
    name: "select Currency",
  });

  const mappedMerchants = useMemo(
    () => mapData?.data?.data || [],
    [mapData],
  );
  const isResellerAll = reseller && !merchant?.id;
  const merchantId = (isAdmin || reseller) ? merchant?.id : userEmail;

  const [aggregatedSummary, setAggregatedSummary] = useState(null);
  const [aggregatedGraphData, setAggregatedGraphData] = useState(null);
  const [aggregatedPieData, setAggregatedPieData] = useState(null);

  const { response, postData } = usePostRequest(
    endPoints.payin.dashboardTransaction,
  );
  const { postData: getGraphData, response: graphData } = usePostRequest(
    endPoints.graph,
  );
  const { postData: getPieGraphData, response: pieGraphData } = usePostRequest(
    endPoints.piegraph,
  );

  useEffect(() => {
    if (!isResellerAll) return;

    if (!mappedMerchants.length) {
      setAggregatedSummary(emptyDashboardSummary());
      setAggregatedGraphData({});
      setAggregatedPieData({ data: { data: {} } });
      return;
    }

    let cancelled = false;

    const fetchAggregatedDashboard = async () => {
      const dashboardPayload = (userName) =>
        queryStringWithDate(
          0,
          process.env.NEXT_PUBLIC_PAGINATION_SIZE,
          "",
          "ALL",
          dateRange.dateFrom,
          dateRange.dateTo,
          userName,
          currencyType.id || "",
        );

      const chartPayload = (userName) => ({
        userName,
        currencyCode: currencyType.id || "",
        dateTo: dateRange.dateTo,
        dateFrom: dateRange.dateFrom,
      });

      try {
        const [dashResults, graphResults, pieResults] = await Promise.all([
          Promise.all(
            mappedMerchants.map((m) =>
              apiClient.post(
                endPoints.payin.dashboardTransaction,
                dashboardPayload(m.merchantUserName),
              ),
            ),
          ),
          Promise.all(
            mappedMerchants.map((m) =>
              apiClient.post(endPoints.graph, chartPayload(m.merchantUserName)),
            ),
          ),
          Promise.all(
            mappedMerchants.map((m) =>
              apiClient.post(
                endPoints.piegraph,
                chartPayload(m.merchantUserName),
              ),
            ),
          ),
        ]);

        if (cancelled) return;

        const summaries = dashResults.map(
          (r) => r?.data?.summary ?? r?.data?.data,
        );
        setAggregatedSummary(mergeDashboardSummaries(summaries));
        setAggregatedGraphData(mergeGraphData(graphResults));
        setAggregatedPieData(mergePieData(pieResults));
      } catch {
        if (!cancelled) {
          setAggregatedSummary(emptyDashboardSummary());
          setAggregatedGraphData({});
          setAggregatedPieData({ data: { data: {} } });
        }
      }
    };

    fetchAggregatedDashboard();

    return () => {
      cancelled = true;
    };
  }, [
    isResellerAll,
    mappedMerchants,
    dateRange.dateFrom,
    dateRange.dateTo,
    currencyType.id,
  ]);

  useEffect(() => {
    if (isResellerAll) return;

    const payload = queryStringWithDate(
      0,
      process.env.NEXT_PUBLIC_PAGINATION_SIZE,
      "",
      "ALL",
      dateRange.dateFrom,
      dateRange.dateTo,
      merchantId || "",
      currencyType.id || "",
    );

    postData(payload).catch(() => {});
  }, [
    isResellerAll,
    dateRange.dateFrom,
    dateRange.dateTo,
    merchantId,
    currencyType.id,
  ]);

  useEffect(() => {
    if (isResellerAll) return;

    getGraphData({
      userName: merchantId || "",
      currencyCode: currencyType.id || "",
      dateTo: dateRange.dateTo,
      dateFrom: dateRange.dateFrom,
    }).catch(() => {});
  }, [isResellerAll, merchantId, dateRange, currencyType.id]);

  useEffect(() => {
    if (isResellerAll) return;

    getPieGraphData({
      userName: merchantId || "",
      dateTo: dateRange.dateTo,
      dateFrom: dateRange.dateFrom,
      currencyCode: currencyType.id || "",
    }).catch(() => {});
  }, [
    isResellerAll,
    merchantId,
    dateRange.dateFrom,
    dateRange.dateTo,
    currencyType.id,
  ]);

  const dashboardSummary = isResellerAll
    ? (aggregatedSummary ?? emptyDashboardSummary())
    : (response?.data?.summary ?? response?.data?.data);

  const graphDataToShow = isResellerAll
    ? aggregatedGraphData
    : graphData?.data?.data;

  const pieDataToShow = isResellerAll ? aggregatedPieData : pieGraphData;

  const handleCurrencyChange = (id, name) => {
    setCurrencyType({ id, name });
    switch (id) {
      case "USD":
        setSymbol("$");
        break;
      case "UGX":
        setSymbol("USh");
        break;
      case "EUR":
        setSymbol("€");
        break;
      case "GBP":
        setSymbol("£");
        break;
      default:
        setSymbol("₹");
        break;
    }
  };
  return (
    <div className="wrapper">
      <div className={styles.filterBar}>
        <div className={styles.filterHeader}>
          <span className={styles.filterHeaderIcon}>
            <i className="bi bi-funnel" aria-hidden="true" />
          </span>
          <h5 className={styles.filterHeaderTitle}>Filters</h5>
        </div>
        <div className={styles.filterRow}>
          {!role && !isSubMerchant && (
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
                  options={merchantOptions}
                  onChange={handleMerchantChange}
                  id="userId"
                  value="fullName"
                />
              </div>
            </div>
          )}

          <div className={styles.filterField}>
            <Label htmlFor="currencyType" label="Currency" />
            <div className={styles.iconField}>
              <i
                className={`bi bi-currency-dollar ${styles.fieldIcon}`}
                aria-hidden="true"
              />
              <Dropdown
                initialLabel="Select Currency"
                selectedValue={currencyType}
                options={currencyTypes}
                onChange={handleCurrencyChange}
                id="id"
                value="name"
                all={false}
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
                max={new Date().toISOString().split("T")[0]}
                onChange={handleDateChange}
                value={inputFieldDateFormatter(dateRange.dateFrom).toString()}
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
                max={new Date().toISOString().split("T")[0]}
                onChange={handleDateChange}
                value={inputFieldDateFormatter(dateRange.dateTo)}
              />
            </div>
          </div>
          <button type="button" className={styles.applyBtn}>
            <i className="bi bi-funnel-fill" aria-hidden="true" />
            Apply Filters
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 col-sm-12 ">
          <TransactionsSummary response={dashboardSummary} symbol={symbol} />
          <AmountSummary response={dashboardSummary} symbol={symbol} />
        </div>
      </div>

      {/* <div className={styles.overviewHeader}>
        <div className={styles.overviewLeft}>
          <span className={styles.overviewIcon}>
            <i className="bi bi-graph-up-arrow" aria-hidden="true" />
          </span>
          <div>
            <h5 className={styles.overviewTitle}>Transaction Overview</h5>
            <p className={styles.overviewSubtitle}>
              Track your transaction trends and performance
            </p>
          </div>
        </div>
        <div className={styles.overviewRight}>
          <span className={styles.rangeChip}>
            <i className="bi bi-calendar3" aria-hidden="true" />
            {dateRange.dateFrom} — {dateRange.dateTo}
          </span>
        </div>
      </div> */}

      <PaymentTypeData
        data={pieDataToShow}
        rangeLabel={`${dateRange.dateFrom} — ${dateRange.dateTo}`}
      />
      <TransactionCount
        data={graphDataToShow}
        rangeLabel={`${dateRange.dateFrom} — ${dateRange.dateTo}`}
      />
      <TransactionAmount
        data={graphDataToShow}
        rangeLabel={`${dateRange.dateFrom} — ${dateRange.dateTo}`}
      />
    </div>
  );
};

export default Filter;
