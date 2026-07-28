import AddSettlementCycle from "../modals/AddSettlementCycle";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import AddRollingReserve from "../modals/AddRollingReserve";
import usePutRequest from "@/app/hooks/usePut";
import { successMsg } from "@/app/services/notify";
import UpdateRollingReserve from "../modals/UpdateRollingReserve";

const SettlementCycle = ({ isAdmin, name, id, isMerchant }) => {
  const [successAction, setSuccessAction] = useState(false);
  const { getData, response = [] } = useGetRequest();
  const { getData: rollingData, response: rollingResponse } = useGetRequest();
  useEffect(() => {
    getData(endPoints.mapping.settlementCycle + "/" + id);
  }, [successAction]);

  useEffect(() => {
    rollingData(endPoints.rollingReserve.rollingReserve + id);
  }, [successAction]);

  // Add Settlement Cycle Logic

  const [viewAddSettlementCycleModal, setViewAddSettlementCycleModal] =
    useState(false);

  const [viewAddRollingReserveModal, setViewAddRollingReserveModal] =
    useState(false);

  const [viewUpdateRollingReserveModal, setViewUpdateRollingReserveModal] =
    useState(false);
  const {
    putData,
    response: putResponse,
    error: putError,
  } = usePutRequest(endPoints.rollingReserve.rollingReserve);

  useEffect(() => {
    if (putResponse && !putError) {
      successMsg("Rolling reserve status updated successfully");
    }
  }, [putResponse, putError]);
  return (
    <>
      {viewAddRollingReserveModal && (
        <AddRollingReserve
          name={name}
          id={id}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() =>
            setViewAddRollingReserveModal(!viewAddRollingReserveModal)
          }
        />
      )}
      {viewUpdateRollingReserveModal && (
        <UpdateRollingReserve
          rollingResponse={rollingResponse}
          name={name}
          id={id}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() =>
            setViewUpdateRollingReserveModal(!viewUpdateRollingReserveModal)
          }
        />
      )}
      {viewAddSettlementCycleModal && (
        <AddSettlementCycle
          name={name}
          id={id}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() =>
            setViewAddSettlementCycleModal(!viewAddSettlementCycleModal)
          }
        />
      )}
      <div className="row">
        <div className="col-12 mb-3">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Settlement Cycle</h6>
              {!isMerchant && (
                <i
                  className="bi bi-plus-lg"
                  id={styles.editicon}
                  onClick={() => setViewAddSettlementCycleModal(true)}
                ></i>
              )}
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <div className="text-center">
                  {(response?.data === null || response?.data.length === 0) && (
                    <small className="text-center">
                      Add Settlement Cycle to view
                    </small>
                  )}
                </div>
                {response?.data && (
                  <table
                    className="table table-responsive-sm overflow-auto"
                    id={styles.table}
                  >
                    <thead>
                      <tr>
                        <th>Settlement Type</th>
                        <th>Day</th>
                        <th>Settlement Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{response?.data.settlementType || "NA"}</td>
                        <td>{response?.data.day || "NA"}</td>
                        <td>{response?.data.settlementTime || "NA"}</td>
                        <td>
                          {response?.data.settlementActive
                            ? "Active"
                            : "Inactive"}
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
      <div className="row">
        <div className="col-12 mb-3">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Rolling Reserve</h6>
              {isAdmin && (
                <i
                  className="bi bi-plus-lg"
                  id={styles.editicon}
                  onClick={() => setViewAddRollingReserveModal(true)}
                ></i>
              )}
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <div className="text-center">
                  {(rollingResponse?.data === null ||
                    rollingResponse?.data.length === 0) && (
                    <small className="text-center">
                      Add rolling reserve to view
                    </small>
                  )}
                </div>
                {rollingResponse?.data && (
                  <table
                    className="table table-responsive-sm overflow-auto"
                    id={styles.table}
                  >
                    <thead>
                      <tr>
                        <th>Reserve Percentage</th>
                        <th>Hold Days</th>
                        <th>Total Held Amount</th>
                        <th>Total Released Amount</th>
                        <th>Currency</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {rollingResponse?.data.reservePercentage || "NA"}
                        </td>
                        <td>{rollingResponse?.data.holdDays || "NA"}</td>
                        <td>{rollingResponse?.data.totalHeldAmount}</td>
                        <td>{rollingResponse?.data.totalReleasedAmount}</td>
                        <td>{rollingResponse?.data.currency}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id={`rrActiveSwitch-${id}`}
                                checked={!!rollingResponse?.data?.active}
                                onChange={async (e) => {
                                  const active = e.target.checked;
                                  const identifier =
                                    name && name.includes("@") ? name : id;
                                  const toggleUrl = `${endPoints.rollingReserve.rollingReserve}${identifier}/toggle`;
                                  await putData({ active }, { url: toggleUrl });
                                  setSuccessAction((s) => !s);
                                }}
                              />
                            </div>
                            <i
                              className="bi bi-pencil"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setViewUpdateRollingReserveModal(true);
                              }}
                            ></i>
                          </div>
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
    </>
  );
};

export default SettlementCycle;
