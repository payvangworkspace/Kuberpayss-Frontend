import { adminRole } from "@/app/services/storageData";
import AddForm from "./components/AddForm";

const AddTransfer = () => {
  const isAdmin = adminRole();
  return <AddForm isAdmin={isAdmin} />;
};

export default AddTransfer;
