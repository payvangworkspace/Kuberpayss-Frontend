"use client";
import { useState } from "react";
import styles from "./ProfileMenu.module.css";
import ClickAwayListener from "react-click-away-listener";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/app/utils/message";
import { deleteToken } from "@/app/services/cookieManager";
import { successMsg } from "@/app/services/notify";

const ProfileMenu = ({ email = "", role = "", profileHref = "" }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const initial = (email?.[0] || "U").toUpperCase();

  const handleLogout = async () => {
    router.push("/");
    const successDelete = await deleteToken();
    if (successDelete) {
      successMsg(logout);
      window.location.reload();
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={styles.wrapper}>
        <button
          type="button"
          className={styles.avatarButton}
          onClick={() => setOpen((o) => !o)}
          aria-label="Open profile menu"
        >
          {initial}
        </button>

        {open && (
          <div className={styles.popover}>
            <div className={styles.popoverHeader}>
              <span className={styles.avatarLarge}>{initial}</span>
              <span className={styles.identity}>
                <span className={styles.email}>{email}</span>
                <span className={styles.role}>{role}</span>
              </span>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setOpen(false)}
                aria-label="Close profile menu"
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>

            <div className={styles.popoverBody}>
              <div className={styles.fieldBlock}>
                <span className={styles.fieldLabel}>Email</span>
                <span className={styles.fieldValue}>{email}</span>
              </div>
              <div className={styles.fieldBlock}>
                <span className={styles.fieldLabel}>Role</span>
                <span className={styles.fieldValue}>{role}</span>
              </div>

              {profileHref && (
                <Link
                  href={profileHref}
                  className={styles.profileLink}
                  onClick={() => setOpen(false)}
                >
                  <i className="bi bi-person" aria-hidden="true" />
                  View Profile
                </Link>
              )}

              <button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right" aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default ProfileMenu;
