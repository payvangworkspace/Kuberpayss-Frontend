import { adminRole, merchantRole, userEmail } from "@/app/services/storageData";
import TransactionList from "./components/TransactionList";
export default function PayIn() {
  const role = adminRole();
  const merchant = merchantRole();

  return (
    <TransactionList isMerchant={merchant} role={role} userId={userEmail()} />
  );
}
