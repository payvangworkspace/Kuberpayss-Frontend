import {
  adminRole,
  merchantRole,
  resellerRole,
  subAdminRole,
  subMerchantRole,
  userEmail,
} from "@/app/services/storageData";
import TransactionList from "./components/TransactionList";
export default function PayIn() {
  const role = adminRole();
  const merchant = merchantRole();

  return (
    <TransactionList
      isMerchant={merchant}
      role={role}
      resellerRole={resellerRole()}
      userId={userEmail()}
      subMerchantRole={subMerchantRole()}
      subAdmin={subAdminRole()}
    />
  );
}
