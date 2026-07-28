import {
  adminRole,
  merchantRole,
  subMerchantRole,
  userEmail,
} from "@/app/services/storageData";
import Details from "./components/Details";

const RollingReserve = () => {
  const merchantId = userEmail();
  return (
    <Details
      role={adminRole()}
      isMerchant={merchantRole()}
      isSubMerchant={subMerchantRole()}
      merchantId={merchantId}
    />
  );
};

export default RollingReserve;
