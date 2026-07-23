import { adminRole, userEmail } from "@/app/services/storageData";
import DocumentationUpload from "./components/UploadFile";

const Documentation = () => {
  return (
    <DocumentationUpload id={userEmail()} isAdmin={adminRole()} />
  );
};

export default Documentation;
