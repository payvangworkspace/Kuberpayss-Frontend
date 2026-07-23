import {
  adminRole,
  merchantRole,
  resellerRole,
  subAdminRole,
  subMerchantRole,
  userEmail,
} from "@/app/services/storageData";
import AllOrderList from "./components/OrderList";
const OrderList = () => {
  const role = adminRole();
  const merchant = merchantRole();
  return (
    <AllOrderList
      role={role}
      adminRole={adminRole()}
      isMerchant={merchant}
      resellerRole={resellerRole()}
      subMerchantRole={subMerchantRole()}
      userId={userEmail()}
      subAdmin={subAdminRole()}
    />
  );
};

export default OrderList;
