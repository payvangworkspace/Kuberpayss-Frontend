import SettlementList from "./components/SettlementList";
import {
  adminRole,
  merchantRole,
  resellerRole,
  subAdminRole,
  userEmail,
} from "@/app/services/storageData";

const Settlements = () => {
  const merchant = merchantRole();
  return (
    <SettlementList
      role={adminRole()}
      isMerchant={merchant}
      resellerRole={resellerRole()}
      userId={userEmail()}
      subAdmin={subAdminRole()}
    />
  );
};
export default Settlements;
