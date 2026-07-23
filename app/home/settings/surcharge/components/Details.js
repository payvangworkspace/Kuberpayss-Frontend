"use client";
import Table from "@/app/ui/table/Table";
import { useState, useEffect } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { loadingMsg } from "@/app/utils/message";
import { headers, headers2 } from "./Columns";
import useMerchant from "@/app/hooks/useMerchant";
import useGetRequest from "@/app/hooks/useFetch";
import usePostRequest from "@/app/hooks/usePost";
import UpdateSurcharge from "../modals/UpdateSurcharge";
import UpdateSurchargeValue from "../modals/UpdateOtherCharges";
import useDeleteRequest from "@/app/hooks/useDelete";

const BodyMapping = ({ data = [], loading = true, update }) => {
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={7} className="text-center">
            {loadingMsg("remittance")}
          </td>
        </tr>
      ) : (
        <>
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
                <span className="d-flex gap-3">
                  <i
                    className="bi bi-pencil-square text-warning"
                    onClick={() => update(data)}
                  ></i>
                </span>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={3}>No data Available</td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};
const BodyMapping2 = ({
  data = [],
  loading = true,
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

  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={7} className="text-center">
            {loadingMsg("remittance")}
          </td>
        </tr>
      ) : (
        <>
          {data?.mopTypes && data?.mopTypes.length > 0 ? (
            data?.mopTypes.map((item) => (
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
                  <span className="d-flex gap-3">
                    <i
                      className="bi bi-pencil-square text-warning"
                      onClick={() => handleUpdateSurchargeValue(item)}
                    ></i>
                    <i
                      className="bi bi-trash-fill text-danger"
                      onClick={() => handleDelete(item.surchargeId)}
                    ></i>
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No data Available</td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};
const Details = () => {
  const [successAction, setSuccessAction] = useState(false);

  const { selectedMerchant, merchantList, handleMerchantChange } =
    useMerchant();
  const {
    getData: getAllPaymentType,
    response: allPaymentType,
    error: errorPaymentType,
  } = useGetRequest();
  const [selectedPaymentType, setSelectedPaymentType] = useState({
    id: "",
    name: "Select Payment Type",
  });
  useEffect(() => {
    if (selectedMerchant.id) {
      setSelectedPaymentType({ id: "", name: "Select Payment Type" });
      getAllPaymentType(
        endPoints.settings.merchantPaymentType + "/" + selectedMerchant.id
      );
    }
  }, [selectedMerchant]);

  const { postData, error, loading, response } = usePostRequest(
    endPoints.surcharge.surchargeDetails
  );

  const handlePaymentTypeSelect = async (id, name) => {
    setSelectedPaymentType({ id, name });
  };
  useEffect(() => {
    if (selectedPaymentType.id)
      postData({
        userName: selectedMerchant.id,
        paymentTypeId: selectedPaymentType.id,
      });
  }, [selectedPaymentType, selectedMerchant, successAction]);

  useEffect(() => {
    if (!error && response) {
    }
  }, [error, response]);

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
  return (
    <>
      {viewUpdateSurcharge && (
        <UpdateSurcharge
          merchant={selectedMerchant}
          paymentType={selectedPaymentType}
          currentValue={currentData}
          onClose={() => setViewUpdateSurcharge(!viewUpdateSurcharge)}
          onSuccess={() => setSuccessAction(!successAction)}
        />
      )}
      {viewUpdateSurchargeValue && (
        <UpdateSurchargeValue
          merchant={selectedMerchant}
          paymentType={selectedPaymentType}
          currentValue={currentData}
          onClose={() => setViewUpdateSurchargeValue(!viewUpdateSurchargeValue)}
          onSuccess={() => setSuccessAction(!successAction)}
        />
      )}
      <div className="wrapper" style={{ minHeight: "50vh" }}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-3">
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
          <div className="col-md-6 col-sm-12 mb-3">
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

        {/* {response && ( */}
        <div>
          <div className="mb-3">
            <small>
              <strong>Surcharge value</strong>
            </small>
            <Table
              headers={headers}
              pagination={false}
              link={false}
              search={false}
              download={false}
            >
              <BodyMapping
                data={response?.data.data || null}
                update={handleUpdateSurcharge}
              />
            </Table>
          </div>
          <small>
            <strong>Other Charges</strong>
          </small>
          <Table
            headers={headers2}
            pagination={false}
            link={false}
            search={false}
            download={false}
          >
            <BodyMapping2
              data={response?.data.data || null}
              handleUpdateSurchargeValue={handleUpdateSurchargeValue}
              successAction={() => setSuccessAction(!successAction)}
            />
          </Table>
        </div>
        {/* )} */}
      </div>
    </>
  );
};

export default Details;
