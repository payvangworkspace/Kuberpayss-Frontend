const { useState, useEffect } = require("react");
const { default: useGetRequest } = require("./useFetch");
const { endPoints } = require("../services/apiEndpoints");
const { queryString } = require("../services/queryString");

const usePaymentTypes = (initialPage = 0) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const {
    loading,
    error,
    response: paymentTypeList,
    getData,
  } = useGetRequest();

  useEffect(() => {
    getData(endPoints.settings.paymentType + queryString(currentPage));
  }, [currentPage]);

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  return {
    loading,
    error,
    paymentTypeList,
    currentPage,
    handlePageChange,
  };
};

export default usePaymentTypes;
