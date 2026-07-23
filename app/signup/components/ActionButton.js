"use client";

import { useRouter } from "next/navigation";
import styles from "../../login/components/action-buttons/ActionButtons.module.css";
import Button from "@/app/ui/button/Button";
const ActionButton = () => {
  const router = useRouter();
  async function handleLogin() {
    router.push("/login");
  }
  return (
    <div className={styles.actions}>
      <Button onClick={handleLogin} label="Login" className="signup" />
    </div>
  );
};

export default ActionButton;
