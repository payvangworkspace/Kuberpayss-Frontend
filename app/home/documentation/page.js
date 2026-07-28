import { adminRole, userEmail } from "@/app/services/storageData";
import Wrapper from "../components/wrapper/Wrapper";
import DocumentationUpload from "./components/UploadFile";

const Documentation = () => {
  return (
    <Wrapper pagename="Documentation">
      <DocumentationUpload id={userEmail()} isAdmin={adminRole()} />
      {/* <div className="wrapper text-center">
        <h6 className="text-danger">No Documentation Available</h6>
        <small>Contact admin for documentation</small>
      </div> */}
    </Wrapper>
  );
};

export default Documentation;
