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

  // Get all acquirer mapped payment type and mop type
  const { error, response = [], getData } = useGetRequest();
  useEffect(() => {
    getData(endPoints.mapping.all + "/" + id);
  }, [deleteResponse, successAction]);

  // get all mapped transfer types
  const {
    error: transferModeError,
    response: transferModes = [],
    getData: getTransferModes,
  } = useGetRequest();

  console.log("transferModes", transferModes);

  // to delete
  const {
    error: deleteError,
    response: deleteTransferModeResponse,
    deleteData: deleteTransferMode,
  } = useDeleteRequest();

  const [deleteTransferModeWarning, setDeleteTransferModeWarning] =
    useState(false);

  const [deleteTransferModeId, setDeleteTransferModeId] = useState(null);

  const handleViewTransferModeWarning = (id) => {
    setDeleteTransferModeWarning(true);
    setDeleteTransferModeId(id);
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
  const handleActivePaymentType = (mopType, active) => {
    setMopType(mopType);
    setActive(active);
  };
  // Logics for deleting data
  const [viewDeleteWarning, setViewDeleteWarning] = useState(false);
  const [paymentAndMopTypeId, setPaymentAndMopTypeId] = useState(null);
  const handleViewDeleteWarning = (id) => {
    setViewDeleteWarning(true);
    setPaymentAndMopTypeId(id);
  };
  const handleConfirmDelete = async () => {
    await deleteData(endPoints.mapping.all + "/" + paymentAndMopTypeId);
    setViewDeleteWarning(false);
    setPaymentAndMopTypeId(null);
  };
  if (error) return <p className="text-center">Error: {error?.message}</p>;
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

      {/* payin  */}
      <div className="row">
        <div className="col-12 mb-4">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6>Payment Type</h6>
              <i
                className="bi bi-plus-lg"
                id={styles.editicon}
                onClick={() => setViewAddModal(true)}
              ></i>
            </div>
            <div className="row">
              {response?.data?.length > 0 ? (
                <>
                  <div className="col-md-2 col-sm-12 d-flex flex-column gap-2">
                    {response?.data?.map((paymentType, index) => (
                      <button
                        className={
                          active === index + 1
                            ? styles.paymentcard + " " + styles.active
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
                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id={`headingOne`}>
                          <button
                            className={`accordion-button`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapseOne`}
                            aria-expanded="true"
                            aria-controls={`collapseOne`}
                          >
                            Mode Of Payment
                          </button>
                        </h2>
                        <div
                          id={`collapseOne`}
                          className={`accordion-collapse collapse show`}
                          aria-labelledby="headingOne"
                          data-bs-parent={`collapseOne`}
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
                                    <tr>
                                      <td>{type?.mopTypeName}</td>
                                      <td>{type?.mopTypeCode}</td>
                                      <td>
                                        <i
                                          className="bi bi-trash-fill text-danger"
                                          onClick={() =>
                                            handleViewDeleteWarning(
                                              type?.acquirerToPaymentMopId
                                            )
                                          }
                                        ></i>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4}>No payment type mapped</td>
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
                <small className="text-center d-flex gap-1 justify-content-center">
                  Add Payment Types to view
                </small>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* payout  */}
      <div className="row">
        <div className="col-12 mb-4">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6>Transfer Modes</h6>
              <i
                className="bi bi-plus-lg"
                id={styles.editicon}
                onClick={() => setViewAddTransferModal(true)}
              ></i>
            </div>
            <div className="row">
              {transferModes?.data?.length > 0 ? (
                <div className="col-md-12 col-sm-12">
                  <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                      <div className={`accordion-collapse collapse show`}>
                        <div className="accordion-body">
                          <table className="table" id={styles.table}>
                            <thead>
                              <tr>
                                <th>TRANSFER MODE</th>
                                <th>TRANSFER CODE</th>
                                <th>ACTIONS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {transferModes?.data?.length > 0 ? (
                                transferModes?.data?.map((mode, index) => (
                                  <tr key={index}>
                                    <td>
                                      {mode?.transferMode?.transferModeName}
                                    </td>
                                    <td>
                                      {mode?.transferMode?.transferModeCode}
                                    </td>
                                    <td className="d-flex gap-2">
                                      <i
                                        className="bi bi-trash-fill text-danger"
                                        onClick={() =>
                                          handleViewTransferModeWarning(
                                            mode?.acquirerTransferModeId
                                          )
                                        }
                                      ></i>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={4}>No transfer mode mapped</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <small className="text-center d-flex gap-1 justify-content-center">
                  Add Transfer Modes to view
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mapping;
