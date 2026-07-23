import { useEffect, useState } from "react";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import useDeleteRequest from "@/app/hooks/useDelete";
import Headings from "./Headings";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";
import Table from "@/app/ui/table/Table";
import { blockVPAAddr } from "./Columns";
import AddVPAAddr from "../modals/AddVPAAddr";

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
                  No VPA Address set
              
                </div>
              </td>
            </tr>
          )}
    </tbody>
  );
};

export default function BlockedVPA({ type, userId, name }) {
  const [successAction, setSuccessAction] = useState(null);
  const { loading, postData, error, response } = usePostRequest(
    endPoints.fraudPrevention.userAndType
  );

  async function getAllVpa() {
    await postData({
      type: type,
      userId: userId,
    });
  }

  useEffect(() => {
    getAllVpa();
  }, [successAction, userId]);

  const [viewAddModal, setViewAddModal] = useState(false);
  if (error) return <p>Failed to fetch data</p>;
  return (
    <>
      {viewAddModal && (
        <AddVPAAddr
          type={type}
          id={userId}
          merchant={name}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewAddModal(!viewAddModal)}
        />
      )}
      <Headings
        title="Blocked Virtual Payment Address"
        action={() => setViewAddModal(true)}
      />

      <Table
        headers={blockVPAAddr}
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
