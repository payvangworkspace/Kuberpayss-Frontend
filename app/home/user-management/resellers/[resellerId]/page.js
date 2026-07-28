import {
  adminRole,
  merchantRole,
  resellerRole,
  userEmail,
} from "@/app/services/storageData";
import Details from "./components/details";

const ResellerDetail = () => {
  return (
    <Details
      merchantRole={merchantRole()}
      adminRole={adminRole()}
      userEmail={userEmail()}
      resellerRole={resellerRole()}
    />
  );
};

export default ResellerDetail;
