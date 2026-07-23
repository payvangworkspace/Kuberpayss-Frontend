import { adminRole } from "@/app/services/storageData";
import Acquirers from "./components/Acquirers";

const Acquirer = () => {
  return <Acquirers admin={adminRole()} />;
};

export default Acquirer;
