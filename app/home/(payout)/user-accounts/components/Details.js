"use client";
import useGetRequest from "@/app/hooks/useFetch";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { queryStringWithKeyword } from "@/app/services/queryString";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import Table from "@/app/ui/table/Table";
import { loadingMsg } from "@/app/utils/message";
import { useEffect, useState } from "react";
import WalletCard from "./WalletCard";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";

const BodyMapping = ({ data, loading }) => {
  const hasData = data && Object.keys(data).length > 0;

  return (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={9}>
            <div className={tableStyles.emptyMessage}>
              {loadingMsg("merchant")}
            </div>
          </td>
        </tr>
      ) : hasData ? (
        Object.entries(data).map(([key, wallets]) => (
          <tr key={key}>
            <td colSpan={9}>
              <div className={styles.merchantBlock}>
                <div>
                  <h6 className={styles.merchantName}>{key}</h6>
                  <small className={styles.merchantId}>
                    id: {wallets?.[0]?.user?.userId || "NA"}
                  </small>
                </div>
                <div className={styles.walletGrid}>
                  {wallets?.map((item, index) => (
                    <WalletCard
                      key={item.userAccountId || index}
                      wallet={{
                        walletId: item.userAccountId,
                        currency: item.currency?.currencyCode,
                        balance: item.amountBalance,
                        lastUpdated: item.lastModifiedDate,
                      }}
                    />
                  ))}
                </div>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={9}>
            <div className={tableStyles.emptyMessage}>No Data Found</div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const Details = ({ isAdmin, userId, isMerchant }) => {
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
  };

  useEffect(() => {
    if (isAdmin) {
      // If admin, fetch currencies for selected merchant
      if (merchant.id) {
        getCurrencyData(endPoints.users.mappedCurrency + merchant.id);
      }
    } else if (isMerchant) {
      // If not admin, fetch currencies for userId from props
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

  // API for getting user accounts based on merchant
  const { postData, response, loading } = usePostRequest(
    endPoints.payout.getUserAccounts,
  );

  const fetchUserAccounts = () => {
    const userName = isAdmin ? merchant.id : userId;
    postData({ userName, currencyCode: currencyType.id });
  };

  useEffect(() => {
    fetchUserAccounts();
  }, [isAdmin, merchant.id, userId, currencyType.id]);

  return (
    <div className={`wrapper ${styles.page}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Payout</p>
          <h1 className={styles.title}>User Accounts</h1>
          <p className={styles.subtitle}>
            Filter and review merchant wallet balances
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
          <button
            type="button"
            className={styles.applyBtn}
            onClick={fetchUserAccounts}
          >
            <i className="bi bi-funnel-fill" aria-hidden="true" />
            Apply Filters
          </button>
        </div>
      </div>

      <Table download={false} search={false} pagination={false}>
        <BodyMapping data={response?.data?.data || {}} loading={loading} />
      </Table>
    </div>
  );
};

export default Details;
