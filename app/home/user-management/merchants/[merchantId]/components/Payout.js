import { useEffect, useState } from "react";
import styles from "../page.module.css";
import AddPayoutTdr from "../modals/AddPayoutTdr";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import useDeleteRequest from "@/app/hooks/useDelete";
import DeleteWarning from "@/app/ui/modals/DeleteWarning";
import { successMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";
import usePostRequest from "@/app/hooks/usePost";
import UpdatePriority from "../modals/UpdatePriority";
import AddTransferLimit from "../modals/AddTransferLimit";
import AddIpWhitelist from "../modals/AddWhitelistIp";

const Payout = ({ name, id, admin }) => {
  const [successAction, setSuccessAction] = useState(false);
  const [viewPriorityModal, setViewPriorityModal] = useState(false);

  // Add Amount Limit
  const [viewAddAmtLimitModal, setViewAddAmtLimitModal] = useState(false);

  // payout
  const [viewAddPayoutTdrModal, setViewAddPayoutTdrModal] = useState(false);

  const {
    getData: getAllAcquirer,
    response: acquirers = [],
    error: acquirerError,
    loading: acquirersLoading,
  } = useGetRequest();

  useEffect(() => {
    getAllAcquirer(endPoints.payout.acquirerList + "/" + id);
  }, [successAction]);

  // priority

  // Get priority value
  const { getData: getPriority, response: priorityResponse } = useGetRequest();

  // Logic to get All payment Type details using acquirer
  const {
    getData: getMappedTransferModes,
    error,
    loading,
    response = [],
  } = useGetRequest();

  const [transferModes, setTransferModes] = useState([]);

  const handleTransferModes = async (acquirerId) => {
    await getMappedTransferModes(
      endPoints.payout.getMapping + "/" + id + "/" + acquirerId
    );
  };

  useEffect(() => {
    if (
      acquirers &&
      !acquirerError &&
      acquirers.data &&
      acquirers?.data?.length > 0
    ) {
      getMappedTransferModes(
        endPoints.payout.getMapping +
          "/" +
          id +
          "/" +
          acquirers?.data[0]?.acquirerId
      );
    }
  }, [acquirers]);

  const {
    getData: getAllMinAmtLimit,
    error: minAmtLimitError,
    response: minAmtLimitResponse = [],
  } = useGetRequest();

  useEffect(() => {
    getAllMinAmtLimit(endPoints.payout.minAmtLimit + "/" + id);
  }, [successAction]);

  // Logics for deleting data
  const [viewDeleteWarning, setViewDeleteWarning] = useState(false);
  const [merchantChargeId, setMerchantChargeId] = useState(null);

  const handleViewDeleteWarning = (id) => {
    setViewDeleteWarning(true);
    setMerchantChargeId(id);
  };

  const {
    response: deleteResponse,
    error: deleteError,
    loading: deleteLoading,
    deleteData,
  } = useDeleteRequest();

  const handleConfirmDelete = async () => {
    await deleteData(endPoints.payout.merchantTdr + "/" + merchantChargeId);
  };

  // merchantAcquirerTransferModeMappingId

  useEffect(() => {
    if (deleteResponse && !deleteError) {
      successMsg("Delete Successfully");
      setViewDeleteWarning(false);
      setMerchantChargeId(null);
    }
  }, [deleteResponse, deleteError]);

  // ip whitelist api

  const {
    getData: getIpWhitelist,
    response: ipWhitelistResponse,
    error: ipWhitelistError,
    loading: ipWhitelistLoading,
  } = useGetRequest();

  useEffect(() => {
    getIpWhitelist(endPoints.payout.ipWhitelist + "/" + id);
  }, [successAction]);

  const [viewAddIpWhitelistModal, setViewAddIpWhitelistModal] = useState(false);
  const [viewDeleteIpWhitelistModal, setViewDeleteIpWhitelistModal] =
    useState(false);
  const [viewUpdateIpWhitelistModal, setViewUpdateIpWhitelistModal] =
    useState(false);
  const [ipWhitelistId, setIpWhitelistId] = useState(null);

  const handleAddIpWhitelist = async () => {
    setViewAddIpWhitelistModal(true);
  };

  const handleDeleteIpWhitelist = async (id) => {
    setViewDeleteIpWhitelistModal(true);
    setIpWhitelistId(id);
  };

  const {
    response: deleteIpResponse,
    error: deleteIpError,
    loading: deleteIpLoading,
    deleteData: deleteIpData,
  } = useDeleteRequest();

  const handleConfirmDeleteIpWhitelist = async () => {
    await deleteIpData(endPoints.payout.ipWhitelist + "/" + ipWhitelistId);
    setIpWhitelistId(null);
    setViewDeleteIpWhitelistModal(false);
    getIpWhitelist(endPoints.payout.ipWhitelist + "/" + id);
  };

  const [active, setActive] = useState("");

  useEffect(() => {
    if (response?.data) {
      setActive(Object.keys(response?.data)[0]);
    }
  }, [response]);

  return (
    <>
      {viewAddPayoutTdrModal && (
        <AddPayoutTdr
          name={name}
          id={id}
          onClose={() => setViewAddPayoutTdrModal(!viewAddPayoutTdrModal)}
          onSuccess={() => setSuccessAction(!successAction)}
        />
      )}
      {viewDeleteWarning && (
        <DeleteWarning
          onClose={() => setViewDeleteWarning(!viewDeleteWarning)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {viewPriorityModal && (
        <UpdatePriority
          acquirerList={acquirers?.data}
          onClose={() => setViewPriorityModal(!viewPriorityModal)}
        />
      )}
      {viewAddAmtLimitModal && (
        <AddTransferLimit
          name={name}
          id={id}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewAddAmtLimitModal(!viewAddAmtLimitModal)}
          data={minAmtLimitResponse?.data}
        />
      )}

      {viewAddIpWhitelistModal && (
        <AddIpWhitelist
          name={name}
          id={id}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewAddIpWhitelistModal(!viewAddIpWhitelistModal)}
        />
      )}

      {viewDeleteIpWhitelistModal && (
        <DeleteWarning
          onClose={() =>
            setViewDeleteIpWhitelistModal(!viewDeleteIpWhitelistModal)
          }
          onConfirm={handleConfirmDeleteIpWhitelist}
        />
      )}

      <div className="row">
        <div className="col-12 mb-2">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="d-flex gap-2">
                TDR Settings
                <span>
                  <i
                    onClick={() => setViewPriorityModal(!viewPriorityModal)}
                    className="bi bi-pencil-square"
                    id={styles.editicon}
                  ></i>
                </span>
              </h6>
              {admin && (
                <i
                  className="bi bi-plus-lg"
                  id={styles.editicon}
                  onClick={() =>
                    setViewAddPayoutTdrModal(!viewAddPayoutTdrModal)
                  }
                ></i>
              )}
            </div>
            <div className="row p-2">
              {(acquirers?.data === null || acquirers?.data?.length === 0) && (
                <div className="col-12 text-center">
                  <small className="text-center">Add Details to view</small>
                </div>
              )}
              {acquirers?.data?.length > 0 && (
                <>
                  <div className="d-flex gap-4 mb-2">
                    {acquirers?.data.map((acquirer, index) => (
                      <div
                        className="d-flex align-items-center gap-1 position-relative"
                        key={acquirer.acquirerId}
                      >
                        {/* i icon tooltip  */}
                        <input
                          type="radio"
                          name="acquirer"
                          id={acquirer.acquirerId}
                          defaultChecked={index === 0}
                          onChange={() =>
                            handleTransferModes(acquirer.acquirerId)
                          }
                        />
                        <Label htmlFor="" label={acquirer.acquirerName} />{" "}
                        <sup>P-{acquirer.priority}</sup>
                      </div>
                    ))}
                  </div>
                  <div className="row d-flex">
                    <div className="col-md-2 col-sm-12 d-flex flex-column">
                      {Object.keys(response?.data ?? {})?.map(
                        (transferMode, index) => (
                          <button
                            className={
                              active === transferMode
                                ? styles.paymentcard + " " + styles.active
                                : styles.paymentcard
                            }
                            onClick={() => setActive(transferMode)}
                            key={index}
                          >
                            {transferMode}
                          </button>
                        )
                      )}
                    </div>

                    <div className="col-md-10 col-sm-12">
                      <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                          <div
                            // id={`collapseOne${index}`}
                            className={`accordion-collapse collapse show`}
                            aria-labelledby="headingOne"
                            // data-bs-parent={`collapseOne${index}`}
                          >
                            <div className="accordion-body">
                              <table className="table" id={styles.table}>
                                <thead>
                                  <tr>
                                    <th>Merchant Charge</th>
                                    <th>Vendor Charge</th>
                                    <th>Bank Charges</th>
                                    <th>PG Charges</th>

                                    <th>Min Amount Limit</th>
                                    <th>Max Amount Limit</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {response?.data[active]?.length > 0 &&
                                    response?.data[active]?.map(
                                      (type, index) => (
                                        <tr key={type?.merchantChargeId}>
                                          <td>{type?.pgCharge}</td>
                                          <td>{type?.bankCharge}</td>
                                          <td>{type?.merchantCharge}</td>
                                          <td>{type?.vendorCharge}</td>
                                          <td>{type?.minimumAmountLimit}</td>
                                          <td>{type?.maximumAmountLimit}</td>
                                          <td>
                                            <div className="d-flex gap-1">
                                              <i
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                  handleViewDeleteWarning(
                                                    type.merchantAcquirerTransferModeMappingId
                                                  )
                                                }
                                                className="bi bi-trash text-danger"
                                              ></i>
                                            </div>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Amount Limit</h6>

              {minAmtLimitResponse?.data?.amountLimitId ? (
                <i
                  className="bi bi-pencil"
                  id={styles.editicon}
                  onClick={() => setViewAddAmtLimitModal(true)}
                ></i>
              ) : (
                admin && (
                  <i
                    className="bi bi-plus-lg"
                    id={styles.editicon}
                    onClick={() =>
                      setViewAddAmtLimitModal(!viewAddAmtLimitModal)
                    }
                  ></i>
                )
              )}
            </div>

            <div className="row p-2">
              <div className="col-12 text-center overflow-auto">
                {!minAmtLimitResponse?.data && (
                  <small className="text-center">Add Details to view</small>
                )}

                {minAmtLimitResponse?.data && (
                  <table
                    className="table table-responsive-sm overflow-auto"
                    id={styles.table}
                  >
                    <thead>
                      <tr>
                        <th>Merchant</th>
                        <th>Daily Count Limit</th>
                        <th>Daily Amount Limit</th>
                        <th>Minimum Amount Limit / Txn</th>
                        <th style={{ whiteSpace: "nowrap" }}>
                          Maximum Amount Limit / Txn
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr key={minAmtLimitResponse.data.amountLimitId}>
                        <td>
                          {minAmtLimitResponse.data?.merchant?.fullName || "-"}
                        </td>
                        <td>
                          {minAmtLimitResponse.data?.dailyCountLimit ?? 0}
                        </td>
                        <td>
                          {minAmtLimitResponse.data?.dailyAmountLimit ?? 0}
                        </td>
                        <td>
                          {minAmtLimitResponse.data?.minimumAmountPerTxn ?? 0}
                        </td>
                        <td>
                          {minAmtLimitResponse.data?.maximumAmountPerTxn ?? 0}
                        </td>
                        <td className="d-flex gap-1 justify-content-center">
                          <button
                            disabled={deleteLoading}
                            className="table_delete"
                            onClick={() =>
                              handleViewDeleteWarning(
                                minAmtLimitResponse.data.amountLimitId
                              )
                            }
                          >
                            <i className="bi bi-trash-fill text-danger"></i>
                            <small>Delete</small>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ip whitelist  */}
      <div className="row py-4">
        <div className="col-12">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>IP Whitelist</h6>

              {admin && (
                <i
                  className="bi bi-plus-lg"
                  id={styles.editicon}
                  onClick={() => handleAddIpWhitelist()}
                ></i>
              )}
            </div>

            <div className="row p-2">
              <div className="col-12 text-center overflow-auto">
                {ipWhitelistResponse?.data?.length === 0 && (
                  <small className="text-center">Add Details to view</small>
                )}
                {ipWhitelistResponse?.data && (
                  <table
                    className="table table-responsive-sm overflow-auto"
                    id={styles.table}
                  >
                    <thead>
                      <tr>
                        <th>IP Address</th>
                        <th>Created Date</th>

                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ipWhitelistResponse?.data?.map((ip) => (
                        <tr key={ip.ipAddress}>
                          <td>{ip?.ipAddress || "-"}</td>
                          <td>{ip?.createdDate || 0}</td>

                          <td className="d-flex gap-1 justify-content-center">
                            <button
                              disabled={deleteLoading}
                              className="table_delete"
                              onClick={() =>
                                handleDeleteIpWhitelist(ip.ipWhiteListId)
                              }
                            >
                              <i className="bi bi-trash-fill text-danger"></i>
                              <small>Delete</small>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payout;
