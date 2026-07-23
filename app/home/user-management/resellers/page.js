import { adminRole, subAdminRole, userEmail } from "@/app/services/storageData";
import Details from "./components/Details";

const Reseller = () => {
  return <Details role={adminRole()} subAdmin={subAdminRole()} userEmail={userEmail()} />;
};

export default Reseller;
