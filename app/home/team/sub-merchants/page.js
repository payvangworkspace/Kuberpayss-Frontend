import { merchantRole, userEmail } from "@/app/services/storageData";
import SubMerchantList from "./components/SubMerchantList";

const SubMerchants = () => {
  return <SubMerchantList role={merchantRole()} userId={userEmail()} />;
};

export default SubMerchants;
