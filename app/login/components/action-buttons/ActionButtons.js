"use client";
import Button from "@/app/ui/button/Button";
import styles from "./ActionButtons.module.css";
import { usePathname, useRouter } from "next/navigation";
const ActionButtons = () => {
  const router = useRouter();
  const pathname = usePathname();
  async function handleSignup() {
    router.push("/signup");
  }
  async function handleRequestDemo() {}
  return (
    <div className={styles.actions}>
      {pathname === "/login" && (
        <Button onClick={handleSignup} label="Signup" className="signup" />
      )}
      {/* <Button
        onClick={handleRequestDemo}
        label="Request For Demo"
        className="demo"
      /> */}
    </div>
  );
};

export default ActionButtons;
