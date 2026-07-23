import AuthLayout from "../login/components/auth-layout/AuthLayout";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPassword() {
  return (
    <AuthLayout
      heroTitle="Set a new password"
      heroText="Create a strong password to keep your merchant account secure."
      heroItems={[
        "Encrypted password setup",
        "Instant access after reset",
        "Secure merchant authentication",
      ]}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
