import useGetRequest from "@/app/hooks/useFetch";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import useDeleteRequest from "@/app/hooks/useDelete";
import DeleteWarning from "@/app/ui/modals/DeleteWarning";
import AddCurrency from "../modals/AddCurrency";

const Currency = ({ name, id }) => {
  const { getData, response = [] } = useGetRequest();
  useEffect(() => {
    getData(endPoints.mapping.currency + "/" + id);
  }, []);

  const [viewDeleteWarning, setViewDeleteWarning] = useState(false);
  const [currencyId, setCurrencyId] = useState({ index: null, id: null });
  const handleViewDeleteWarning = (index, id) => {
    setViewDeleteWarning(true);
    setCurrencyId({ index, id });
  };
  const {
    response: deleteResponse,
    error: deleteError,
    loading: deleteLoading,
    deleteData,
  } = useDeleteRequest();

  const handleConfirmDelete = async () => {
    await deleteData(
      endPoints.mapping.currency + "/" + id + "/" + currencyId.id
    );
  };
  useEffect(() => {
    if (deleteResponse && !deleteError) {
      response?.data.splice(currencyId.index, 1);
      setViewDeleteWarning(false);
      setCurrencyId(null);
    }
  }, [deleteResponse, deleteError]);
  // Add Currency Logic
  const [viewAddCurrencyModal, setViewAddCurrencyModal] = useState(false);

  return (
    <>
      {viewAddCurrencyModal && (
        <AddCurrency
          name={name}
          id={id}
          onSuccess={() => getData(endPoints.mapping.currency + "/" + id)}
          onClose={() => setViewAddCurrencyModal(!viewAddCurrencyModal)}
        />
      )}
      {viewDeleteWarning && (
        <DeleteWarning
          onClose={() => setViewDeleteWarning(!viewDeleteWarning)}
          onConfirm={handleConfirmDelete}
        />
      )}
      <div className="row">
        <div className="col-12 mb-3">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Currency Mapping</h6>
              <i
                className="bi bi-plus-lg"
                id={styles.editicon}
                onClick={() => setViewAddCurrencyModal(true)}
              ></i>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <div className="text-center">
                  {(response?.data === null || response?.data.length === 0) && (
                    <small className="text-center">Add Currency to view</small>
                  )}
                </div>
                {response?.data && response?.data.length > 0 && (
                  <table
                    className="table table-responsive-sm overflow-auto"
                    id={styles.table}
                  >
                    <thead>
                      <tr>
                        <th>Currency Name</th>
                        <th>Currency Code</th>
                        <th>Currency Symbol</th>
                        <th>Decimal Places</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {response?.data.map((currency, index) => (
                        <tr key={currency?.currencyId}>
                          <td>{currency?.currencyName}</td>
                          <td>{currency?.currencyCode}</td>
                          <td>{currency?.symbol ? currency.symbol : "NA"}</td>
                          <td>{currency?.currencyDecimalPlace}</td>
                          <td>
                            <button
                              disabled={deleteLoading}
                              className="table_delete"
                              onClick={() =>
                                handleViewDeleteWarning(
                                  index,
                                  currency?.currencyId
                                )
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

export default Currency;
