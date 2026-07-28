"use client";
import styles from "../page.module.css";
import avatar from "../../../../../../public/images/programmer.png";
import { useEffect, useState } from "react";
import Image from "next/image";
import Mapping from "./Mapping";
import { useParams } from "next/navigation";
import { decryptParams } from "@/app/utils/decryptions";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import usePostRequest from "@/app/hooks/usePost";
import { successMsg } from "@/app/services/notify";
import UpdatePayin from "../modals/UpdatePayin";
import AddPayin from "../modals/AddPayin";
import SecretViewer from "@/app/ui/secretViewer/SecretViewer";
import UpdatePayout from "../modals/UpdatePayout";
import AddPayout from "../modals/AddPayout";
const Details = () => {
  const param = useParams();
  const { loading, error, response = [], getData } = useGetRequest();
  useEffect(() => {
    getData(endPoints.users.acquirer + "/" + decryptParams(param.acquirerId));
  }, []);

  const {
    loading: changeStatusLoading,
    error: changeStatusError,
    response: changeStatusResponse,
    postData: postAquirerStatus,
  } = usePostRequest(endPoints.users.acquirerStatus + "acquirer");

  const {
    loading: changePayInStatusLoading,
    error: changePayInStatusError,
    response: changePayInStatusResponse,
    postData: postPayInStatus,
  } = usePostRequest(endPoints.users.acquirerStatus + "payin");
  const {
    loading: changePayoutStatusLoading,
    error: changePayoutStatusError,
    response: changePayoutStatusResponse,
    postData: postPayoutStatus,
  } = usePostRequest(endPoints.users.acquirerStatus + "payout");

  // Change acquirer status
  const handleChangeStatus = async (acqId, type) => {
    if (type === "acquirer") {
      await postAquirerStatus({ acquirerId: acqId });
    }
    if (type === "payin") {
      await postPayInStatus({ acquirerId: acqId });
    }
    if (type === "payout") {
      await postPayoutStatus({ acquirerId: acqId });
    }
  };
  useEffect(() => {
    if (changeStatusResponse && !changeStatusError) {
      successMsg(changeStatusResponse.data.message);
      getData(endPoints.users.acquirer + "/" + decryptParams(param.acquirerId));
    }
  }, [changeStatusError, changeStatusResponse]);

  useEffect(() => {
    if (changePayInStatusResponse && !changePayInStatusError) {
      successMsg(changePayInStatusResponse.data.message);
      getData(endPoints.users.acquirer + "/" + decryptParams(param.acquirerId));
    }
  }, [changePayInStatusError, changePayInStatusResponse]);

  useEffect(() => {
    if (changePayoutStatusResponse && !changePayoutStatusError) {
      successMsg(changePayoutStatusResponse.data.message);
      getData(endPoints.users.acquirer + "/" + decryptParams(param.acquirerId));
    }
  }, [changePayoutStatusError, changePayoutStatusResponse]);

  // Update Logic
  const [viewUpdatePayinModal, setViewUpdatePayinModal] = useState(false);
  const handleUpdatePayin = () => {
    setViewUpdatePayinModal(true);
  };

  // Add Payin Logic
  const [viewAddPayinModal, setViewAddPayinModal] = useState(false);
  const handleAddPayin = () => {
    setViewAddPayinModal(true);
  };

  // Add Payout Logic
  const [viewAddPayoutModal, setViewAddPayoutModal] = useState(false);
  const handleAddPayout = () => {
    setViewAddPayoutModal(true);
  };

  // Update Payout Logic
  const [viewUpdatePayoutModal, setViewUpdatePayoutModal] = useState(false);
  const handleUpdatePayout = () => {
    setViewUpdatePayoutModal(true);
  };

  if (error) return <p className="text-center">Error: {error.message}</p>;
  if (loading)
    return <p className="text-center">Please wait while fetching data...</p>;
  if (response) {
    return (
      <>
        {viewUpdatePayinModal && (
          <UpdatePayin
            name={response.data.fullName}
            id={response.data.acquirerId}
            onSuccess={() =>
              getData(
                endPoints.users.acquirer + "/" + decryptParams(param.acquirerId)
              )
            }
            onClose={() => setViewUpdatePayinModal(!viewUpdatePayinModal)}
            response={response.data}
          />
        )}
        {viewAddPayinModal && (
          <AddPayin
            name={response.data.fullName}
            id={response.data.acquirerId}
            onSuccess={() =>
              getData(
                endPoints.users.acquirer + "/" + decryptParams(param.acquirerId)
              )
            }
            onClose={() => setViewAddPayinModal(!viewAddPayinModal)}
            response={response.data}
          />
        )}

        {viewAddPayoutModal && (
          <AddPayout
            name={response.data.fullName}
            id={response.data.acquirerId}
            onSuccess={() =>
              getData(
                endPoints.users.acquirer + "/" + decryptParams(param.acquirerId)
              )
            }
            onClose={() => setViewAddPayoutModal(!viewAddPayoutModal)}
            response={response.data}
          />
        )}

        {viewUpdatePayoutModal && (
          <UpdatePayout
            name={response.data.fullName}
            id={response.data.acquirerId}
            onSuccess={() =>
              getData(
                endPoints.users.acquirer + "/" + decryptParams(param.acquirerId)
              )
            }
            onClose={() => setViewUpdatePayoutModal(!viewUpdatePayoutModal)}
            response={response.data}
          />
        )}

        <div className={styles.mainCard}>
          <div className="row">
            <div
              className="col-md-4 col-sm-12"
              style={{ borderRight: "3px dashed gray" }}
            >
              <div className={styles.info}>
                <Image src={avatar} alt="profile-image" />

                <span className="d-flex flex-column">
                  <h5>{response?.data.fullName || "NA"}</h5>
                  <span className={styles.designation}>
                    <span>Acquirer code:{response?.data.acquirerCode}</span>
                    <span className="d-flex gap-2">
                      {response?.data.status ? (
                        <b className="text-success">Active</b>
                      ) : (
                        <b className="text-danger">Inactive</b>
                      )}
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckDefault"
                          checked={response?.data.status}
                          onChange={() =>
                            handleChangeStatus(
                              response?.data.acquirerId,
                              "acquirer"
                            )
                          }
                        />
                      </div>
                    </span>
                  </span>
                </span>
              </div>
            </div>
            <div
              style={{ borderRight: "3px dashed gray" }}
              className="col-md-4 col-sm-12"
            >
              <div className={styles.detail} style={{ marginBottom: 8 }}>
                <b>Payin</b>
                <span className="d-flex gap-2">
                  {response?.data && (
                    <span className="d-flex gap-2 ">
                      {response?.data.payin ? (
                        <span className="text-success">Active</span>
                      ) : (
                        <span className="text-danger">Inactive</span>
                      )}
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckDefault"
                          checked={response?.data.payin}
                          onChange={() =>
                            handleChangeStatus(
                              response?.data.acquirerId,
                              "payin"
                            )
                          }
                        />
                      </div>
                    </span>
                  )}

                  {response?.data?.acquirerPgId ? (
                    <i
                      className="bi bi-pencil-fill"
                      id={styles.editicon}
                      onClick={handleUpdatePayin}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-plus-circle"
                      id={styles.editicon}
                      onClick={handleAddPayin}
                    ></i>
                  )}
                </span>
              </div>
              {response?.data && (
                <div className={styles.detail}>
                  <table>
                    <thead className="hidden">
                      <tr>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ID</td>
                        <td>{response?.data.acquirerPgId || "NA"}</td>
                      </tr>
                      <tr>
                        <td>Key</td>
                        <td>
                          <SecretViewer text={response?.data.acquirerPgKey} />
                        </td>
                      </tr>
                      <tr>
                        <td>Password</td>
                        <td>
                          <SecretViewer
                            text={response?.data.acquirerPgPassword}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="col-md-4 col-sm-12">
              <div className={styles.detail} style={{ marginBottom: 8 }}>
                <b>Payout</b>
                <span className="d-flex gap-2">
                  {response?.data && (
                    <span className="d-flex gap-2">
                      {response?.data.payout ? (
                        <span className="text-success">Active</span>
                      ) : (
                        <span className="text-danger">Inactive</span>
                      )}
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckDefault"
                          checked={response?.data.payout}
                          onChange={() =>
                            handleChangeStatus(
                              response?.data.acquirerId,
                              "payout"
                            )
                          }
                        />
                      </div>
                    </span>
                  )}
                  {response?.data.acquirerPayoutPgId ? (
                    <i
                      className="bi bi-pencil-fill"
                      id={styles.editicon}
                      onClick={handleUpdatePayout}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-plus-circle"
                      id={styles.editicon}
                      onClick={handleUpdatePayout}
                    ></i>
                  )}
                </span>
              </div>
              {/* {JSON.stringify(response?.data)} */}
              {response?.data && (
                <div className={styles.detail}>
                  <table>
                    <thead className="hidden">
                      <tr>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ID</td>
                        <td>{response?.data.acquirerPayoutPgId || "NA"}</td>
                      </tr>
                      <tr>
                        <td>Key</td>
                        <td>
                          <SecretViewer
                            text={response?.data.acquirerPayoutPgKey}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Password</td>
                        <td>
                          {/* {response?.data.acquirerPayoutPgPassword || "NA"} */}
                          <SecretViewer
                            text={response?.data.acquirerPayoutPgPassword}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <Mapping
          name={response?.data.fullName}
          id={decryptParams(param.acquirerId)}
        />
      </>
    );
  }
};

export default Details;
