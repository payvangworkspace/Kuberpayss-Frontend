import styles from "./Wrapper.module.css";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import { cookies } from "next/headers";
import { decryptToken } from "@/app/utils/decryptToken";
import Actions from "./components/Actions";
import classes from "./components/Actions.module.css";
import {
  acquirerRole,
  merchantRole,
  resellerRole,
} from "@/app/services/storageData";
import Link from "next/link";
import { encryptParams } from "@/app/utils/encryptions";
const Wrapper = ({ pagename, children }) => {
  const cookieStore = cookies();
  return (
    <div className={styles.card}>
      <span className="d-flex justify-content-between">
        <span>
          <h4>{pagename}</h4>
          {/* <Breadcrumbs /> */}
        </span>
        <span className="d-flex gap-2">
          <span className={styles.username}>
            <span>
              Welcome Back <b>{decryptToken(cookieStore.get("email").value)}</b>
            </span>
            <small>{decryptToken(cookieStore.get("user_role").value)}</small>
          </span>
          <span className={classes.icons}>
            {merchantRole() && (
              <Link
                href={`/home/user-management/merchants/${encryptParams(
                  decryptToken(cookieStore.get("email").value)
                )}`}
              >
                Profile
              </Link>
            )}
            {acquirerRole() && (
              <Link
                href={`/home/user-management/acquirer/${encryptParams(
                  decryptToken(cookieStore.get("email").value)
                )}`}
              >
                Profile
              </Link>
            )}
            {resellerRole() && (
              <Link
                href={`/home/user-management/resellers/${encryptParams(
                  decryptToken(cookieStore.get("email").value)
                )}`}
              >
                Profile
              </Link>
            )}
            <Actions />
          </span>
        </span>
      </span>
      <div className="mt-3">{children}</div>
    </div>
  );
};

export default Wrapper;
