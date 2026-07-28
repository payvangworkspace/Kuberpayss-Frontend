import { useEffect, useState } from "react";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import useDeleteRequest from "@/app/hooks/useDelete";
import { loadingMsg } from "@/app/utils/message";
import Table from "@/app/ui/table/Table";
import { blockAmtLimit } from "./Columns";
import AddAmountLimit from "../modals/AddAmountLimit";
import Headings from "./Headings";
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
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={3} className="text-center">
            {loadingMsg("amount limit")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.userId}>
                <td>{item.value} </td>
                <td>{item.value2}</td>
                <td>
                  <i
                    className="bi bi-trash-fill text-danger"
                    onClick={() => handleDelete(item.fraudPreventionId)}
                  ></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                No Amount Limit Set
              </td>
            </tr>
          )}
        </>
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
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (loading) setLoader(true);
  }, [loading]);
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
          loading={loader}
          successAction={() => setSuccessAction(!successAction)}
        />
      </Table>
    </>
  );
}
