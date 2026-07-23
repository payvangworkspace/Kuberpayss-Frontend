import { useState } from "react";
import apiClient from "../services/apiClient";

const useDeleteRequest = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const deleteData = async (url) => {
    setLoading(true);
    try {
      const res = await apiClient.delete(url);
      setResponse(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, deleteData };
};

export default useDeleteRequest;
