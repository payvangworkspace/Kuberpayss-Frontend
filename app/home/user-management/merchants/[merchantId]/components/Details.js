"use client";
import styles from "../page.module.css";
import avatar from "../../../../../../public/images/programmer.png";
import Tabs from "./Tabs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Personal from "./Personal";
import Business from "./Business";
import Payin from "./Payin";
import { useParams } from "next/navigation";
import { decryptParams } from "@/app/utils/decryptions";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import Documents from "./Documents";
import Currency from "./Currency";
import UpdateAccount from "../modals/UpdateAccount";
import Country from "./Country";
import Webhooks from "./Webhooks";
import { dateFormatter } from "@/app/utils/dateFormatter";
import SettlementCycle from "./SettlementCycle";
import UpdateLogo from "../modals/UpdateLogo";
import Notification from "./Notification";
import Payout from "./Payout";
import RefundLimit from "./RefundLimit";

const Details = ({ merchant, admin }) => {
  const param = useParams();
  const [successAction, setSuccessAction] = useState(false);
  const [tab, setTabs] = useState(1);
  async function handleTabs(data) {
    setTabs(data);
  }
  const { loading, error, response, getData } = useGetRequest();
  useEffect(() => {
    getData(endPoints.users.merchant + "/" + decryptParams(param.merchantId));
  }, [successAction]);
  // Update Logic
  const [viewUpdateModal, setViewUpdateModal] = useState(false);
  const [viewUpdateLogoModal, setViewUpdateLogoModal] = useState(false);

  const handleUpdateAccount = () => {
    setViewUpdateModal(true);
  };

  // Brand logo get logic
  const {
    getData: getBrandLogo,
    response: brandLogo,
    error: errorBrandLogo,
    loading: loadingBrandLogo,
  } = useGetRequest();

  useEffect(() => {
    getBrandLogo(
      endPoints.users.account.logo +
        "/brandLogo/" +
        decryptParams(param.merchantId),
      true
    );
  }, []);

  const [imgSrc, setImgSrc] = useState();
  useEffect(() => {
    if (brandLogo && !errorBrandLogo) {
      setImgSrc(brandLogo);
    }
  }, [errorBrandLogo, brandLogo]);
  // Component rendering logic
  if (loading)
    return (
      <div className={styles.page}>
        <div className={styles.mainCard}>
          <div className={styles.profileGrid}>
            <div className={styles.profileLeft}>
              <span className={`${styles.shimmer} ${styles.skelAvatar}`} />
              <div className={styles.profileMeta} style={{ flex: 1 }}>
                <span
                  className={`${styles.shimmer} ${styles.skelLine}`}
                  style={{ width: "55%" }}
                />
                <span
                  className={`${styles.shimmer} ${styles.skelLine}`}
                  style={{ width: "35%" }}
                />
                <span
                  className={`${styles.shimmer} ${styles.skelLine}`}
                  style={{ width: "70%" }}
                />
                <span
                  className={`${styles.shimmer} ${styles.skelLine}`}
                  style={{ width: "50%" }}
                />
              </div>
            </div>
            <div className={styles.profileRight}>
              {[80, 65, 45, 70, 40].map((width, index) => (
                <span
                  key={index}
                  className={`${styles.shimmer} ${styles.skelLine}`}
                  style={{ width: `${width}%`, display: "block" }}
                />
              ))}
            </div>
          </div>
          <div className={styles.skelTabs}>
            {Array.from({ length: 8 }).map((_, index) => (
              <span
                key={index}
                className={`${styles.shimmer} ${styles.skelTab}`}
              />
            ))}
          </div>
        </div>

        <div className="row g-2">
          {[0, 1].map((cardIndex) => (
            <div className="col-lg-6 col-md-12 col-sm-12" key={cardIndex}>
              <div className={styles.secondaryCard}>
                <span
                  className={`${styles.shimmer} ${styles.skelLine}`}
                  style={{ width: "30%", height: 14 }}
                />
                {[85, 70, 60, 75, 50].map((width, index) => (
                  <span
                    key={index}
                    className={`${styles.shimmer} ${styles.skelLine}`}
                    style={{ width: `${width}%`, display: "block" }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <p className="text-center">
        Error: {error.message || "Error loading data"}
      </p>
    );
  if (response) {
    return (
      <div className={styles.page}>
        {viewUpdateModal && (
          <UpdateAccount
            onClose={() => setViewUpdateModal(!viewUpdateModal)}
            onSuccess={() => setSuccessAction(!successAction)}
            response={response?.data}
          />
        )}
        {viewUpdateLogoModal && (
          <UpdateLogo
            name={response?.data.fullName}
            id={response?.data.userId}
            onClose={() => setViewUpdateLogoModal(!viewUpdateLogoModal)}
            onSuccess={() => setSuccessAction(!successAction)}
          />
        )}
        <div className={styles.mainCard}>
          <div className={styles.profileGrid}>
            <div className={styles.profileLeft}>
              <div className={styles.avatarWrap}>
                {brandLogo && !errorBrandLogo && (
                  <Image
                    src={imgSrc}
                    alt="profile image"
                    onError={() => setImgSrc(avatar)}
                    width={52}
                    height={52}
                  />
                )}
                <i
                  className={`bi bi-pencil-fill ${styles.editIcon} ${styles.logoEdit}`}
                  id={styles.editicon}
                  onClick={() => setViewUpdateLogoModal(true)}
                ></i>
              </div>
              <div className={styles.profileMeta}>
                <h5 className={styles.profileName}>
                  {response?.data.fullName}{" "}
                  <i className="bi bi-patch-check-fill text-success"></i>
                </h5>

                <span className={styles.designation}>
                  <span>Merchant</span>
                </span>
                <span className={styles.employeeid}>
                  <b>Merchant ID: {response?.data.userId}</b>
                  <span>
                    Registration Date: {response?.data.createdDate || "-"}
                  </span>
                  <span className={styles.verifiedDate}>
                    Verification Date:{" "}
                    {response?.data.verificationDate || "Not Verified"}
                  </span>
                </span>
              </div>
            </div>
            <div className={styles.profileRight}>
              <div className={styles.detail}>
                <table className="table table-borderless table-sm">
                  <thead className="hidden">
                    <tr>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Phone:</td>
                      <td>{response?.data.contactNumber}</td>
                    </tr>
                    <tr>
                      <td>Email:</td>
                      <td>{response?.data.userId}</td>
                    </tr>
                    <tr>
                      <td>Birthday:</td>
                      <td>
                        {response?.data.dateOfBirth
                          ? dateFormatter(response?.data.dateOfBirth)
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td>Address:</td>
                      <td>{response?.data.addressDetails || "-"}</td>
                    </tr>
                    <tr>
                      <td>Gender:</td>
                      <td>{response?.data.gender || "-"}</td>
                    </tr>
                  </tbody>
                </table>
                <i
                  className={`bi bi-pencil-fill ${styles.editIcon}`}
                  id={styles.editicon}
                  onClick={handleUpdateAccount}
                ></i>
              </div>
            </div>
          </div>
          <Tabs handleTabs={handleTabs} isAdmin={admin} />
        </div>

        {tab === 1 && (
          <Personal
            id={decryptParams(param.merchantId)}
            appId={response?.data.appKey}
            secretId={response?.data.secretKey}
            data={response?.data}
            merchant={merchant}
          />
        )}
        {tab === 2 && (
          <Business
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
            role={merchant}
            admin={admin}
            loginLogo={response?.data.loginLogo}
            brandLogo={response?.data.brandLogo}
            pageLogo={response?.data.pageLogo}
          />
        )}
        {tab === 3 && (
          <Payin
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
            admin={admin}
          />
        )}
        {tab === 4 && (
          <Payout
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
            admin={admin}
          />
        )}
        {tab === 5 && (
          <Documents
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
            role={merchant}
          />
        )}
        {tab === 6 && (
          <Currency
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
          />
        )}
        {tab === 7 && (
          <Country
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
          />
        )}
        {tab === 8 && (
          <Webhooks
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
            isAdmin={admin}
          />
        )}
        {tab === 9 && (
          <SettlementCycle
            isAdmin={admin}
            isMerchant={merchant}
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
          />
        )}
        {tab === 10 && (
          <RefundLimit
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
          />
        )}
        {tab === 11 && (
          <Notification
            isMerchant={merchant}
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
          />
        )}
      </div>
    );
  }
};

export default Details;
