import { useEffect, useState } from "react";
import styles from "../page.module.css";
import AddPaymentMode from "../modals/AddPaymentMode";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import DeleteWarning from "@/app/ui/modals/DeleteWarning";
import useDeleteRequest from "@/app/hooks/useDelete";
import AddTransferMode from "../modals/AddTransferMode";
import { successMsg } from "@/app/services/notify";

const Mapping = ({ name, id }) => {
  const [successAction, setSuccessAction] = useState(null);
  const [active, setActive] = useState(1);
  const [viewAddModal, setViewAddModal] = useState(false);
  const [viewAddTransferModal, setViewAddTransferModal] = useState(false);
  const { response: deleteResponse, deleteData } = useDeleteRequest();

  const {
    error,
    response = [],
    getData,
    loading: paymentLoading,
  } = useGetRequest();
  useEffect(() => {
    getData(endPoints.mapping.all + "/" + id);
  }, [deleteResponse, successAction]);

  const {
    error: transferModeError,
    response: transferModes = [],
    getData: getTransferModes,
    loading: transferLoading,
  } = useGetRequest();

  const {
    response: deleteTransferModeResponse,
    deleteData: deleteTransferMode,
  } = useDeleteRequest();

  const [deleteTransferModeWarning, setDeleteTransferModeWarning] =
    useState(false);

  const [deleteTransferModeId, setDeleteTransferModeId] = useState(null);

  const handleViewTransferModeWarning = (modeId) => {
    setDeleteTransferModeWarning(true);
    setDeleteTransferModeId(modeId);
  };

  const handleDeleteTransferMode = async () => {
    await deleteTransferMode(
      endPoints.mapping.allTranferModes + "/" + deleteTransferModeId
    );
    setSuccessAction(!successAction);
    setDeleteTransferModeWarning(false);
    setDeleteTransferModeId(null);
    successMsg(
      deleteTransferModeResponse?.message ||
        "Transfer Mode Deleted successfully"
    );
  };

  useEffect(() => {
    getTransferModes(endPoints.mapping.allTranferModes + "/" + id);
  }, [deleteTransferModeResponse, successAction]);

  useEffect(() => {
    if (response)
      setMopType(
        response?.data?.[0] ? response?.data?.[0]?.mopTypeDetails : []
      );
  }, [response]);

  const [mopType, setMopType] = useState([]);
  const handleActivePaymentType = (nextMopType, nextActive) => {
    setMopType(nextMopType);
    setActive(nextActive);
  };

  const [viewDeleteWarning, setViewDeleteWarning] = useState(false);
  const [paymentAndMopTypeId, setPaymentAndMopTypeId] = useState(null);
  const handleViewDeleteWarning = (mopId) => {
    setViewDeleteWarning(true);
    setPaymentAndMopTypeId(mopId);
  };
  const handleConfirmDelete = async () => {
    await deleteData(endPoints.mapping.all + "/" + paymentAndMopTypeId);
    setViewDeleteWarning(false);
    setPaymentAndMopTypeId(null);
  };

  if (error) return <p className="text-center">Error: {error?.message}</p>;
  if (transferModeError)
    return (
      <p className="text-center">Error: {transferModeError?.message}</p>
    );

  return (
    <>
      {viewAddModal && (
        <AddPaymentMode
          name={name}
          id={id}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewAddModal(!viewAddModal)}
        />
      )}
      {viewAddTransferModal && (
        <AddTransferMode
          name={name}
          id={id}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewAddTransferModal(!viewAddTransferModal)}
        />
      )}
      {viewDeleteWarning && (
        <DeleteWarning
          onClose={() => setViewDeleteWarning(!viewDeleteWarning)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {deleteTransferModeWarning && (
        <DeleteWarning
          onClose={() => setDeleteTransferModeWarning(null)}
          onConfirm={handleDeleteTransferMode}
        />
      )}

      <div className={styles.secondaryCard}>
        <div className={styles.cardHeader}>
          <h6>Payment Type</h6>
          <i
            className={`bi bi-plus-lg ${styles.editIcon}`}
            onClick={() => setViewAddModal(true)}
          />
        </div>
        <div className="row">
          {paymentLoading && !response?.data ? (
            <div className="col-12">
              {[70, 55, 80].map((width, index) => (
                <span
                  key={index}
                  className={`${styles.shimmer} ${styles.skelLine}`}
                  style={{ width: `${width}%`, display: "block" }}
                />
              ))}
            </div>
          ) : response?.data?.length > 0 ? (
            <>
              <div className="col-md-2 col-sm-12 d-flex flex-column gap-2">
                {response?.data?.map((paymentType, index) => (
                  <button
                    type="button"
                    className={
                      active === index + 1
                        ? `${styles.paymentcard} ${styles.active}`
                        : styles.paymentcard
                    }
                    onClick={() =>
                      handleActivePaymentType(
                        paymentType?.mopTypeDetails,
                        index + 1
                      )
                    }
                    key={paymentType?.paymentTypeId}
                  >
                    {paymentType?.paymentTypeName}
                  </button>
                ))}
              </div>
              <div className="col-md-10 col-sm-12">
                <div className="accordion" id="accordionPaymentType">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        Mode Of Payment
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                    >
                      <div className="accordion-body">
                        <table className="table" id={styles.table}>
                          <thead>
                            <tr>
                              <th>NAME</th>
                              <th>CODE</th>
                              <th>ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mopType?.length > 0 ? (
                              mopType.map((type) => (
                                <tr key={type?.acquirerToPaymentMopId}>
                                  <td>{type?.mopTypeName}</td>
                                  <td>{type?.mopTypeCode}</td>
                                  <td>
                                    <i
                                      className={`bi bi-trash-fill ${styles.deleteIcon}`}
                                      onClick={() =>
                                        handleViewDeleteWarning(
                                          type?.acquirerToPaymentMopId
                                        )
                                      }
                                    />
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className={styles.emptyState}>
                                  No payment type mapped
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <small className={styles.emptyState}>Add Payment Types to view</small>
          )}
        </div>
      </div>

      <div className={styles.secondaryCard}>
        <div className={styles.cardHeader}>
          <h6>Transfer Modes</h6>
          <i
            className={`bi bi-plus-lg ${styles.editIcon}`}
            onClick={() => setViewAddTransferModal(true)}
          />
        </div>
        <div className="row">
          {transferLoading && !transferModes?.data ? (
            <div className="col-12">
              {[65, 50, 75].map((width, index) => (
                <span
                  key={index}
                  className={`${styles.shimmer} ${styles.skelLine}`}
                  style={{ width: `${width}%`, display: "block" }}
                />
              ))}
            </div>
          ) : transferModes?.data?.length > 0 ? (
            <div className="col-md-12 col-sm-12">
              <table className="table" id={styles.table}>
                <thead>
                  <tr>
                    <th>TRANSFER MODE</th>
                    <th>TRANSFER CODE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {transferModes?.data?.map((mode) => (
                    <tr key={mode?.acquirerTransferModeId}>
                      <td>{mode?.transferMode?.transferModeName}</td>
                      <td>{mode?.transferMode?.transferModeCode}</td>
                      <td>
                        <i
                          className={`bi bi-trash-fill ${styles.deleteIcon}`}
                          onClick={() =>
                            handleViewTransferModeWarning(
                              mode?.acquirerTransferModeId
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <small className={styles.emptyState}>
              Add Transfer Modes to view
            </small>
          )}
        </div>
      </div>
    </>
  );
};

export default Mapping;
