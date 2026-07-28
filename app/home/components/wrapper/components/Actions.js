"use client";
import styles from "./Actions.module.css";
import { logout } from "@/app/utils/message";
import { useRouter } from "next/navigation";
import { deleteToken } from "@/app/services/cookieManager";
import { successMsg } from "@/app/services/notify";
const Actions = () => {
  const router = useRouter();
  const handleLogout = async () => {
    router.push("/");
    const successDelete = await deleteToken();
    if (successDelete) {
      successMsg(logout);
      window.location.reload();
    }
  };

  return (
    <span className={styles.icons}>
      <button onClick={handleLogout}>logout</button>
    </span>
  );
};

export default Actions;
