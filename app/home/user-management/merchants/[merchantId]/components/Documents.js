"use client";
import { useEffect, useState } from "react";
import styles from "../page.module.css";
import AddDocument from "../modals/AddDocument";
import AddOtherDocument from "../modals/AddOtherDocument";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import Link from "next/link";
import ViewDocument from "../documents/ViewDocument";
const style = { width: 100 };
// let documents = {
//   "Trade Licence": {},
//   "Business Registration Certificate": {},
//   "MOA and MOU": {},
//   "TAX/VAT Registration Certificate": {},
//   "Lease/Rental Certificate": {},
//   "Utility Bill": {},
//   passport: {},
//   Visa: {},
//   "Valid User Id": {},
//   "Refund and Cancellation Policy": {},
//   "Bank Details": {},
//   "Vender Agreement": {},
//   "Shipping Policy": {},
// };

let requiredDocuments = [
  "MOA and MOU",
  "TAX/VAT Registration Certificate",
  "Lease/Rental Certificate",
  "Utility Bill",
  "Visa",
  "Vender Agreement",
  "Shipping Policy",
];

const filterDocumentType = async (array) => {
  let documents = {
    "Trade Licence": {},
    "Business Registration Certificate": {},
    "MOA and MOU": {},
    "TAX/VAT Registration Certificate": {},
    "Lease/Rental Certificate": {},
    "Utility Bill": {},
    Passport: {},
    Visa: {},
    "Valid User Id": {},
    "Refund and Cancellation Policy": {},
    "Bank Details": {},
    "Vender Agreement": {},
    "Shipping Policy": {},
  };

  const keys = Object.keys(documents);
  array.forEach((document) => {
    if (keys.includes(document.documentType)) {
      documents[`${document.documentType}`] = { ...document };
    } else {
      // Preserve document data even if it's not in the predefined list
      documents[`${document.documentType}`] = { ...document };
    }
  });

  return documents;
};

const Documents = ({ name, id, role }) => {
  const [successAction, setSuccessAction] = useState(false);
  // Adding a document
  const [viewAddDocument, setViewAddDocument] = useState(false);
  const [document, setDocument] = useState("");
  const [viewAddOtherDocument, setViewAddOtherDocument] = useState(false);
  const handleDocumentAdd = (type) => {
    console.log("object");
    setDocument(type);
    setViewAddDocument(true);
  };
  const handleAddOtherDocument = () => {
    setViewAddOtherDocument(true);
  };
  // Viewing a document
  const [viewDocument, setViewDocument] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const [verified, setVerified] = useState(false);
  const [rejected, setRejected] = useState(null);
  const handleViewDocument = (id, verified, reason) => {
    setDocumentId(id);
    setRejected(reason);
    setVerified(verified);
    setViewDocument(true);
  };
  const [allDocuments, setAllDocuments] = useState(null);
  const { getData, response, error, loading } = useGetRequest();
  useEffect(() => {
    getData(endPoints.document + "/" + id);
  }, [successAction]);

  const sortDocuments = async (response) => {
    const data = await filterDocumentType(response.data);
    setAllDocuments(data);
  };

  useEffect(() => {
    if (response && !error) {
      sortDocuments(response);
    }
  }, [response, error, successAction]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center">Error: {error.message}</p>;
  if (response)
    return (
      <>
        {viewDocument && (
          <ViewDocument
            id={documentId}
            url={endPoints.documentFile}
            onClose={() => setViewDocument(!viewDocument)}
            onSuccess={() => setSuccessAction(!successAction)}
            merchant={role}
            verified={verified}
            rejected={rejected}
          />
        )}
        {viewAddDocument && (
          <AddDocument
            name={name}
            id={id}
            type={document}
            onSuccess={() => setSuccessAction(!successAction)}
            onClose={() => setViewAddDocument(!viewAddDocument)}
          />
        )}
        {viewAddOtherDocument && (
          <AddOtherDocument
            name={name}
            id={id}
            onSuccess={() => setSuccessAction(!successAction)}
            onClose={() => setViewAddOtherDocument(!viewAddOtherDocument)}
          />
        )}
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-end mb-3">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleAddOtherDocument}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Other Document
              </button>
            </div>
            <div className={styles.secondaryCard}>
              <table className="table table-responsive-sm" id={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: 70 }}>SNO</th>
                    <th>DOCUMENT NAME</th>
                    <th>FILE</th>
                    <th style={style}>UPLOAD</th>
                    <th style={{ width: 200 }}>STATUS</th>
                  </tr>
                </thead>
                {allDocuments && response && (
                  <tbody>
                    {Object.keys(allDocuments)
                      .filter((document) => document !== "Others")
                      .map((document, index) => (
                        <tr key={document}>
                          <td>{index + 1}</td>
                          <td>{document}</td>
                          <td>
                            {allDocuments[document].documentFileName ? (
                              <Link
                                href="#"
                                role="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDocument(
                                    allDocuments[document].documentId,
                                    allDocuments[document].verified,
                                    allDocuments[document].rejectedReason
                                  );
                                }}
                              >
                                {allDocuments[document].documentFileName}
                              </Link>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            {!allDocuments[document].verified && (
                              <i
                                className="bi bi-cloud-upload text-success"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDocumentAdd(document);
                                }}
                                style={{ cursor: "pointer" }}
                              ></i>
                            )}
                          </td>

                          <td>
                            {allDocuments[document].verified ? (
                              <i className="bi bi-patch-check-fill text-success"></i>
                            ) : (
                              ""
                            )}
                            {allDocuments[document].rejectedReason && (
                              <span className="text-danger">
                                {allDocuments[document].rejectedReason}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </>
    );
};

export default Documents;
