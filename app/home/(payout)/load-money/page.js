import {
  adminRole,
  merchantRole,
  subMerchantRole,
  userEmail,
} from "@/app/services/storageData";
import Details from "./components/Details";

const LoadMoney = () => {
  return (
    <Details
      isMerchant={merchantRole()}
      isAdmin={adminRole()}
      isSubMerchant={subMerchantRole()}
      userId={userEmail()}
    />
  );
};

export default LoadMoney;
