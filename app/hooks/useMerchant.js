const { useState, useEffect } = require("react");
const { default: usePostRequest } = require("./usePost");
const { endPoints } = require("../services/apiEndpoints");
const { queryStringWithKeyword } = require("../services/queryString");

const useMerchant = () => {
  const [selectedMerchant, setSelectedMerchant] = useState({
    id: "",
    name: "Select Merchant",
  });
  const {
    response: merchantList,
    postData,
    error,
    loading,
  } = usePostRequest(endPoints.users.merchantListOnly);
  useEffect(() => {
    postData(queryStringWithKeyword(0));
  }, []);
  useEffect(() => {
    if (merchantList && !error) {
      setSelectedMerchant({
        id: merchantList?.data?.data[0]?.userId || "",
        name: merchantList?.data?.data[0]?.fullName || "Select Merchant",
      });
    }
  }, [merchantList, error]);
  const handleMerchantChange = (id, name) => {
    setSelectedMerchant({ id, name });
  };
  return { selectedMerchant, merchantList, handleMerchantChange };
};

export default useMerchant;
