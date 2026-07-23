import styles from "./Wrapper.module.css";
import { cookies } from "next/headers";
import { decryptToken } from "@/app/utils/decryptToken";
import ProfileMenu from "./components/ProfileMenu";
import {
  acquirerRole,
  merchantRole,
  resellerRole,
} from "@/app/services/storageData";
import { encryptParams } from "@/app/utils/encryptions";

const Wrapper = ({ pagename, children }) => {
  const cookieStore = cookies();
  const email = decryptToken(cookieStore.get("email").value);
  const role = decryptToken(cookieStore.get("user_role").value);

  let profileHref = "";
  if (merchantRole()) {
    profileHref = `/home/user-management/merchants/${encryptParams(email)}`;
  } else if (acquirerRole()) {
    profileHref = `/home/user-management/acquirer/${encryptParams(email)}`;
  } else if (resellerRole()) {
    profileHref = `/home/user-management/resellers/${encryptParams(email)}`;
  }

  return (
    <div className={styles.card}>
<span className="d-flex justify-content-between align-items-center">
        <span>
          {pagename ? <h4>{pagename}</h4> : <span />}
        </span>
        <ProfileMenu email={email} role={role} profileHref={profileHref} />
      </span>
      <div className={pagename ? "mt-3" : "mt-1"}>{children}</div>
    </div>
  );
};

export default Wrapper;
