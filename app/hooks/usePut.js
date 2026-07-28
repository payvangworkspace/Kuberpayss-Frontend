import { useState } from "react";
import apiClient from "../services/apiClient";

const usePutRequest = (url) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // putData(data, options) where options can include { url }
  const putData = async (data, options = {}) => {
    setLoading(true);
    try {
      const urlToUse = options.url || url;
      const result = await apiClient.put(urlToUse, data);
      setResponse(result);
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, putData };
};

export default usePutRequest;
