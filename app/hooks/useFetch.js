import { useState } from "react";
import apiClient from "../services/apiClient";
import { blobResponseType } from "../services/headerConfig";

const useGetRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const getData = async (url, responseType = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(url, responseType && blobResponseType);
      if (!responseType) {
        setResponse(res.data);
      } else if (res.data === null) {
        setResponse(null);
      } else {
        const blob = URL.createObjectURL(res.data);
        setResponse(blob);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { getData, loading, error, response };
};
export default useGetRequest;
