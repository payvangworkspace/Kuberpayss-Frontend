import useGetRequest from "@/app/hooks/useFetch";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import AddRefundLimit from "../modals/AddRefundLimit";

const RefundLimit = ({ name, id }) => {
  const { getData, response = [] } = useGetRequest();
  useEffect(() => {
    getData(endPoints.mapping.refundLimit + id + "/" + "refund-limit");
  }, []);
  // Add Currency Logic
  const [viewAddRefundModal, setViewAddRefundModal] = useState(false);

  return (
    <>
      {viewAddRefundModal && (
        <AddRefundLimit
          name={name}
          id={id}
          onSuccess={() =>
            getData(endPoints.mapping.refundLimit + id + "/" + "refund-limit")
          }
          onClose={() => setViewAddRefundModal(!viewAddRefundModal)}
        />
      )}
      <div className="row">
        <div className="col-12 mb-2">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Refund Limit</h6>
              <i
                className="bi bi-plus-lg"
                id={styles.editicon}
                onClick={() => setViewAddRefundModal(true)}
              ></i>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <div className="text-center">
                  {(response?.data === null || response?.data.length === 0) && (
                    <small className="text-center">Add Refund to view</small>
                  )}
                </div>
                {response?.data && (
                  <table
                    className="table table-responsive-sm overflow-auto"
                    id={styles.table}
                  >
                    <thead>
                      <tr>
                        <th>Currency Name</th>
                        <th>Refund Limit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key={response?.data?.merchantId}>
                        <td>{response?.data?.currency}</td>
                        <td>{response?.data?.extraRefundLimit}</td>
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

export default RefundLimit;
