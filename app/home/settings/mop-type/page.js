import { adminRole, merchantRole } from "@/app/services/storageData";
import MopList from "./components/MopList";

const MopType = () => {
  return <MopList isMerchant={merchantRole()} isAdmin={adminRole()} />;
};

export default MopType;
