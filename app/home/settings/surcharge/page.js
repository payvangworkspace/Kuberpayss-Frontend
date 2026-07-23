import { adminRole } from "@/app/services/storageData";
import Details from "./components/Details";
const Surcharge = () => {
  return <Details role={adminRole()} />;
};

export default Surcharge;
