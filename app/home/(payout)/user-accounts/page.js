import { adminRole, merchantRole, userEmail } from "@/app/services/storageData";
import Details from "./components/Details";

const UserAccount = () => {
  return (
    <Details
      isAdmin={adminRole()}
      isMerchant={merchantRole()}
      userId={userEmail()}
    />
  );
};

export default UserAccount;
