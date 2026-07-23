import {
  acquirerRole,
  adminRole,
  merchantRole,
  resellerRole,
  subAdminRole,
  subMerchantRole,
  userEmail,
} from "@/app/services/storageData";
import MerchantMenu from "./MerchantMenu";
import AdminMenu from "./AdminMenu";
import AcquirerMenu from "./AcquirerMenu";
import SubMerchantMenu from "./SubMerchantMenu";
import SubAdminMenu from "./SubAdminMenu";
import ResellerMenu from "./ResellerMenu";
const Menu = () => {
  if (merchantRole()) return <MerchantMenu />;
  else if (adminRole()) return <AdminMenu />;
  else if (acquirerRole()) return <AcquirerMenu />;
  else if (resellerRole()) return <ResellerMenu userId={userEmail()} />;
  else if (subAdminRole()) return <SubAdminMenu userId={userEmail()} />;
  else if (subMerchantRole()) return <SubMerchantMenu userId={userEmail()} />;
};

export default Menu;
