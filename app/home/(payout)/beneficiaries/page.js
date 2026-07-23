import {
  adminRole,
  merchantRole,
  subMerchantRole,
  userEmail,
} from "@/app/services/storageData";
import Details from "./components/Details";

const Beneficiaries = () => {
  return (
    <Details
      isMerchant={merchantRole()}
      isAdmin={adminRole()}
      isSubMerchant={subMerchantRole()}
      userId={userEmail()}
    />
  );
};

export default Beneficiaries;
