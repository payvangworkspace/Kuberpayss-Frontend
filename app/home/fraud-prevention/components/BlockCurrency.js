import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import usePostRequest from "@/app/hooks/usePost";
import useDeleteRequest from "@/app/hooks/useDelete";
import Headings from "./Headings";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";
import Table from "@/app/ui/table/Table";
import AddCurrency from "../modals/AddCurrency";
import { blockCurrency } from "./Columns";

const BodyMapping = ({ data = [], loading, successAction }) => {
  const { response, error, deleteData } = useDeleteRequest();

  async function handleDelete(id) {
    await deleteData(endPoints.fraudPrevention.addNew + "/" + id);
  }
  useEffect(() => {
    if (response && !error) {
      successAction();
    }
  }, [response, error]);

  console.log("data", data);
  

  if (loading) {
    return (
      <tbody>
        {Array.from({ length: 6 }).map((_, index) => (
          <tr key={`skeleton-${index}`} className={styles.skeletonRow}>
            <td>
              <span
                className={styles.shimmer}
                style={{ width: 160, height: 12 }}
              />
            </td>
            <td>
              <span
                className={styles.shimmer}
                style={{ width: 48, height: 12 }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <tbody>
      {data && data.length > 0 ? (
        data.map((item) => (
              <tr key={item.userId}>
                <td>{item.value} </td>
                <td>
                  <i
                    className={`bi bi-trash-fill ${styles.deleteIcon}`}
                    onClick={() => handleDelete(item.fraudPreventionId)}
                  ></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>
                <div className={tableStyles.emptyMessage}>
                  No Currency added
              
                </div>
              </td>
            </tr>
          )}
    </tbody>
  );
};

export default function BlockedCurrency({ type, userId, name }) {
  const [successAction, setSuccessAction] = useState(null);
  const { loading, postData, error, response } = usePostRequest(
    endPoints.fraudPrevention.userAndType
  );

  async function getAllIssuer() {
    await postData({
      type,
      userId,
    });
  }
  useEffect(() => {
    getAllIssuer();
  }, [successAction, userId]);

  const [viewAddModal, setViewAddModal] = useState(false);
  if (error) return <p>Failed to fetch data</p>;
  return (
    <>
      {viewAddModal && (
        <AddCurrency
          type={type}
          id={userId}
          merchant={name}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewAddModal(!viewAddModal)}
        />
      )}
      <Headings title="Blocked Currency" action={() => setViewAddModal(true)} />
      <Table
        headers={blockCurrency}
        download={false}
        search={false}
        pagination={false}
      >
        <BodyMapping
          data={response?.data.data || null}
          loading={loading || response == null}
          successAction={() => setSuccessAction(!successAction)}
        />
      </Table>
    </>
  );
}
