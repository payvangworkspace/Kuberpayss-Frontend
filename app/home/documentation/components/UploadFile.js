"use client";
import { useEffect, useRef, useState } from "react";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg, errorMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";
import { documentFormData } from "@/app/formBuilder/uploads";
import styles from "./Iframe.module.css";
import useGetRequest from "@/app/hooks/useFetch";
import apiClient from "@/app/services/apiClient";
import useDeleteRequest from "@/app/hooks/useDelete";

const DocumentationUpload = ({ onSuccess, id, isAdmin }) => {
  const formRef = useRef(null);
  const [successAction, setSuccessAction] = useState(false);
  const [viewDocument, setViewDocument] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFileName, setPreviewFileName] = useState("document.pdf");
  const [updatingDocId, setUpdatingDocId] = useState(null);
  const [deletingDocId, setDeletingDocId] = useState(null);
  const { getData: getDocumentation, response: documentationResponse } =
    useGetRequest();
  const { deleteData } = useDeleteRequest();

  useEffect(() => {
    getDocumentation(endPoints.settings.allApiDocs);
  }, []);

  // useEffect(() => {
  //   getDocumentation(endPoints.settings.apiDocsById + "/" + id);
  // }, []);

  const documents = documentationResponse?.data || [];

  const isDocumentActive = (activeValue) => {
    if (typeof activeValue === "boolean") return activeValue;
    if (typeof activeValue === "string") {
      return activeValue.toLowerCase() === "true";
    }
    if (typeof activeValue === "number") return activeValue === 1;
    return false;
  };
  // const getFileUrl = (id) => {
  //   return `${endPoints.documentFile}/${id}`;
  // };
  // const handleViewDocument = (id) => {
  //   const url = getFileUrl(id);
  //   console.log("🚀 ~ handleViewDocument ~ url:", url);
  //   setPreviewUrl(url);
  // };

  const base64ToBlob = (base64, mimeType = "application/pdf") => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const handleViewDocument = async (id) => {
    try {
      const res = await apiClient.get(`${endPoints.settings.apiDocsById}/${id}`);
      const payload = res?.data?.data;

      if (!payload?.data) {
        throw new Error("Invalid document payload");
      }

      const blob = base64ToBlob(payload.data, "application/pdf");
      const url = URL.createObjectURL(blob);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewFileName(payload.fileName || "document.pdf");
      setPreviewUrl(url);
    } catch (err) {
      console.error("Preview Error:", err);
      errorMsg("Unable to load document");
    }
  };

  const handleToggleDocumentStatus = async (doc) => {
    try {
      setUpdatingDocId(doc.documentId);
      const currentActive = isDocumentActive(doc.active);
      const nextActive = !currentActive;
      await apiClient.patch(
        `${endPoints.settings.isActiveDocStatus}/${doc.documentId}/status`,
        { documentId: doc.documentId },
        {
          params: { active: nextActive },
        }
      );
      successMsg(
        `Document ${nextActive ? "activated" : "deactivated"} successfully`
      );
      getDocumentation(endPoints.settings.allApiDocs);
    } catch (err) {
      console.error("Status update failed:", err);
      errorMsg("Unable to update document status");
    } finally {
      setUpdatingDocId(null);
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      setDeletingDocId(docId);
      await deleteData(`${endPoints.settings.deleteApiDoc}/${docId}`);
      successMsg("Document deleted successfully");
      getDocumentation(endPoints.settings.allApiDocs);
    } catch (err) {
      console.error("Delete document failed:", err);
      errorMsg("Unable to delete document");
    } finally {
      setDeletingDocId(null);
    }
  };

  const { postData, error, response, loading } = usePostRequest(
    endPoints.settings.uploadApiDoc
  );

  const handleSubmit = async (e) => {
    console.log("SUBMIT TRIGGERED");

    e.preventDefault();

    const file = e.target.elements.file.files[0];
    const name = "API_DOCUMENT";

    if (!file) {
      errorMsg("Please select a file");
      return;
    }
    console.log("documentFormData:", documentFormData);
    const formData = await documentFormData(id, name, file);
    console.log("FORMDATA:", formData);
    for (let [key, value] of formData.entries()) {
      console.log("👉", key, value);
    }
    await postData(formData, true);
  };

  useEffect(() => {
    if (response && !error) {
      successMsg("Document uploaded successfully");
      formRef.current.reset();
      getDocumentation(endPoints.settings.allApiDocs);
    }
  }, [response, error]);

  return (
    <>
      {previewUrl && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h6>Document Preview</h6>

            <iframe
              src={previewUrl}
              width="100%"
              height="500px"
              title="Document Preview"
            />

            <div className="mt-2">
              {/* ✅ Download button */}
              <button
                className="btn btn-success"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = previewUrl;
                  link.download = previewFileName;
                  link.click();
                }}
              >
                Download
              </button>

              <span className="mx-2"></span>

              {/* ❌ Close */}
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                  }
                  setPreviewUrl(null);
                  setPreviewFileName("document.pdf");
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="wrapper text-center">
        {documents.length === 0 && (
          <>
            <h6 className="text-danger">No Documentation Available</h6>
            <small>Contact admin for documentation</small>
          </>
        )}

        {isAdmin && (
          <form onSubmit={handleSubmit} ref={formRef} className="mt-3">
            <div>
              <Label label="Upload API Document" htmlFor="file" required />
              <input
                type="file"
                name="file"
                id="file"
                accept=".pdf,.doc,.docx,.png,.jpg"
                required
              />
            </div>

            <div className="mt-2">
              <button type="submit" className="submit" disabled={loading}>
                {loading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </form>
        )}
        {documents.length > 0 && (
          <div className="mt-4">
            <h6 className="mb-2">Uploaded API Documents</h6>

            <table className="table table-bordered text-start">
              <thead>
                <tr>
                  <th>#</th>
                  <th>File Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc, index) => (
                  <tr key={doc.documentId}>
                    <td>{index + 1}</td>

                    <td>
                      <span
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handleViewDocument(doc.documentId)}
                      >
                        {doc.documentFileName}
                      </span>
                    </td>

                    <td>
                      {isDocumentActive(doc.active) ? (
                        <span className="text-success">Active</span>
                      ) : (
                        <span className="text-danger">Inactive</span>
                      )}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        type="button"
                        onClick={() => handleViewDocument(doc.documentId)}
                      >
                        View
                      </button>
                      <span className="mx-1"></span>
                      <button
                        className={`btn btn-sm ${
                          isDocumentActive(doc.active)
                            ? "btn-warning"
                            : "btn-success"
                        }`}
                        type="button"
                        onClick={() => handleToggleDocumentStatus(doc)}
                        disabled={
                          updatingDocId === doc.documentId ||
                          deletingDocId === doc.documentId
                        }
                      >
                        {updatingDocId === doc.documentId
                          ? "Updating..."
                          : isDocumentActive(doc.active)
                          ? "Set Inactive"
                          : "Set Active"}
                      </button>
                      {isAdmin && (
                        <>
                          <span className="mx-1"></span>
                          <button
                            className="btn btn-sm btn-danger"
                            type="button"
                            onClick={() => handleDeleteDocument(doc.documentId)}
                            disabled={
                              deletingDocId === doc.documentId ||
                              updatingDocId === doc.documentId
                            }
                          >
                            {deletingDocId === doc.documentId
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentationUpload;
