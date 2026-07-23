import {
  adminRole,
  merchantRole,
  subMerchantRole,
} from "@/app/services/storageData";
import Details from "./components/Details";

const Remittance = () => {
  return (
    <Details
      role={adminRole()}
      isMerchant={merchantRole()}
      isSubMerchant={subMerchantRole()}
    />
  );
};

export default Remittance;
