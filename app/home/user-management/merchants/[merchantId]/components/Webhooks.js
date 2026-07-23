import styles from "../page.module.css";
import useGetRequest from "@/app/hooks/useFetch";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import useDeleteRequest from "@/app/hooks/useDelete";
import DeleteWarning from "@/app/ui/modals/DeleteWarning";
import AddWebhook from "../modals/AddWebhook";

const Webhooks = ({ name, id, isAdmin }) => {
  const {
    getData: getPayinWebhook,
    response: responsePayinWebhook,
    error: errorPayinWebhook,
  } = useGetRequest();

  if (errorPayinWebhook) {
    return <p className="text-center">Error loading webhook data</p>;
  }

  //   Adding Webhook Url logics
  const [successfullAdd, setSuccessfullAdd] = useState(false);
  const [viewAddWebhookModal, setViewAddWebhookModal] = useState(false);
  const [addWebhookData, setAddWebhookData] = useState({
    type: "",
    url: "",
    userId: "",
    action: "",
    defaultValue: null,
  });
  const handleAddWebhook = (userId, type, url, action, defaultValue = null) => {
    setAddWebhookData({ userId, type, url, action, defaultValue });
    setViewAddWebhookModal(true);
  };

  //   Deleting webhook url
  const [viewDeleteWarning, setViewDeleteWarning] = useState(false);
  const [deletionTypeUrl, setDeletionTypeUrl] = useState();
  const handleViewDeleteWarning = (url) => {
    setDeletionTypeUrl(url);
    setViewDeleteWarning(true);
  };
  const {
    response: deleteResponse,
    deleteData,
    error: deleteError,
  } = useDeleteRequest();

  const handleConfirmDelete = async () => {
    await deleteData(deletionTypeUrl);
    setViewDeleteWarning(false);
  };

  //

  useEffect(() => {
    getPayinWebhook(endPoints.mapping.payinWebhook + "/" + id);
  }, [successfullAdd, deleteResponse, deleteError]);
  return (
    <>
      {viewAddWebhookModal && (
        <AddWebhook
          name={name}
          id={id}
          data={addWebhookData}
          onSuccess={() => setSuccessfullAdd(!successfullAdd)}
          onClose={() => setViewAddWebhookModal(!viewAddWebhookModal)}
        />
      )}
      {viewDeleteWarning && (
        <DeleteWarning
          onClose={() => setViewDeleteWarning(!viewDeleteWarning)}
          onConfirm={handleConfirmDelete}
        />
      )}
      <div className="row">
        <div className="col-md-12 col-sm-12 mb-2">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Payin Webhook</h6>
              {!responsePayinWebhook?.data?.payinWebhookUrl && isAdmin && (
                <i
                  className="bi bi-plus-lg"
                  id={styles.editicon}
                  onClick={() =>
                    handleAddWebhook(
                      id,
                      "payin",
                      endPoints.mapping.payinWebhook,
                      "Add"
                    )
                  }
                ></i>
              )}
              {responsePayinWebhook?.data.payinWebhookUrl && isAdmin && (
                <i
                  className="bi bi-pencil-fill"
                  id={styles.editicon}
                  onClick={() =>
                    handleAddWebhook(
                      id,
                      "payin",
                      endPoints.mapping.payinWebhook,
                      "Edit",
                      responsePayinWebhook?.data.payinWebhookUrl
                    )
                  }
                ></i>
              )}
            </div>
            {responsePayinWebhook?.data.payinWebhookUrl && (
              <div className="row p-2">
                <table
                  className="table table-borderless table-sm"
                  id={styles.infotable}
                >
                  <thead className="hidden">
                    <tr>
                      <th></th>
                      <th></th>
                      <th style={{ width: 50 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ width: 120 }}>URL</td>
                      <td>
                        {responsePayinWebhook?.data.payinWebhookUrl || "NA"}
                      </td>
                      <td>
                        {isAdmin && (
                          <i
                            className="bi bi-trash-fill text-danger"
                            onClick={() =>
                              handleViewDeleteWarning(
                                `${endPoints.mapping.payinWebhook}/${id}`
                              )
                            }
                          ></i>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Webhooks;
