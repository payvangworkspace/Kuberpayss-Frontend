"use client";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import Label from "@/app/ui/label/Label";
import Table from "@/app/ui/table/Table";
import { headers } from "./Column";
import { loadingMsg } from "@/app/utils/message";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { useEffect, useState } from "react";
import useGetRequest from "@/app/hooks/useFetch";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";

const BodyMapping = ({ data = [], loading }) => {
  return (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={7}>
            <div className={tableStyles.emptyMessage}>
              {loadingMsg("beneficiary")}
            </div>
          </td>
        </tr>
      ) : data && data.length > 0 ? (
        data.map((item) => (
          <tr key={item.beneficiaryId || "NA"}>
            <td>{item.beneficiaryName || "NA"}</td>
            <td>{item.beneficiaryNickName || "NA"}</td>
            <td>{item.beneficiaryContactNumber || "NA"}</td>
            <td>{item.beneficiaryEmail || "NA"}</td>
            <td>{item.accountNumber || "NA"}</td>
            <td>{item.ifscCode || "NA"}</td>
            <td>{item.vpa || "NA"}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={7}>
            <div className={tableStyles.emptyMessage}>
              No beneficiaries Available
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const Details = ({ isAdmin, isMerchant, userId }) => {
  const [keyword, setKeyword] = useState({ userId: "" });
  const [allMerchants, setAllMerchants] = useState([]);
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };

  const [merchant, setMerchant] = useState({
    id: "",
    name: "All",
  });
  const { postData: getAllMerchants } = usePostRequest(
    endPoints.users.merchantList,
  );

  useEffect(() => {
    const fetchAllMerchants = async () => {
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
    };

    fetchAllMerchants();
  }, []);

  const handleChangeMerchant = async (id, name) => {
    setCurrencyType({
      id: "",
      name: "All",
    });
    setMerchant({ id, name });
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

  const { getData: getCurrencyData, response: currencyResponse } =
    useGetRequest();

  const { postData, response, loading } = usePostRequest(
    endPoints.payout.beneficiaryList,
  );

  const fetchBeneficiaries = () => {
    const userName = isAdmin ? merchant.id : userId;
    postData({ userName, currencyCode: currencyType.id });
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, [isAdmin, merchant.id, userId, currencyType.id]);

  return (
    <div className={`wrapper ${styles.page}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Payout</p>
          <h1 className={styles.title}>Beneficiaries</h1>
          <p className={styles.subtitle}>
            Filter and manage payout beneficiary accounts
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
                  options={allMerchants}
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
            onClick={fetchBeneficiaries}
          >
            <i className="bi bi-funnel-fill" aria-hidden="true" />
            Apply Filters
          </button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <Table
          headers={headers}
          link="/home/beneficiaries/add-beneficiary"
          download={false}
          search={false}
          pagination={false}
          onChange={handleKeyword}
        >
          <BodyMapping data={response?.data?.data || []} loading={loading} />
        </Table>
      </div>
    </div>
  );
};

export default Details;
