import { adminRole } from "@/app/services/storageData";
import AddForm from "./components/AddForm";

const AddLoadMoney = () => {
 const isAdmin = adminRole();
  
  return <AddForm isAdmin={isAdmin} />;
};

export default AddLoadMoney;
