import AddSettlementCycle from "../modals/AddSettlementCycle";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import { errorMsg, successMsg } from "@/app/services/notify";
import usePostRequest from "@/app/hooks/usePost";
import { decryptParams } from "@/app/utils/decryptions";
import { useParams } from "next/navigation";
import { validateContact, validateEmail } from "@/app/validations/InputType";

const Notification = ({ name, id, isMerchant }) => {
  const [successAction, setSuccessAction] = useState(false);
  const { getData, response = [] } = useGetRequest();
  const param = useParams();
  useEffect(() => {
    getData(endPoints.mapping.settlementCycle + "/" + id);
  }, [successAction]);

  // Add Settlement Cycle Logic

  const [viewAddSettlementCycleModal, setViewAddSettlementCycleModal] =
    useState(false);

  const {
    postData,
    loading,
    error,
    response: notificationResponse,
  } = usePostRequest(endPoints.payin.addNotification);

  const [orders, setOrders] = useState([
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "SUCCESS", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "FAILED", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "PENDING", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
  ]);

  const [transaction, setTransaction] = useState([
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "SUCCESS", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "FAILED", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "PENDING", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
  ]);

  const [settlement, setSettlement] = useState([
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "SUCCESS", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "FAILED", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "PENDING", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
  ]);

  const [refund, setRefund] = useState([
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "SUCCESS", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "FAILED", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "PENDING", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
  ]);

  const [remittance, setRemittance] = useState([
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "SUCCESS", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "FAILED", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
    {
      userId: id,
      status: false,
      notificationTypes: "ORDER", //  ORDER, TRANSACTION, SETTLEMENT, REFUND, REMITTANCE
      notificationStatusTypes: "PENDING", // SUCCESS, FAILED, PENDING
      emailId: "",
      phoneNumber: "",
    },
  ]);

  const {
    getData: getNotificationPrefs,
    response: notificationPrefs,
    error: errorNotificationPrefs,
    loading: loadingNotificationPrefs,
  } = useGetRequest();

  useEffect(() => {
    if (notificationPrefs?.data) {
      const ordersData = orders.map((item) => {
        const foundItem = notificationPrefs.data.find(
          (order) =>
            order.notificationStatusTypes === item.notificationStatusTypes &&
            order.notificationTypes === "ORDER"
        );
        return {
          ...item,
          status: foundItem ? foundItem.status : false,
          emailId: foundItem ? foundItem.emailId : "",
          phoneNumber: foundItem ? foundItem.phoneNumber : "",
        };
      });

      const transactionData = transaction.map((item) => {
        const foundItem = notificationPrefs.data.find(
          (order) =>
            order.notificationStatusTypes === item.notificationStatusTypes &&
            order.notificationTypes === "TRANSACTION"
        );
        return {
          ...item,
          status: foundItem ? foundItem.status : false,
          emailId: foundItem ? foundItem.emailId : "",
          phoneNumber: foundItem ? foundItem.phoneNumber : "",
        };
      });

      const settlementData = settlement.map((item) => {
        const foundItem = notificationPrefs.data.find(
          (order) =>
            order.notificationStatusTypes === item.notificationStatusTypes &&
            order.notificationTypes === "SETTLEMENT"
        );
        return {
          ...item,
          status: foundItem ? foundItem.status : false,
          emailId: foundItem ? foundItem.emailId : "",
          phoneNumber: foundItem ? foundItem.phoneNumber : "",
        };
      });
      const refundData = refund.map((item) => {
        const foundItem = notificationPrefs.data.find(
          (order) =>
            order.notificationStatusTypes === item.notificationStatusTypes &&
            order.notificationTypes === "REFUND"
        );
        return {
          ...item,
          status: foundItem ? foundItem.status : false,
          emailId: foundItem ? foundItem.emailId : "",
          phoneNumber: foundItem ? foundItem.phoneNumber : "",
        };
      });
      const remittanceData = remittance.map((item) => {
        const foundItem = notificationPrefs.data.find(
          (order) =>
            order.notificationStatusTypes === item.notificationStatusTypes &&
            order.notificationTypes === "REMITTANCE"
        );
        return {
          ...item,
          status: foundItem ? foundItem.status : false,
          emailId: foundItem ? foundItem.emailId : "",
          phoneNumber: foundItem ? foundItem.phoneNumber : "",
        };
      });
      // set the state with the fetched data
      setOrders(ordersData);
      setTransaction(transactionData);
      setSettlement(settlementData);
      setRefund(refundData);
      setRemittance(remittanceData);
    }
    if (errorNotificationPrefs) {
      errorMsg("Error fetching notification preferences");
    }
  }, [notificationPrefs, errorNotificationPrefs]);

  useEffect(() => {
    getNotificationPrefs(endPoints.payin.getNotification + id);
  }, []);

  const handleChangeOrders = (e, type, setMethod) => {
    const { name, value } = e.target;

    setMethod((prevOrders) =>
      prevOrders.map((order) =>
        order.notificationStatusTypes === type
          ? { ...order, [name]: value, status: false }
          : order
      )
    );
  };

  const handleCheckbox = (e, type, setMethod, arr, notType) => {
    const { checked } = e.target;

    if (checked === false) {
      setMethod((prevOrders) =>
        prevOrders.map((order) =>
          order.notificationStatusTypes === type
            ? { ...order, status: false }
            : order
        )
      );
      const formData = arr.filter(
        (order) => order.notificationStatusTypes === type
      )[0];
      if (formData.status === true) {
        const updatedOrders = {
          ...formData,
          status: false,
          userId: id,
          notificationTypes: notType,
        };
        postData(updatedOrders, false, false);
      }
      return;
    }

    // Check if emailId and phoneNumber are empty

    if (
      arr.find((order) => order.notificationStatusTypes === type).emailId ===
        "" ||
      arr.find((order) => order.notificationStatusTypes === type)
        .phoneNumber === ""
    ) {
      errorMsg(
        "Please fill the email and phone number before checking the box"
      );
      return;
    }

    const emailvalidations = validateEmail(
      arr.find((order) => order.notificationStatusTypes === type).emailId
    );

    const mobilevalidations = validateContact(
      arr.find((order) => order.notificationStatusTypes === type).phoneNumber
    );
    if (emailvalidations) {
      errorMsg(emailvalidations);
      return;
    }
    if (mobilevalidations) {
      errorMsg(mobilevalidations);
      return;
    }

    setMethod((prevOrders) =>
      prevOrders.map((order) =>
        order.notificationStatusTypes === type
          ? { ...order, status: checked }
          : order
      )
    );

    const formData = arr.filter(
      (order) => order.notificationStatusTypes === type
    )[0];
    const updatedOrders = {
      ...formData,
      status: checked,
      userId: id,
      notificationTypes: notType,
    };

    postData(updatedOrders, false, false);
  };

  useEffect(() => {
    if (notificationResponse && !error) {
      successMsg(notificationResponse?.data?.message || "Updated Successfully");
    }
  }, [notificationResponse, error]);
  return (
    <>
      <div className="row">
        <div className="col-12 mb-3">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Orders</h6>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <table
                  className="table table-responsive-sm overflow-auto"
                  id={styles.table}
                >
                  <tbody>
                    {orders?.map((item) => (
                      <tr>
                        <td>
                          {/* INPUT TYPE CHECKBOX  */}
                          <input
                            onChange={(e) =>
                              handleCheckbox(
                                e,
                                item.notificationStatusTypes,
                                setOrders,
                                orders,
                                "ORDER"
                              )
                            }
                            type="checkbox"
                            checked={item.status}
                            className="form-check-input"
                            id="checkbox"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </td>
                        <td>{item.notificationStatusTypes || "N/A"}</td>
                        <td>
                          {/* input  */}
                          <input
                            type="text"
                            className="form-control"
                            id="email"
                            aria-describedby="emailHelp"
                            placeholder="Enter Email"
                            style={{ fontSize: "13px" }}
                            name="emailId"
                            value={item.emailId}
                            onChange={(e) =>
                              handleChangeOrders(
                                e,
                                item.notificationStatusTypes,
                                setOrders
                              )
                            }
                          />
                        </td>
                        <td>
                          {/* input  */}
                          <input
                            type="text"
                            className="form-control"
                            id="phone"
                            aria-describedby="emailHelp"
                            placeholder="Enter Phone"
                            style={{ fontSize: "13px" }}
                            name="phoneNumber"
                            value={item.phoneNumber}
                            onChange={(e) =>
                              handleChangeOrders(
                                e,
                                item.notificationStatusTypes,
                                setOrders
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-3">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Transactions</h6>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <table
                  className="table table-responsive-sm overflow-auto"
                  id={styles.table}
                >
                  <tbody>
                    {transaction?.map((item) => (
                      <tr>
                        <td>
                          {/* INPUT TYPE CHECKBOX  */}
                          <input
                            onChange={(e) =>
                              handleCheckbox(
                                e,
                                item.notificationStatusTypes,
                                setTransaction,
                                transaction,
                                "TRANSACTION"
                              )
                            }
                            type="checkbox"
                            checked={item.status}
                            className="form-check-input"
                            id="checkbox"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </td>
                        <td>{item.notificationStatusTypes || "N/A"}</td>
                        <td>
                          {/* input  */}
                          <input
                            type="text"
                            className="form-control"
                            id="email"
                            aria-describedby="emailHelp"
                            placeholder="Enter Email"
                            style={{ fontSize: "13px" }}
                            name="emailId"
                            value={item.emailId}
                            onChange={(e) =>
                              handleChangeOrders(
                                e,
                                item.notificationStatusTypes,
                                setTransaction
                              )
                            }
                          />
                        </td>
                        <td>
                          {/* input  */}
                          <input
                            type="text"
                            className="form-control"
                            id="phone"
                            aria-describedby="emailHelp"
                            placeholder="Enter Phone"
                            name="phoneNumber"
                            style={{ fontSize: "13px" }}
                            value={item.phoneNumber}
                            onChange={(e) =>
                              handleChangeOrders(
                                e,
                                item.notificationStatusTypes,
                                setTransaction
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-3">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Settlements</h6>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <table
                  className="table table-responsive-sm overflow-auto"
                  id={styles.table}
                >
                  <tbody>
                    {settlement?.map((item) => (
                      <tr>
                        <td>
                          {/* INPUT TYPE CHECKBOX  */}
                          <input
                            onChange={(e) =>
                              handleCheckbox(
                                e,
                                item.notificationStatusTypes,
                                setSettlement,
                                settlement,
                                "SETTLEMENT"
                              )
                            }
                            type="checkbox"
                            checked={item.status}
                            className="form-check-input"
                            id="checkbox"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </td>
                        <td>{item.notificationStatusTypes || "N/A"}</td>
                        <td>
                          {/* input  */}
                          <input
                            type="text"
                            className="form-control"
                            id="email"
                            aria-describedby="emailHelp"
                            placeholder="Enter Email"
                            style={{ fontSize: "13px" }}
                            name="emailId"
                            value={item.emailId}
                            onChange={(e) =>
                              handleChangeOrders(
                                e,
                                item.notificationStatusTypes,
                                setSettlement
                              )
                            }
                          />
                        </td>
                        <td>
                          {/* input  */}
                          <input
                            type="text"
                            className="form-control"
                            id="phone"
                            aria-describedby="emailHelp"
                            style={{ fontSize: "13px" }}
                            placeholder="Enter Phone"
                            name="phoneNumber"
                            value={item.phoneNumber}
                            onChange={(e) =>
                              handleChangeOrders(
                                e,
                                item.notificationStatusTypes,
                                setSettlement
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-3">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Refunds</h6>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <table
                  className="table table-responsive-sm overflow-auto"
                  id={styles.table}
                >
                  <tbody>
                    {refund?.map((item) => (
                      <tr>
                        <td>
                          {/* INPUT TYPE CHECKBOX  */}
                          <input
                            onChange={(e) =>
                              handleCheckbox(
                                e,
                                item.notificationStatusTypes,
                                setRefund,
                                refund,
                                "REFUND"
                              )
                            }
                            type="checkbox"
                            checked={item.status}
                            className="form-check-input"
                            id="checkbox"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </td>
                        <td>{item.notificationStatusTypes || "N/A"}</td>
                        <td>
                          {/* input  */}
                          <input
                            type="text"
                            className="form-control"
                            id="email"
                            aria-describedby="emailHelp"
                            placeholder="Enter Email"
                            style={{ fontSize: "13px" }}
                            name="emailId"
                            value={item.emailId}
                            onChange={(e) =>
                              handleChangeOrders(
                                e,
                                item.notificationStatusTypes,
                                setRefund
                              )
                            }
                          />
                        </td>
                        <td>
                          {/* input  */}
                          <input
                            type="text"
                            className="form-control"
                            id="phone"
                            aria-describedby="emailHelp"
                            placeholder="Enter Phone"
                            style={{ fontSize: "13px" }}
                            name="phoneNumber"
                            value={item.phoneNumber}
                            onChange={(e) =>
                              handleChangeOrders(
                                e,
                                item.notificationStatusTypes,
                                setRefund
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-3">
          <div className={styles.secondaryCard}>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Remittances</h6>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <table
                  className="table table-responsive-sm overflow-auto"
                  id={styles.table}
                >
                  <tbody>
                    {remittance?.map((item) => (
                      <tr>
                        <td>
                          {/* INPUT TYPE CHECKBOX  */}
                          <input
                            onChange={(e) =>
                              handleCheckbox(
                                e,
                                item.notificationStatusTypes,
                                setRemittance,
                                remittance,
                                "REMITTANCE"
                              )
                            }
                            type="checkbox"
                            checked={item.status}
                            className="form-check-input"
                            id="checkbox"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </td>
                        <td>{item.notificationStatusTypes || "N/A"}</td>
                        <td>
                          {/* input  */}
                          <input
                            type="text"
                            className="form-control"
                            id="email"
                            aria-describedby="emailHelp"
                            placeholder="Enter Email"
                            style={{ fontSize: "13px" }}
                            name="emailId"
                            value={item.emailId}
                            onChange={(e) =>
                              handleChangeOrders(
                                e,
                                item.notificationStatusTypes,
                                setRemittance
                              )
                            }
                          />
                        </td>
                        <td>
                          {/* input  */}
                          <input
                            type="text"
                            className="form-control"
                            id="phone"
                            aria-describedby="emailHelp"
                            placeholder="Enter Phone"
                            style={{ fontSize: "13px" }}
                            name="phoneNumber"
                            value={item.phoneNumber}
                            onChange={(e) =>
                              handleChangeOrders(
                                e,
                                item.notificationStatusTypes,
                                setRemittance
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
