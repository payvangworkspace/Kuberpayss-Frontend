import {
  adminRole,
  resellerRole,
  subAdminRole,
} from "@/app/services/storageData";
import Details from "./components/Details";

const Refund = () => {
  return (
    <Details
      role={adminRole()}
      subAdmin={subAdminRole()}
      resellerRole={resellerRole()}
    />
  );
};

export default Refund;
