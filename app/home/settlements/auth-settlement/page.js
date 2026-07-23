import SettlementList from "./components/SettlementList";
import {
  adminRole,
  merchantRole,
  resellerRole,
  subAdminRole,
  userEmail,
} from "@/app/services/storageData";

const Settlements = () => {
  return (
    <SettlementList
      role={adminRole()}
      isMerchant={merchantRole()}
      resellerRole={resellerRole()}
      userId={userEmail()}
      subAdmin={subAdminRole()}
    />
  );
};
export default Settlements;
