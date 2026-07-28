"use client";
import Table from "@/app/ui/table/Table";
import React, { useEffect, useState } from "react";
import { headers } from "./Column";
import {
  dateFormatter,
  inputFieldDateFormatter,
} from "@/app/utils/dateFormatter";
import { queryStringWithKeyword } from "@/app/services/queryString";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import Label from "@/app/ui/label/Label";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { loadingMsg } from "@/app/utils/message";
import AcceptFightChargeback from "./AcceptFightChargebackModal";
import Link from "next/link";
import Comment from "./CommentModal";
import { Eye, MessageCircleIcon, Upload } from "lucide-react";
import UpdateResolution from "./UpdateResolutionModal";
import UpdateStatus from "./UpdateStatus";
import CloseChargeBack from "./CloseChargebackModal";
import UploadEvidence from "./UploadEvidenceModal";

const BodyMapping = ({
  data = [],
  loading = true,
  merchant,
  handleViewModel,
  admin,
}) => {
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={8} className="text-center">
            {loadingMsg("charge back")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.chargebackId}>
                <td>{item.chargebackId || "NA"}</td>
                <td>{item.transactionId || "NA"}</td>
                <td>{item.chargebackAmount || "NA"}</td>
                <td>{item.chargebackDate || "NA"}</td>
                <td>{item.chargebackType}</td>
                <td>{item.merchantName || "NA"}</td>
                <td>{item.status || "NA"}</td>
                <td colSpan={15}>
                  <span className="d-flex align-items-center gap-2">
                    {merchant &&
                      item.status !== "WON" &&
                      item.status !== "LOST" &&
                      item.status !== "CLOSED" &&
                      item.status !== "REPRESENTED" &&
                      item.status !== "ACCEPTED" && (
                        <span className="d-flex gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleViewModel(item.chargebackId, "accept")
                            }
                            className="btn btn-success btn-sm"
                          >
                            Accept
                          </button>
                        </span>
                      )}
                    {merchant &&
                      item.status !== "WON" &&
                      item.status !== "LOST" &&
                      item.status !== "CLOSED" &&
                      item.status !== "REPRESENTED" &&
                      item.status !== "ACCEPTED" && (
                        <span className="d-flex gap-3">
                          <button
                            onClick={() =>
                              handleViewModel(item.chargebackId, "represent")
                            }
                            type="button"
                            className="btn btn-danger btn-sm"
                          >
                            Fight
                          </button>
                        </span>
                      )}
                    {admin && item.status === "REPRESENTED" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleViewModel(item.chargebackId, "status")
                        }
                        className="btn btn-info btn-sm"
                      >
                        Start
                      </button>
                    )}
                    {admin && item.status === "IN_PROGRESS" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleViewModel(item.chargebackId, "resolution")
                        }
                        className="btn btn-info btn-sm"
                      >
                        Update
                      </button>
                    )}
                    {admin &&
                      item.status === "WON" &&
                      item.status === "LOST" &&
                      item.status === "ACCEPTED" &&
                      item.status !== "CLOSED" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleViewModel(item.chargebackId, "close")
                          }
                          className="btn btn-secondary btn-sm"
                        >
                          Close
                        </button>
                      )}
                    {(admin || merchant) &&
                      item.status !== "WON" &&
                      item.status !== "LOST" &&
                      item.status !== "CLOSED" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleViewModel(item.chargebackId, "documents")
                          }
                          className="btn btn-secondary btn-sm"
                        >
                          <Upload size={18} />
                        </button>
                      )}
                    <Link
                      href={`/home/charge-back/${
                        item.chargebackId
                      }?merchantName=${encodeURIComponent(
                        item.merchantName || "",
                      )}`}
                    >
                      <Eye size={18} />
                    </Link>
                    {item.status !== "WON" &&
                      item.status !== "LOST" &&
                      item.status !== "CLOSED" && (
                        <button
                          onClick={() =>
                            handleViewModel(item.chargebackId, "comments")
                          }
                          style={{ border: "none", background: "transparent" }}
                          type="button"
                        >
                          <MessageCircleIcon color="green" size={18} />
                        </button>
                      )}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9}>No data Available</td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};
