"use client";
import Table from "@/app/ui/table/Table";
import { useState, useEffect } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { headers, headers2 } from "./Columns";
import useMerchant from "@/app/hooks/useMerchant";
import useGetRequest from "@/app/hooks/useFetch";
import usePostRequest from "@/app/hooks/usePost";
import UpdateSurcharge from "../modals/UpdateSurcharge";
import UpdateSurchargeValue from "../modals/UpdateOtherCharges";
import useDeleteRequest from "@/app/hooks/useDelete";
import AddButton from "@/app/home/components/addButton/AddButton";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";

const SKELETON_ROWS = 6;

const BodyMapping = ({ data = null, loading = false, ready = false, update }) => {
  if (!ready) {
    return (
      <tbody>
        <tr>
          <td colSpan={3}>
            <div className={tableStyles.emptyMessage}>
              Select a merchant and payment type to view surcharge
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (loading) {
    return (
      <tbody>
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <tr key={`skeleton-${index}`} className={styles.skeletonRow}>
            {[110, 100, 48].map((width, cellIndex) => (
              <td key={cellIndex}>
                <span
                  className={styles.shimmer}
                  style={{ width, height: 12 }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <tbody>
      {data && Object.keys(data).length !== 0 ? (
        <tr key={data.surchargeId}>
          <td>
            {data.serviceTax || "NA"}
            {!data.isFixCharges && "%"}
          </td>
          <td>
            {data.surchargeValue || "NA"} {!data.isFixCharges && "%"}
          </td>
          <td>
            <span className={styles.actionCell}>
              <i
                className={`bi bi-pencil-square ${styles.editIcon}`}
                onClick={() => update(data)}
              />
            </span>
          </td>
        </tr>
      ) : (
        <tr>
          <td colSpan={3}>
            <div className={tableStyles.emptyMessage}>No surcharge available</div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const BodyMapping2 = ({
  data = null,
  loading = false,
  ready = false,
  handleUpdateSurchargeValue,
  successAction,
}) => {
  const { response, error, deleteData } = useDeleteRequest();

  async function handleDelete(id) {
    await deleteData(endPoints.surcharge.addSurcharge + "/" + id);
  }

  useEffect(() => {
    if (response && !error) {
      successAction();
    }
  }, [response, error]);

  if (!ready) {
    return (
      <tbody>
        <tr>
          <td colSpan={6}>
            <div className={tableStyles.emptyMessage}>
              Select a merchant and payment type to view other charges
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (loading) {
    return (
      <tbody>
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <tr key={`skeleton-${index}`} className={styles.skeletonRow}>
            {[100, 90, 80, 80, 70, 48].map((width, cellIndex) => (
              <td key={cellIndex}>
                <span
                  className={styles.shimmer}
                  style={{ width, height: 12 }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <tbody>
      {data?.mopTypes && data?.mopTypes.length > 0 ? (
        data.mopTypes.map((item) => (
          <tr key={item.surchargeId}>
            <td>{item.mopTypeName || "NA"}</td>
            <td>
              {item.merchantCharge || "NA"} {!data.isFixCharges && "%"}
            </td>
            <td>
              {item.pgCharge || "NA"} {!data.isFixCharges && "%"}
            </td>
            <td>
              {item.bankCharge || "NA"} {!data.isFixCharges && "%"}
            </td>
            <td>{item.isOnOffUs === "false" ? "OFF-US" : "ON-US"}</td>
            <td>
              <span className={styles.actionCell}>
                <i
                  className={`bi bi-pencil-square ${styles.editIcon}`}
                  onClick={() => handleUpdateSurchargeValue(item)}
                />
                <i
                  className={`bi bi-trash-fill ${styles.deleteIcon}`}
                  onClick={() => handleDelete(item.surchargeId)}
                />
              </span>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={6}>
            <div className={tableStyles.emptyMessage}>No other charges available</div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const Details = () => {
  const [successAction, setSuccessAction] = useState(false);
  const { selectedMerchant, merchantList, handleMerchantChange } =
    useMerchant();
  const { getData: getAllPaymentType, response: allPaymentType } =
    useGetRequest();
  const [selectedPaymentType, setSelectedPaymentType] = useState({
    id: "",
    name: "Select Payment Type",
  });

  useEffect(() => {
    if (selectedMerchant.id) {
      setSelectedPaymentType({ id: "", name: "Select Payment Type" });
      getAllPaymentType(
        endPoints.settings.merchantPaymentType + "/" + selectedMerchant.id,
      );
    }
  }, [selectedMerchant]);

  const { postData, loading, response } = usePostRequest(
    endPoints.surcharge.surchargeDetails,
  );

  const handlePaymentTypeSelect = (id, name) => {
    setSelectedPaymentType({ id, name });
  };

  useEffect(() => {
    if (selectedPaymentType.id) {
      postData({
        userName: selectedMerchant.id,
        paymentTypeId: selectedPaymentType.id,
      });
    }
  }, [selectedPaymentType, selectedMerchant, successAction]);

  const [viewUpdateSurcharge, setViewUpdateSurcharge] = useState(false);
  const [currentData, setCurrentdata] = useState();
  const handleUpdateSurcharge = (currentValue) => {
    setCurrentdata(currentValue);
    setViewUpdateSurcharge(true);
  };

  const [viewUpdateSurchargeValue, setViewUpdateSurchargeValue] =
    useState(false);
  const handleUpdateSurchargeValue = (currentValue) => {
    setCurrentdata(currentValue);
    setViewUpdateSurchargeValue(true);
  };

  const ready = Boolean(selectedPaymentType.id);
  const tableLoading = ready && (loading || response == null);

  return (
    <>
      {viewUpdateSurcharge && (
        <UpdateSurcharge
          merchant={selectedMerchant}
          paymentType={selectedPaymentType}
          currentValue={currentData}
          onClose={() => setViewUpdateSurcharge(false)}
          onSuccess={() => setSuccessAction(!successAction)}
        />
      )}
      {viewUpdateSurchargeValue && (
        <UpdateSurchargeValue
          merchant={selectedMerchant}
          paymentType={selectedPaymentType}
          currentValue={currentData}
          onClose={() => setViewUpdateSurchargeValue(false)}
          onSuccess={() => setSuccessAction(!successAction)}
        />
      )}

      <div className={`wrapper ${styles.page}`}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>Settings</p>
            <h1 className={styles.title}>Surcharge Management</h1>
            <p className={styles.subtitle}>
              View and update merchant surcharge and other charges
            </p>
          </div>
          <AddButton link="/home/settings/surcharge/add-surcharge" />
        </div>

        <div className={styles.filterBar}>
          <div className={styles.filterHeader}>
            <span className={styles.filterHeaderIcon}>
              <i className="bi bi-funnel" aria-hidden="true" />
            </span>
            <p className={styles.filterHeaderTitle}>Filters</p>
          </div>
          <div className={styles.filterRow}>
            <div className={styles.filterField}>
              <Label htmlFor="merchant" label="Merchant" />
              <Dropdown
                initialLabel="Select Merchant"
                selectedValue={selectedMerchant}
                options={merchantList?.data.data}
                onChange={handleMerchantChange}
                id="userId"
                value="fullName"
              />
            </div>
            <div className={styles.filterField}>
              <Label htmlFor="paymentType" label="Payment Type" />
              <Dropdown
                initialLabel="Select Payment Type"
                selectedValue={selectedPaymentType}
                options={allPaymentType?.data}
                onChange={handlePaymentTypeSelect}
                id="paymentTypeId"
                value="paymentTypeName"
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Surcharge value</h2>
          <Table
            headers={headers}
            pagination={false}
            link={false}
            search={false}
            download={false}
          >
            <BodyMapping
              data={response?.data.data || null}
              loading={tableLoading}
              ready={ready}
              update={handleUpdateSurcharge}
            />
          </Table>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Other Charges</h2>
          <Table
            headers={headers2}
            pagination={false}
            link={false}
            search={false}
            download={false}
          >
            <BodyMapping2
              data={response?.data.data || null}
              loading={tableLoading}
              ready={ready}
              handleUpdateSurchargeValue={handleUpdateSurchargeValue}
              successAction={() => setSuccessAction(!successAction)}
            />
          </Table>
        </div>
      </div>
    </>
  );
};

export default Details;
