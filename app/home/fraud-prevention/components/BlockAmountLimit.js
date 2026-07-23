import { useEffect, useState } from "react";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import useDeleteRequest from "@/app/hooks/useDelete";
import Table from "@/app/ui/table/Table";
import { blockAmtLimit } from "./Columns";
import AddAmountLimit from "../modals/AddAmountLimit";
import Headings from "./Headings";
import styles from "../page.module.css";
import tableStyles from "@/app/ui/table/Table.module.css";
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
                  No Amount Limit Set
              
                </div>
              </td>
            </tr>
          )}
    </tbody>
  );
};

export default function BlockedAmtLimit({ type, userId, name }) {
  const [successAction, setSuccessAction] = useState(null);
  const { postData, loading, error, response } = usePostRequest(
    endPoints.fraudPrevention.userAndType
  );
  // const [currentPage, setCurrentPage] = useState(0);
  // handling search keyword
  // const [keyword, setKeyword] = useState("");
  // const handleKeyword = (e) => setKeyword(e.target.value);

  // const handlePrev = () => {
  //   setCurrentPage((prev) => prev - 1);
  // };
  // const handleNext = () => {
  //   setCurrentPage((prev) => prev + 1);
  // };
  async function getAllAmountLimit() {
    await postData({
      type: type,
      userId: userId,
    });
  }
  useEffect(() => {
    getAllAmountLimit();
  }, [successAction, userId]);

  const [viewAddModal, setViewAddModal] = useState(false);
  if (error) return <p>Failed to fetch data</p>;
  return (
    <>
      {viewAddModal && (
        <AddAmountLimit
          type={type}
          merchant={name}
          id={userId}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewAddModal(!viewAddModal)}
        />
      )}
      <Headings
        title="Blocked Amount Limit"
        action={() => setViewAddModal(true)}
      />
      <Table
        headers={blockAmtLimit}
        // currentPage={response?.data.pageNumber || 0}
        // totalPages={response.totalPage}
        // pageSize={response?.data.pageSize || 0}
        // totalElement={response?.data.totalElement || null}
        // handleNext={handleNext}
        // handlePrev={handlePrev}
        download={false}
        // onChange={handleKeyword}
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
