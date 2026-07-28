import { adminRole, subAdminRole, userEmail } from "@/app/services/storageData";
import MerchantList from "./components/Merchants";
const Merchants = () => (
  <MerchantList
    role={adminRole()}
    subAdmin={subAdminRole()}
    userEmail={userEmail()}
  />
);
export default Merchants;
