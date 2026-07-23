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
    error: changeStatusError,
    response: changeStatusResponse,
    postData: postAquirerStatus,
  } = usePostRequest(endPoints.users.acquirerStatus + "acquirer");

  const {
    error: changePayInStatusError,
    response: changePayInStatusResponse,
    postData: postPayInStatus,
  } = usePostRequest(endPoints.users.acquirerStatus + "payin");

  const {
    error: changePayoutStatusError,
    response: changePayoutStatusResponse,
    postData: postPayoutStatus,
  } = usePostRequest(endPoints.users.acquirerStatus + "payout");

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

  const [viewUpdatePayinModal, setViewUpdatePayinModal] = useState(false);
  const handleUpdatePayin = () => {
    setViewUpdatePayinModal(true);
  };

  const [viewAddPayinModal, setViewAddPayinModal] = useState(false);
  const handleAddPayin = () => {
    setViewAddPayinModal(true);
  };

  const [viewAddPayoutModal, setViewAddPayoutModal] = useState(false);
  const handleAddPayout = () => {
    setViewAddPayoutModal(true);
  };

  const [viewUpdatePayoutModal, setViewUpdatePayoutModal] = useState(false);
  const handleUpdatePayout = () => {
    setViewUpdatePayoutModal(true);
  };

  const refreshAcquirer = () =>
    getData(endPoints.users.acquirer + "/" + decryptParams(param.acquirerId));

  if (error) return <p className="text-center">Error: {error.message}</p>;

  if (loading || !response) {
    return (
      <div className={styles.page}>
        <div className={styles.mainCard}>
          <div className={styles.profileGrid}>
            <div className={styles.profileCol}>
              <div className={styles.info}>
                <span className={`${styles.shimmer} ${styles.skelAvatar}`} />
                <div className={styles.profileMeta} style={{ flex: 1 }}>
                  <span
                    className={`${styles.shimmer} ${styles.skelLine}`}
                    style={{ width: "70%" }}
                  />
                  <span
                    className={`${styles.shimmer} ${styles.skelLine}`}
                    style={{ width: "40%" }}
                  />
                  <span
                    className={`${styles.shimmer} ${styles.skelLine}`}
                    style={{ width: "55%" }}
                  />
                </div>
              </div>
            </div>
            {[0, 1].map((col) => (
              <div className={styles.profileCol} key={col}>
                <span
                  className={`${styles.shimmer} ${styles.skelLine}`}
                  style={{ width: "35%", height: 14 }}
                />
                {[80, 65, 55].map((width, index) => (
                  <span
                    key={index}
                    className={`${styles.shimmer} ${styles.skelLine}`}
                    style={{ width: `${width}%`, display: "block" }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {[0, 1].map((card) => (
          <div className={styles.secondaryCard} key={card}>
            <span
              className={`${styles.shimmer} ${styles.skelLine}`}
              style={{ width: "28%", height: 14 }}
            />
            <span
              className={`${styles.shimmer} ${styles.skelBlock}`}
              style={{ marginTop: 8 }}
            />
          </div>
        ))}
      </div>
    );
  }

  const data = response.data;

  return (
    <div className={styles.page}>
      {viewUpdatePayinModal && (
        <UpdatePayin
          name={data.fullName}
          id={data.acquirerId}
          onSuccess={refreshAcquirer}
          onClose={() => setViewUpdatePayinModal(!viewUpdatePayinModal)}
          response={data}
        />
      )}
      {viewAddPayinModal && (
        <AddPayin
          name={data.fullName}
          id={data.acquirerId}
          onSuccess={refreshAcquirer}
          onClose={() => setViewAddPayinModal(!viewAddPayinModal)}
          response={data}
        />
      )}
      {viewAddPayoutModal && (
        <AddPayout
          name={data.fullName}
          id={data.acquirerId}
          onSuccess={refreshAcquirer}
          onClose={() => setViewAddPayoutModal(!viewAddPayoutModal)}
          response={data}
        />
      )}
      {viewUpdatePayoutModal && (
        <UpdatePayout
          name={data.fullName}
          id={data.acquirerId}
          onSuccess={refreshAcquirer}
          onClose={() => setViewUpdatePayoutModal(!viewUpdatePayoutModal)}
          response={data}
        />
      )}

      <div className={styles.mainCard}>
        <div className={styles.profileGrid}>
          <div className={styles.profileCol}>
            <div className={styles.info}>
              <Image src={avatar} alt="profile-image" width={52} height={52} />
              <div className={styles.profileMeta}>
                <h5>{data?.fullName || "NA"}</h5>
                <span className={styles.roleLabel}>Acquirer</span>
                <div className={styles.statusRow}>
                  {data?.status ? (
                    <span className={styles.statusActive}>Active</span>
                  ) : (
                    <span className={styles.statusInactive}>Inactive</span>
                  )}
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="acquirerStatusSwitch"
                      checked={!!data?.status}
                      onChange={() =>
                        handleChangeStatus(data?.acquirerId, "acquirer")
                      }
                    />
                  </div>
                </div>
                <span className={styles.codeText}>
                  code: {data?.acquirerCode || "NA"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.profileCol}>
            <div className={styles.sectionHeader}>
              <h6 className={styles.sectionTitle}>Payin</h6>
              <div className={styles.headerActions}>
                {data?.payin ? (
                  <span className={styles.statusActive}>Active</span>
                ) : (
                  <span className={styles.statusInactive}>Inactive</span>
                )}
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="payinStatusSwitch"
                    checked={!!data?.payin}
                    onChange={() =>
                      handleChangeStatus(data?.acquirerId, "payin")
                    }
                  />
                </div>
                {data?.acquirerPgId ? (
                  <i
                    className="bi bi-pencil-fill"
                    id={styles.editicon}
                    onClick={handleUpdatePayin}
                  />
                ) : (
                  <i
                    className="bi bi-plus-lg"
                    id={styles.editicon}
                    onClick={handleAddPayin}
                  />
                )}
              </div>
            </div>
            <div className={styles.detail}>
              <table>
                <tbody>
                  <tr>
                    <td>ID</td>
                    <td>{data?.acquirerPgId || "NA"}</td>
                  </tr>
                  <tr>
                    <td>Key</td>
                    <td>
                      <SecretViewer text={data?.acquirerPgKey} />
                    </td>
                  </tr>
                  <tr>
                    <td>Password</td>
                    <td>
                      <SecretViewer text={data?.acquirerPgPassword} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.profileCol}>
            <div className={styles.sectionHeader}>
              <h6 className={styles.sectionTitle}>Payout</h6>
              <div className={styles.headerActions}>
                {data?.payout ? (
                  <span className={styles.statusActive}>Active</span>
                ) : (
                  <span className={styles.statusInactive}>Inactive</span>
                )}
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="payoutStatusSwitch"
                    checked={!!data?.payout}
                    onChange={() =>
                      handleChangeStatus(data?.acquirerId, "payout")
                    }
                  />
                </div>
                {data?.acquirerPayoutPgId ? (
                  <i
                    className="bi bi-pencil-fill"
                    id={styles.editicon}
                    onClick={handleUpdatePayout}
                  />
                ) : (
                  <i
                    className="bi bi-plus-lg"
                    id={styles.editicon}
                    onClick={handleAddPayout}
                  />
                )}
              </div>
            </div>
            <div className={styles.detail}>
              <table>
                <tbody>
                  <tr>
                    <td>ID</td>
                    <td>{data?.acquirerPayoutPgId || "NA"}</td>
                  </tr>
                  <tr>
                    <td>Key</td>
                    <td>
                      <SecretViewer text={data?.acquirerPayoutPgKey} />
                    </td>
                  </tr>
                  <tr>
                    <td>Password</td>
                    <td>
                      <SecretViewer text={data?.acquirerPayoutPgPassword} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Mapping name={data?.fullName} id={decryptParams(param.acquirerId)} />
    </div>
  );
};

export default Details;
