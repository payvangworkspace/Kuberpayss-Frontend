import { useEffect, useState } from "react";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import useDeleteRequest from "@/app/hooks/useDelete";
import Headings from "./Headings";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";
import Table from "@/app/ui/table/Table";
import AddMOPType from "../modals/AddMOPType";
import { blockMOP } from "./Columns";
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
                  No MOP type set
              
                </div>
              </td>
            </tr>
          )}
    </tbody>
  );
};

export default function BlockedMOP({ type, userId, name }) {
  const [successAction, setSuccessAction] = useState(null);
  const { loading, postData, error, response } = usePostRequest(
    endPoints.fraudPrevention.userAndType
  );

  async function getAllMop() {
    await postData({
      type: type,
      userId: userId,
    });
  }

  useEffect(() => {
    getAllMop();
  }, [successAction, userId]);

  const [viewAddModal, setViewAddModal] = useState(false);
  if (error) return <p>Failed to fetch data</p>;
  return (
    <>
      {viewAddModal && (
        <AddMOPType
          type={type}
          id={userId}
          merchant={name}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewAddModal(!viewAddModal)}
        />
      )}
      <Headings title="Blocked MOP Type" action={() => setViewAddModal(true)} />

      <Table
        headers={blockMOP}
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
