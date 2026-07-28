import Details from "./components/Details";
import { adminRole } from "@/app/services/storageData";

const LoginHistory = () => {
  return <Details role={adminRole()} />;
};

export default LoginHistory;
