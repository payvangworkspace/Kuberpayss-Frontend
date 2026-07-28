import {
  adminRole,
  merchantRole,
  resellerRole,
  subAdminRole,
  subMerchantRole,
  userEmail,
} from "@/app/services/storageData";
import PaymentLinkList from "./components/PaymentLinkList";

const PaymentLinks = () => {
  return (
    <PaymentLinkList
      role={adminRole()}
      isMerchant={merchantRole()}
      subAdmin={subAdminRole()}
      subMerchant={subMerchantRole()}
      userEmail={userEmail()}
      resellerRole={resellerRole()}
    />
  );
};
export default PaymentLinks;
