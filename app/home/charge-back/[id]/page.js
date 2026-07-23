"use client";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ViewDocument from "./ViewDocumentModal";
import Link from "next/link";
import { dateFormatter } from "@/app/utils/dateFormatter";

const ChargeBackDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const merchantName = searchParams.get("merchantName") || "N/A";

  const {
    getData: getCommentData,
    response: commentData,
    loading: commentLoading,
    error: commentError,
  } = useGetRequest();
  const {
    getData: getDocumentsData,
    response: documentData,
    loading: documentLoading,
    error: documentError,
  } = useGetRequest();

  const [viewDocument, setViewDocument] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  useEffect(() => {
    getCommentData(
      endPoints.chargeBack.getAllComments +
        `${params.id}` +
        "/" +
        "comments?page=0&size=25"
    );
    getDocumentsData(
      endPoints.chargeBack.getAllDocuments +
        `${params.id}` +
        "/" +
        "documents?page=0&size=25"
    );
  }, [params.id]);

  const comments = commentData?.data || [];
  const documents = documentData?.data || [];

  const handleViewDocument = (documentId) => {
    setSelectedDocumentId(documentId);
    setViewDocument(true);
  };

  const handleRefreshDocuments = () => {
    getDocumentsData(
      endPoints.chargeBack.getAllDocuments +
        `${params.id}` +
        "/" +
        "documents?page=0&size=25"
    );
  };

  return (
    <>
      {viewDocument && selectedDocumentId && (
        <ViewDocument
          id={selectedDocumentId}
          url={`/admin/chargebacks/${params.id}/documents`}
          onClose={() => {
            setViewDocument(false);
            setSelectedDocumentId(null);
          }}
          onSuccess={handleRefreshDocuments}
        />
      )}
      <div className="d-flex justify-content-between align-items-center gap-2">
        <h4 className="mb-4">Chargeback Details ({merchantName})</h4>
        <Link
          href="/home/charge-back"
          style={{
            backgroundColor: "orange",
            textDecoration: "none",
            color: "black",
            borderRadius: "4px",
            fontSize: "14px",
          }}
          className="p-1 btn-sm mb-4"
        >
          Back
        </Link>
      </div>

      <div className="wrapper">
        <div className="row">
          {/* Comments Section */}
          <div className="col-12 mb-5">
            <h4 className="mb-4">Chargeback Comments </h4>

            {commentLoading && (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {!commentLoading && comments.length === 0 && (
              <div className="alert alert-info" role="alert">
                No comments available.
              </div>
            )}

            {!commentLoading && comments.length > 0 && (
              <div className="row">
                {comments.map((comment) => (
                  <div key={comment.commentId} className="col-12 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-subtitle text-muted">
                            {comment.commentedByName || "Unknown User"}
                          </h6>
                          <span className="badge bg-secondary">
                            {comment.commenterRole || "N/A"}
                          </span>
                        </div>
                        <p className="card-text">
                          {comment.comment || "No comment"}
                        </p>
                        {comment.commentDate && (
                          <small className="text-muted">
                            {dateFormatter(comment.commentDate)}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div className="col-12">
            <h4 className="mb-4">Chargeback Documents</h4>

            {documentLoading && (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {!documentLoading && documents.length === 0 && (
              <div className="alert alert-info" role="alert">
                No documents available.
              </div>
            )}

            {!documentLoading && documents.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Uploaded By</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.documentId}>
                        <td>{doc.fileName || "N/A"}</td>
                        <td>{doc.uploadedByName || "Unknown"}</td>
                        <td>{doc.description || "No description"}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleViewDocument(doc.documentId)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
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

export default ChargeBackDetails;
