import { useEffect, useState } from "react";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import useDeleteRequest from "@/app/hooks/useDelete";
import Table from "@/app/ui/table/Table";
import Headings from "./Headings";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";
import { blockCardRange } from "./Columns";
import AddCardRange from "../modals/AddCardRange";
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
  if (loading) {
    return (
      <tbody>
        {Array.from({ length: 6 }).map((_, index) => (
          <tr key={`skeleton-${index}`} className={styles.skeletonRow}>
            <td>
              <span
                className={styles.shimmer}
                style={{ width: 120, height: 12 }}
              />
            </td>
            <td>
              <span
                className={styles.shimmer}
                style={{ width: 120, height: 12 }}
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
                <td>{item.value2}</td>
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
              <td colSpan={3}>
                <div className={tableStyles.emptyMessage}>
                  No Card range set
              
                </div>
              </td>
            </tr>
          )}
    </tbody>
  );
};
export default function BlockedCardRange({ type, userId, name }) {
  const [successAction, setSuccessAction] = useState(null);
  const { postData, loading, error, response } = usePostRequest(
    endPoints.fraudPrevention.userAndType
  );

  async function getAllCardRange() {
    await postData({
      type: type,
      userId: userId,
    });
  }

  useEffect(() => {
    getAllCardRange();
  }, [successAction, userId]);

  const [viewAddModal, setViewAddModal] = useState(false);
  if (error) return <p>Failed to fetch data</p>;
  return (
    <>
      {viewAddModal && (
        <AddCardRange
          type={type}
          id={userId}
          merchant={name}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewAddModal(!viewAddModal)}
        />
      )}
      <Headings
        title="Blocked Card Range"
        action={() => setViewAddModal(true)}
      />
      <Table
        headers={blockCardRange}
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
