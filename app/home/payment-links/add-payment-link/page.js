import { cookies } from "next/headers";
import AddForm from "./components/AddForm";
import { decryptToken } from "@/app/utils/decryptToken";
import { adminRole, merchantRole } from "@/app/services/storageData";

const AddPaymentLink = () => {
  const cookieStore = cookies();

  return (
    <AddForm
      merchantRole={merchantRole()}
      role={adminRole()}
      merchantId={decryptToken(cookieStore.get("email").value)}
    />
  );
};

export default AddPaymentLink;
