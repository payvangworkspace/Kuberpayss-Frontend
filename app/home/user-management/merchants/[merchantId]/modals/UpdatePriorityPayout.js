import usePostRequest from "@/app/hooks/usePost";
import styles from "/app/ui/table/Table.module.css";
import { Fragment, useEffect } from "react";
import { createPortal } from "react-dom";
import DraggableTable from "@/app/ui/table/DraggableTable";
import { errorMsg, successMsg } from "@/app/services/notify";
import { decryptParams } from "@/app/utils/decryptions";
import { useParams } from "next/navigation";
import { endPoints } from "@/app/services/apiEndpoints";
const Backdrop = () => {
  return <div className="backdrop"></div>;
};
const Overlay = ({ acquirerList, onClick }) => {
  const { postData, response, error, loading } = usePostRequest(
    endPoints.payin.updatePriority
  );

  const params = useParams();

  const handleUpdatePriority = async (updatedList) => {
    
    const payload = updatedList.map((item, index) => ({
      acquirerId: item.userId,
      priority: item.priority,
      merchantId: decryptParams(params.merchantId),
    }));
    try {
      await postData(payload);
    } catch (error) {}
    if (response) {
      successMsg("Priority updated successfully");
      onClick();
    }
    if (error) {
      errorMsg(error);
    }
  };

  return (
    <div className={styles.aqr_modal}>
      <div className="d-flex justify-content-between align-items-center mb-4 ">
        <h6>Update Acquirer Priority</h6>
        {/* NOTE  */}

        <span className="d-flex align-items-center gap-2">
          <i className="bi bi-x-circle-fill" onClick={onClick}></i>
        </span>
      </div>
      <span className="d-flex align-items-center gap-2">
        <p className="text-muted d-flex align-items-center gap-2">
          <i className="bi bi-info-circle"></i>
          Drag and drop to change the priority of acquirers
        </p>
      </span>
      <div className="d-flex justify-content-between mb-3">
        <DraggableTable
          onOrderChange={handleUpdatePriority}
          initialData={acquirerList}
        />
      </div>
    </div>
  );
};
const PayoutPriorityModal = ({ acquirerList, onClose }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay acquirerList={acquirerList} onClick={onClose} />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default PayoutPriorityModal;
