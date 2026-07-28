import { useEffect, useState } from "react";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import AddReturnURL from "../modals/AddReturnURL";
import { blockReturnURL } from "./Columns";
import Headings from "./Headings";
import Table from "@/app/ui/table/Table";
import { loadingMsg } from "@/app/utils/message";
import useDeleteRequest from "@/app/hooks/useDelete";
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
            {loadingMsg("return url")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.userId}>
                <td>{item.value} </td>
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
              <td colSpan={2} className="text-center">
                No return url set
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};
export default function BlockedURL({ type, userId, name }) {
  const [successAction, setSuccessAction] = useState(null);
  const { loading, postData, error, response } = usePostRequest(
    endPoints.fraudPrevention.userAndType
  );

  async function getAllReturnUrl() {
    await postData({
      type: type,
      userId: userId,
    });
  }

  useEffect(() => {
    getAllReturnUrl();
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
        <AddReturnURL
          type={type}
          id={userId}
          merchant={name}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewAddModal(!viewAddModal)}
        />
      )}
      <Headings
        title="Blocked Return URL"
        action={() => setViewAddModal(true)}
      />

      <Table
        headers={blockReturnURL}
        download={false}
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
