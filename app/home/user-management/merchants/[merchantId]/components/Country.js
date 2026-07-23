import useGetRequest from "@/app/hooks/useFetch";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import useDeleteRequest from "@/app/hooks/useDelete";
import DeleteWarning from "@/app/ui/modals/DeleteWarning";
import AddCountry from "../modals/AddCountry";

const Country = ({ name, id }) => {
  const { getData, response = [] } = useGetRequest();
  useEffect(() => {
    getData(endPoints.mapping.country + "/" + id);
  }, []);
  const [viewDeleteWarning, setViewDeleteWarning] = useState(false);
  const [countryId, setCountryId] = useState({ index: null, id: null });
  const handleViewDeleteWarning = (index, id) => {
    setViewDeleteWarning(true);
    setCountryId({ index, id });
  };
  const {
    response: deleteResponse,
    error: deleteError,
    loading: deleteLoading,
    deleteData,
  } = useDeleteRequest();

  const handleConfirmDelete = async () => {
    await deleteData(endPoints.mapping.country + "/" + id + "/" + countryId.id);
  };
  useEffect(() => {
    if (deleteResponse && !deleteError) {
      response?.data.splice(countryId.index, 1);
      setViewDeleteWarning(false);
      setCountryId(null);
    }
  }, [deleteResponse, deleteError]);
  // Add Country Logic
  const [viewAddCountryModal, setViewAddCountryModal] = useState(false);

  return (
    <>
      {viewAddCountryModal && (
        <AddCountry
          name={name}
          id={id}
          onSuccess={() => getData(endPoints.mapping.country + "/" + id)}
          onClose={() => setViewAddCountryModal(!viewAddCountryModal)}
        />
      )}
      {viewDeleteWarning && (
        <DeleteWarning
          onClose={() => setViewDeleteWarning(!viewDeleteWarning)}
          onConfirm={handleConfirmDelete}
        />
      )}
      <div className="row">
        <div className="col-12 mb-2">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Country Mapping</h6>
              <i
                className="bi bi-plus-lg"
                id={styles.editicon}
                onClick={() => setViewAddCountryModal(true)}
              ></i>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <div className="text-center">
                  {(response?.data === null || response?.data.length === 0) && (
                    <small className="text-center">Add Country to view</small>
                  )}
                </div>
                {response?.data && response?.data.length > 0 && (
                  <table
                    className="table table-responsive-sm overflow-auto"
                    id={styles.table}
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Capital</th>
                        <th>Numeric Code</th>
                        <th>Phone Code</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {response?.data.map((country, index) => (
                        <tr key={country?.countryId}>
                          <td>{country?.countryName}</td>
                          <td>{country?.countryCode}</td>
                          <td>{country?.countryCapital}</td>
                          <td>
                            {country?.countryNumericCode
                              ? country.countryNumericCode
                              : "NA"}
                          </td>
                          <td>{country?.countryPhoneCode}</td>
                          <td>
                            <button
                              disabled={deleteLoading}
                              className="table_delete"
                              onClick={() =>
                                handleViewDeleteWarning(
                                  index,
                                  country.countryId
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

export default Country;
