"use client";
import { headers } from "./Columns";
import Table from "@/app/ui/table/Table";
import { loadingMsg } from "@/app/utils/message";
import usePaymentTypes from "@/app/hooks/usePaymentType";
const BodyMapping = ({ data = [], loading }) => {
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={5} className="text-center">
            {loadingMsg("payment type")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.paymentTypeId}>
                <td>{item.paymentTypeName}</td>
                <td>{item.paymentTypeCode}</td>
                <td>{item.country?.countryName || "NA"}</td>
                <td>{item.currency?.currencyName}</td>
                <td>{item.currency?.currencyCode}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No Payment Type Available
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};
const PaymentTypeList = ({ isAdmin, isMerchant }) => {
  const { loading, error, paymentTypeList, currentPage, handlePageChange } =
    usePaymentTypes();

  if (error)
    return (
      <p className="text-center">
        Error: {error.message || "Something went wrong"}
      </p>
    );

  return (
    <div className="wrapper">
      <Table
        headers={headers}
        currentPage={paymentTypeList?.pageNumber || 0}
        pageSize={paymentTypeList?.pageSize || 0}
        totalElement={paymentTypeList?.totalElement || null}
        handleNext={() => handlePageChange(currentPage + 1)}
        handlePrev={() => handlePageChange(currentPage - 1)}
        link={
          (isAdmin || isMerchant) &&
          "/home/settings/payment-type/add-payment-type"
        }
        search={false}
        download={false}
      >
        <BodyMapping data={paymentTypeList?.data} loading={!loading} />
      </Table>
    </div>
  );
};

export default PaymentTypeList;
