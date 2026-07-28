import { adminRole, merchantRole } from "@/app/services/storageData";
import PaymentTypeList from "./components/PaymentTypes";

const PaymentType = () => {
  return <PaymentTypeList isMerchant={merchantRole()} isAdmin={adminRole()} />;
};

export default PaymentType;
