"use client";
import styles from "../page.module.css";
import avatar from "../../../../../../public/images/programmer.png";
import Tabs from "./Tabs";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { decryptParams } from "@/app/utils/decryptions";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import UpdateAccount from "../modals/UpdateAccount";
import { dateFormatter } from "@/app/utils/dateFormatter";
import UpdateLogo from "../modals/UpdateLogo";
import Business from "./Business";

const ResellerDetails = ({ merchant, admin, userEmail }) => {
  console.log("🚀 ~ ResellerDetails ~ userEmail:", userEmail);
  const param = useParams();
  const [successAction, setSuccessAction] = useState(false);
  const [tab, setTabs] = useState(1);
  async function handleTabs(data) {
    setTabs(data);
  }
  const { loading, error, response, getData } = useGetRequest();
  console.log("🚀 ~ Details ~ response:", response);
  useEffect(() => {
    getData(endPoints.users.reseller + "/" + decryptParams(param.resellerId));
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
    return <p className="text-center">Please wait while data is loading</p>;
  if (error)
    return (
      <p className="text-center">
        Error: {error.message || "Error loading data"}
      </p>
    );
  if (response) {
    return (
      <>
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
          <div className="row">
            <div
              className="col-lg-6 col-md-12 col-sm-12"
              style={{ borderRight: "3px dashed gray" }}
            >
              <div className={styles.info}>
                {brandLogo && !errorBrandLogo && (
                  <Image
                    src={imgSrc}
                    alt="profile image"
                    onError={() => setImgSrc(avatar)}
                    width={50}
                    height={50}
                  />
                )}
                <i
                  className="bi bi-pencil-fill"
                  id={styles.editicon}
                  onClick={() => setViewUpdateLogoModal(true)}
                ></i>
                <span className="d-flex flex-column">
                  <h5>
                    {response?.data?.fullName || ""}
                    <i className="bi bi-patch-check-fill text-success"></i>
                  </h5>

                  <span className={styles.designation}>
                    <span>Reseller</span>
                  </span>
                  <span className={styles.employeeid}>
                    <b>Reseller ID: {response?.data?.userId}</b>
                    <span>
                      Registration Date: {response?.data?.createdDate || "-"}
                    </span>
                    <span className="text-success">
                      Verification Date:
                      {response?.data?.verificationDate || "Not Verified"}
                    </span>
                  </span>
                </span>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12">
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
                      <td>{response?.data?.contactNumber}</td>
                    </tr>
                    <tr>
                      <td>Email:</td>
                      <td>{response?.data?.userId}</td>
                    </tr>
                    <tr>
                      <td>Birthday:</td>
                      <td>
                        {response?.data?.dateOfBirth
                          ? dateFormatter(response?.data?.dateOfBirth)
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td>Address:</td>
                      <td>{response?.data?.addressDetails || "-"}</td>
                    </tr>
                    <tr>
                      <td>Gender:</td>
                      <td>{response?.data?.gender || "-"}</td>
                    </tr>
                  </tbody>
                </table>
                <i
                  className="bi bi-pencil-fill"
                  id={styles.editicon}
                  onClick={handleUpdateAccount}
                ></i>
              </div>
            </div>
          </div>
          <Tabs handleTabs={handleTabs} />
        </div>

        {tab === 1 && (
          <Business
            name={response?.data.fullName}
            userEmail={userEmail}
            role={merchant}
            admin={admin}
            loginLogo={response?.data.loginLogo}
            brandLogo={response?.data.brandLogo}
            pageLogo={response?.data.pageLogo}
          />
        )}
      </>
    );
  }
};

export default ResellerDetails;
