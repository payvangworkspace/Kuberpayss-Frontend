import { adminRole, merchantRole } from "@/app/services/storageData";
import AddForm from "./components/AddForm";
import { decryptToken } from "@/app/utils/decryptToken";
import { cookies } from "next/headers";

const AddTransfer = () => {
  const isAdmin = adminRole();
  const cookieStore = cookies();
  return (
    <AddForm
      merchantRole={merchantRole()}
      isAdmin={isAdmin}
      merchantId={decryptToken(cookieStore.get("email").value)}
    />
  );
};

export default AddTransfer;
