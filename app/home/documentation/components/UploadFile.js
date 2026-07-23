"use client";
import { useEffect, useRef, useState } from "react";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { successMsg, errorMsg } from "@/app/services/notify";
import Label from "@/app/ui/label/Label";
import { documentFormData } from "@/app/formBuilder/uploads";
import useGetRequest from "@/app/hooks/useFetch";
import apiClient from "@/app/services/apiClient";
import useDeleteRequest from "@/app/hooks/useDelete";
import styles from "../page.module.css";

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.png,.jpg,.jpeg";
const MAX_FILE_SIZE_MB = 10;

const DocumentationUpload = ({ onSuccess, id, isAdmin }) => {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
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

  const documents = documentationResponse?.data || [];

  const isDocumentActive = (activeValue) => {
    if (typeof activeValue === "boolean") return activeValue;
    if (typeof activeValue === "string") {
      return activeValue.toLowerCase() === "true";
    }
    if (typeof activeValue === "number") return activeValue === 1;
    return false;
  };

  const base64ToBlob = (base64, mimeType = "application/pdf") => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const handleViewDocument = async (docId) => {
    try {
      const res = await apiClient.get(`${endPoints.settings.apiDocsById}/${docId}`);
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
        },
      );
      successMsg(
        `Document ${nextActive ? "activated" : "deactivated"} successfully`,
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
    endPoints.settings.uploadApiDoc,
  );

  const applySelectedFile = (file) => {
    if (!file) return;

    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      errorMsg(`File size must be under ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e) => {
    applySelectedFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    applySelectedFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = selectedFile || fileInputRef.current?.files?.[0];
    const name = "API_DOCUMENT";

    if (!file) {
      errorMsg("Please select a file");
      return;
    }

    const formData = await documentFormData(id, name, file);
    await postData(formData, true);
  };

  useEffect(() => {
    if (response && !error) {
      successMsg("Document uploaded successfully");
      formRef.current?.reset();
      clearSelectedFile();
      getDocumentation(endPoints.settings.allApiDocs);
      onSuccess?.();
    }
  }, [response, error, onSuccess]);

  return (
    <>
      {previewUrl && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h6 className={styles.modalTitle}>Document Preview</h6>
            <iframe
              src={previewUrl}
              className={styles.modalFrame}
              title="Document Preview"
            />
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalBtnPrimary}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = previewUrl;
                  link.download = previewFileName;
                  link.click();
                }}
              >
                Download
              </button>
              <button
                type="button"
                className={styles.modalBtnDanger}
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

      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>Resources</p>
            <h1 className={styles.title}>API Documentation</h1>
            <p className={styles.subtitle}>
              Upload, preview, and manage API documentation files
            </p>
          </div>
        </div>

        {isAdmin && (
          <div className={styles.uploadCard}>
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className={styles.uploadLayout}>
                <div
                  className={`${styles.uploadZone} ${
                    isDragging ? styles.uploadZoneDragging : ""
                  } ${fileName ? styles.uploadZoneHasFile : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  <span className={styles.uploadIcon}>
                    <i className="bi bi-file-earmark-arrow-up" aria-hidden="true" />
                  </span>
                  <p className={styles.uploadTitle}>Upload API Document</p>
                  <p className={styles.uploadHint}>
                    Upload your API documentation file
                    <br />
                    PDF, DOC, DOCX up to {MAX_FILE_SIZE_MB}MB
                  </p>
                  {fileName && (
                    <p className={styles.fileName} title={fileName}>
                      {fileName}
                    </p>
                  )}
                </div>

                <div className={styles.divider}>
                  <span>or</span>
                </div>

                <div className={styles.selectPanel}>
                  <Label label="Select File" htmlFor="file" required />
                  <div className={styles.filePicker}>
                    <button
                      type="button"
                      className={styles.chooseBtn}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose File
                    </button>
                    <span className={styles.filePickerText}>
                      {fileName || "No file chosen"}
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="file"
                    id="file"
                    className={styles.uploadInput}
                    accept={ACCEPTED_TYPES}
                    onChange={handleFileChange}
                    required
                  />
                  <button
                    type="submit"
                    className={styles.uploadBtn}
                    disabled={loading}
                  >
                    <i className="bi bi-cloud-arrow-up" aria-hidden="true" />
                    {loading ? "Uploading..." : "Upload Document"}
                  </button>
                </div>
              </div>

              <div className={styles.infoBar}>
                <i className="bi bi-info-circle" aria-hidden="true" />
                <span>
                  Supported formats: PDF, DOC, DOCX, PNG, JPG. Maximum file
                  size: {MAX_FILE_SIZE_MB}MB.
                </span>
              </div>
            </form>
          </div>
        )}

        <div className={styles.tableCard}>
          <h2 className={styles.tableTitle}>Uploaded API Documents</h2>
          {documents.length > 0 ? (
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>File Name</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, index) => {
                    const active = isDocumentActive(doc.active);
                    return (
                      <tr key={doc.documentId}>
                        <td>{index + 1}</td>
                        <td>
                          <button
                            type="button"
                            className={styles.fileLink}
                            onClick={() => handleViewDocument(doc.documentId)}
                          >
                            <i
                              className="bi bi-file-earmark-pdf"
                              aria-hidden="true"
                            />
                            {doc.documentFileName}
                          </button>
                        </td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${
                              active
                                ? styles.statusActive
                                : styles.statusInactive
                            }`}
                          >
                            <span className={styles.statusDot} />
                            {active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionGroup}>
                            <button
                              type="button"
                              className={styles.actionBtn}
                              onClick={() => handleViewDocument(doc.documentId)}
                            >
                              <i className="bi bi-eye" aria-hidden="true" />
                              View
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${
                                active
                                  ? styles.actionBtnWarning
                                  : styles.actionBtnSuccess
                              }`}
                              onClick={() => handleToggleDocumentStatus(doc)}
                              disabled={
                                updatingDocId === doc.documentId ||
                                deletingDocId === doc.documentId
                              }
                            >
                              <i
                                className={`bi ${
                                  active ? "bi-slash-circle" : "bi-check-circle"
                                }`}
                                aria-hidden="true"
                              />
                              {updatingDocId === doc.documentId
                                ? "Updating..."
                                : active
                                  ? "Set Inactive"
                                  : "Set Active"}
                            </button>
                            {isAdmin && (
                              <button
                                type="button"
                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                onClick={() =>
                                  handleDeleteDocument(doc.documentId)
                                }
                                disabled={
                                  deletingDocId === doc.documentId ||
                                  updatingDocId === doc.documentId
                                }
                              >
                                <i
                                  className="bi bi-trash"
                                  aria-hidden="true"
                                />
                                {deletingDocId === doc.documentId
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateTitle}>
                No Documentation Available
              </p>
              <p className={styles.emptyStateText}>
                {isAdmin
                  ? "Upload an API document using the form above."
                  : "Contact admin for documentation."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentationUpload;
