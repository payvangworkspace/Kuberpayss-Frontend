import { useState } from "react";
import apiClient from "../services/apiClient";
import { multipartHeader } from "../services/headerConfig";

const usePostRequest = (url, defaultHeaders = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const postData = async (
    data,
    formData = false,
    responseType = false,
    // options can be headers object OR { url, headers }
    options = {},
  ) => {
    setLoading(true);
    setError(null);
    try {
      const headersFromOptions =
        options && options.headers ? options.headers : options || {};
      const urlToUse = (options && options.url) || url;

      // Merge headers: defaultHeaders <- headersFromOptions <- multipartHeader (if formData)
      const headers = {
        ...defaultHeaders,
        ...headersFromOptions,
        ...(formData ? multipartHeader : {}),
      };

      // handle FormData in environments where FormData exists
      const mergedHeaders = { ...headers };
      if (typeof FormData !== "undefined" && data instanceof FormData) {
        mergedHeaders["Content-Type"] = "multipart/form-data";
      }

      const res = await apiClient.post(urlToUse, data, {
        headers: Object.keys(mergedHeaders).length ? mergedHeaders : undefined,
        responseType: responseType ? "blob" : undefined,
      });
      setResponse(res);
      return res;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error, response };
};

export default usePostRequest;