const ChargeBackList = ({ role, isMerchant, userId, subAdmin }) => {
  const [keyword, setKeyword] = useState({ userId: "" });
  const handleKeyword = (dropdownKey, keyword) => {
    setKeyword({ ...keyword, [dropdownKey]: keyword });
  };
  const [merchant, setMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });
  const {
    response: merchantResponse = [],
    postData: getAllMerchants,
    error: merchantError,
    loading: merchantLoading,
  } = usePostRequest(endPoints.users.allMerchantList);

  const handleChangeMerchant = async (id, name) => {
    setMerchant({ id, name });
  };

  useEffect(() => {
    getAllMerchants(
      queryStringWithKeyword(
        0,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword.userId,
      ),
    );
  }, [keyword.userId]);
  // end of merchant fetch logic
  useEffect(() => {
    if (merchantResponse && !merchantError) {
      setMerchant({
        id: merchantResponse?.data?.data[0]?.userId || "",
        name: merchantResponse?.data?.data[0]?.fullName || "Select Merchant",
      });
    }
  }, [merchantError, merchantResponse]);

  const [loader, setLoader] = useState(false);
  // Handle for pagination

  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const [dateRange, setDateRange] = useState({
    dateFrom: dateFormatter(new Date()),
    dateTo: dateFormatter(new Date()),
  });

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: dateFormatter(value),
    }));
  };

  const {
    postData: getChargebackData,
    response: chargebackResponse,
    loading: chargebackLoading,
  } = usePostRequest(endPoints.chargeBack.allChargeBack);

  useEffect(() => {
    getChargebackData({
      userName: isMerchant ? userId : merchant.id,
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
      start: currentPage,
      size: process.env.NEXT_PUBLIC_PAGINATION_SIZE,
    });
  }, [merchant.id, dateRange.dateFrom, dateRange.dateTo, currentPage]);

  useEffect(() => {
    if (chargebackLoading) setLoader(true);
  }, [chargebackLoading]);

  const [viewModal, setViewModal] = useState(false);
  const [type, setType] = useState("");
  const [chargebackId, setChargebackId] = useState("");

  const handleViewModel = (id, type) => {
    setType(type);
    setChargebackId(id);
    setViewModal(true);
  };

  return (
    <>
      {viewModal && (type === "accept" || type === "represent") && (
        <AcceptFightChargeback
          id={chargebackId}
          type={type}
          merchant={merchant.name}
          onClick={() => setViewModal(false)}
          onSuccess={() => {
            getChargebackData({
              userName: isMerchant ? userId : merchant.id,
              dateFrom: dateRange.dateFrom,
              dateTo: dateRange.dateTo,
              start: currentPage,
              size: process.env.NEXT_PUBLIC_PAGINATION_SIZE,
            });
          }}
        />
      )}

      {viewModal && type === "comments" && (
        <Comment
          id={chargebackId}
          type={type}
          merchant={merchant.name}
          onClick={() => setViewModal(false)}
          onSuccess={() => {
            getChargebackData({
              userName: isMerchant ? userId : merchant.id,
              dateFrom: dateRange.dateFrom,
              dateTo: dateRange.dateTo,
              start: currentPage,
              size: process.env.NEXT_PUBLIC_PAGINATION_SIZE,
            });
          }}
        />
      )}
      {viewModal && type === "resolution" && (
        <UpdateResolution
          id={chargebackId}
          type={type}
          merchant={merchant.name}
          onClick={() => setViewModal(false)}
          onSuccess={() => {
            getChargebackData({
              userName: isMerchant ? userId : merchant.id,
              dateFrom: dateRange.dateFrom,
              dateTo: dateRange.dateTo,
              start: currentPage,
              size: process.env.NEXT_PUBLIC_PAGINATION_SIZE,
            });
          }}
        />
      )}
      {viewModal && type === "status" && (
        <UpdateStatus
          id={chargebackId}
          type={type}
          merchant={merchant.name}
          onClick={() => setViewModal(false)}
          onSuccess={() => {
            getChargebackData({
              userName: isMerchant ? userId : merchant.id,
              dateFrom: dateRange.dateFrom,
              dateTo: dateRange.dateTo,
              start: currentPage,
              size: process.env.NEXT_PUBLIC_PAGINATION_SIZE,
            });
          }}
        />
      )}
      {viewModal && type === "close" && (
        <CloseChargeBack
          id={chargebackId}
          type={type}
          merchant={merchant.name}
          onClick={() => setViewModal(false)}
          onSuccess={() => {
            getChargebackData({
              userName: isMerchant ? userId : merchant.id,
              dateFrom: dateRange.dateFrom,
              dateTo: dateRange.dateTo,
              start: currentPage,
              size: process.env.NEXT_PUBLIC_PAGINATION_SIZE,
            });
          }}
        />
      )}

      {viewModal && type === "documents" && (
        <UploadEvidence
          id={chargebackId}
          type={type}
          merchant={merchant.name}
          onClick={() => setViewModal(false)}
          onSuccess={() => {
            getChargebackData({
              userName: isMerchant ? userId : merchant.id,
              dateFrom: dateRange.dateFrom,
              dateTo: dateRange.dateTo,
              start: currentPage,
              size: process.env.NEXT_PUBLIC_PAGINATION_SIZE,
            });
          }}
        />
      )}
      <div className="wrapper">
        <div className="row">
          {(role || subAdmin) && (
            <div className="col-md-2 col-sm-12 mb-4">
              <>
                <Label htmlFor="merchant" label="Merchant" />
                <Dropdown
                  initialLabel="Select Merchant"
                  selectedValue={merchant}
                  options={merchantResponse?.data.data}
                  onChange={handleChangeMerchant}
                  id="userId"
                  value="fullName"
                  search={true}
                  onSearch={handleKeyword}
                />
              </>
            </div>
          )}
          <div className="col-md-2 col-sm-12 mb-4">
            <Label htmlFor="dateFrom" label="Date From" />
            <input
              type="date"
              id="inputDate"
              name="dateFrom"
              onChange={handleDateChange}
              value={inputFieldDateFormatter(dateRange.dateFrom)}
            />
          </div>
          <div className="col-md-2 col-sm-12 mb-4">
            <Label htmlFor="dateTo" label="Date To" />
            <input
              type="date"
              id="inputDate"
              name="dateTo"
              onChange={handleDateChange}
              value={inputFieldDateFormatter(dateRange.dateTo)}
            />
          </div>
        </div>
        <Table
          headers={headers}
          currentPage={chargebackResponse?.data?.pageNumber || 0}
          pageSize={chargebackResponse?.data?.pageSize || 0}
          totalElement={chargebackResponse?.data?.totalElement || null}
          handleNext={handleNext}
          handlePrev={handlePrev}
          link={false}
          download={false}
          search={false}
        >
          <BodyMapping
            merchant={isMerchant}
            data={chargebackResponse?.data?.data}
            handleViewModel={handleViewModel}
            admin={role}
          />
        </Table>
      </div>
    </>
  );
};

export default ChargeBackList;
