import useGetRequest from "@/app/hooks/useFetch";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import ViewLogo from "../documents/viewLogo";
import AddBank from "../modals/AddBank";
import UpdateBank from "../modals/UpdateBankModal";
import UpdateBusiness from "../modals/UpdateBusiness";

const Business = ({
  name,
  id,
  role,
  loginLogo,
  brandLogo,
  pageLogo,
  userEmail,
  admin,
}) => {
  const [viewLogo, setViewLogo] = useState(false);
  const [logoId, setLogoId] = useState(null);
  const handleViewLogo = (type) => {
    setLogoId(type);
    setViewLogo(true);
  };
  // Request for business details
  const {
    error: errorBusiness,
    response: responseBusiness,
    getData: getBusinessDetail,
  } = useGetRequest();
  const [successEdit, setSuccessEdit] = useState(null);
  useEffect(() => {
    getBusinessDetail(
      endPoints.users.user + endPoints.users.account["business"] + "/" + id
    );
  }, [successEdit]);
  // Request to fetch bank details
  const {
    error: errorBank,
    response: responseBank,
    getData: getBankDetail,
  } = useGetRequest();
  useEffect(() => {
    getBankDetail(
      endPoints.users.user + endPoints.users.account["bank"] + "/" + userEmail
    );
  }, [successEdit]);
  const [viewAddBankModal, setViewAddBankModal] = useState(false);
  const [viewUpdateBusinessModal, setViewUpdateBusinessModal] = useState(false);
  const handleViewUpdateBusiness = () => {
    setViewUpdateBusinessModal(true);
  };
  const [selectedBank, setSelectedBank] = useState(null);
  const [viewUpdateBankModal, setViewUpdateBankModal] = useState(false);
  const handleViewUpdateBank = (bank) => {
    setSelectedBank(bank);
    setViewUpdateBankModal(true);
  };
  // Conditional rendering of page on fetched data
  if (errorBusiness || errorBank) {
    return (
      <p className="text-center">
        Something went wrong while fetching data. Please refresh the browser.
      </p>
    );
  }

  const businessData = responseBusiness?.data || {};

  const missingFields = [];

  if (!businessData.businessName) missingFields.push("Business Name");
  if (!businessData.companyRegistrationNo)
    missingFields.push("Registration No");
  if (!businessData.businessEmail) missingFields.push("Business Email");
  if (!businessData.phone) missingFields.push("Phone");
  if (!businessData.businessAddress) missingFields.push("Address");

  return (
    <>
      {viewLogo && (
        <ViewLogo
          merchantId={id}
          logoId={logoId}
          onClose={() => setViewLogo(!viewLogo)}
        />
      )}
      {viewAddBankModal && (
        <AddBank
          name={name}
          id={id}
          onSuccess={() => setSuccessEdit(!successEdit)}
          onClose={() => setViewAddBankModal(!viewAddBankModal)}
        />
      )}
      {viewUpdateBusinessModal && (
        <UpdateBusiness
          name={name}
          id={id}
          businessId={responseBusiness?.data?.id}
          onSuccess={() => setSuccessEdit(!successEdit)}
          responseBusiness={responseBusiness?.data}
          role={admin}
          onClose={() => setViewUpdateBusinessModal(!viewUpdateBusinessModal)}
        />
      )}
      {viewUpdateBankModal && selectedBank && (
        <UpdateBank
          name={name}
          id={id}
          responseBank={[selectedBank]} // keep array format
          bankDetailId={selectedBank.bankDetailId}
          onSuccess={() => setSuccessEdit(!successEdit)}
          onClose={() => setViewUpdateBankModal(false)}
        />
      )}
      {/* {missingFields.length > 0 && (
        <div className="alert alert-warning">
          <strong>⚠ Incomplete Business Profile:</strong>
          <div>
            Please complete the following fields:
            <ul className="mb-0">
              {missingFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
        </div>
      )} */}
      {/* <div className="row">
        <div className="col-12 mb-4">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Business Details</h6>

              <i
                className="bi bi-pencil-fill"
                id={styles.editicon}
                onClick={handleViewUpdateBusiness}
              ></i>
            </div>
            <div className="row p-2">
              <div className="col-md-6">
                <table
                  className="table table-borderless table-sm"
                  id={styles.infotable}
                >
                  <thead className="hidden">
                    <tr>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ width: 180 }}>Business Name</td>
                      <td>{responseBusiness?.data.businessName || "-"}</td>
                    </tr>
                    <tr>
                      <td>Registration No</td>
                      <td>
                        {responseBusiness?.data.companyRegistrationNo || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td>Email Id</td>
                      <td>{responseBusiness?.data.businessEmail || "-"}</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td style={{ color: "#82ca9d" }}>
                        {responseBusiness?.data.phone || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td>Login Logo</td>
                      <td style={{ color: "#82ca9d" }}>
                        {loginLogo ? (
                          <Link
                            href="#"
                            onClick={() => handleViewLogo("loginImage")}
                          >
                            View
                          </Link>
                        ) : (
                          "Not uploaded"
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <table
                  className="table table-borderless table-sm"
                  id={styles.table}
                >
                  <thead className="hidden">
                    <tr>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Address</td>
                      <td>{responseBusiness?.data.businessAddress || "-"}</td>
                    </tr>
                    <tr>
                      <td>Website</td>
                      <td>{responseBusiness?.data.websiteUrl || "-"}</td>
                    </tr>
                    <tr>
                      <td>PAN/SSN</td>
                      <td>{responseBusiness?.data.panSsn || "-"}</td>
                    </tr>
                    <tr>
                      <td>GST/VAT</td>
                      <td>{responseBusiness?.data.gstVat || "-"}</td>
                    </tr>
                    <tr>
                      <td>Payment Page Logo</td>

                      <td style={{ color: "#82ca9d" }}>
                        {pageLogo ? (
                          <Link
                            href="#"
                            onClick={() => handleViewLogo("pageLogo")}
                          >
                            View
                          </Link>
                        ) : (
                          "Not uploaded"
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="row">
        <div className="col-12 mb-4">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Bank Details</h6>
              <i
                className="bi bi-plus-lg"
                title="Add Bank"
                onClick={() => setViewAddBankModal(true)}
                id={styles.editicon}
              ></i>
            </div>
            <div className="row p-2">
              <div className="col-12 overflow-auto">
                {responseBank?.data === null && (
                  <small className="text-center">No Bank Data Available</small>
                )}
                {responseBank?.data && responseBank?.data.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-sm" id={styles.table}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Branch</th>
                          <th>Account Number</th>
                          <th>IFSC Code</th>
                          <th>Card Number</th>
                          <th>IBAN</th>
                          <th>SWIFT Code</th>
                          <th>VPA</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {responseBank?.data !== null &&
                          responseBank?.data.length > 0 &&
                          responseBank?.data.map((bank) => (
                            <tr key={bank.bankDetailId}>
                              <td>{bank.bankName}</td>
                              <td>{bank.branchName}</td>
                              <td>{bank.bankAccountNumber}</td>
                              <td>{bank.ifscCode || "N/A"}</td>
                              <td>{bank.cardNumber}</td>
                              <td>{bank.iban}</td>
                              <td>{bank.swiftCode}</td>
                              <td>{bank.vpa}</td>
                              <td>
                                <i
                                  className="bi bi-pencil-fill"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleViewUpdateBank(bank)}
                                ></i>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Business;
