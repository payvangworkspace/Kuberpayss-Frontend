import { adminRole, merchantRole, userEmail } from "@/app/services/storageData";
import AddForm from "./components/AddForm";

const AddBeneficiary = () => {
  const isAdmin = adminRole();
  const isMerchant = merchantRole();

  return (
    <AddForm isAdmin={isAdmin} isMerchant={isMerchant} userId={userEmail()} />
  );
};

export default AddBeneficiary;
