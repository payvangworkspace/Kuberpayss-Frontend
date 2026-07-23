import {
  adminRole,
  merchantRole,
  subAdminRole,
  userEmail,
} from "@/app/services/storageData";
import ChargeBackList from "./components/ChargeBackList";

const ChargeBack = () => {
  const merchant = merchantRole();
  const userId = userEmail();
  const subAdmin = subAdminRole();

  return (
    <ChargeBackList
      role={adminRole()}
      isMerchant={merchant}
      userId={userId}
      subAdmin={subAdmin}
    />
  );
};

export default ChargeBack;
