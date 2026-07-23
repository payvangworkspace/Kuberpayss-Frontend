import {
  adminRole,
  merchantRole,
  resellerRole,
  subMerchantRole,
  userEmail,
} from "../services/storageData";
import Wrapper from "./components/wrapper/Wrapper";
import Filter from "./dashboard/components/filter/Filter";
import KycBanner from "./dashboard/components/kycBanner/KycBanner";
export default function Home() {
  return (
    <Wrapper pagename="Dashboard">
      {merchantRole() && <KycBanner />}
      <Filter
        isAdmin={adminRole()}
        isSubMerchant={subMerchantRole()}
        role={merchantRole()}
        userEmail={userEmail()}
        reseller={resellerRole()}
      />
    </Wrapper>
  );
}
