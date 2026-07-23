import AuthLayout from "../login/components/auth-layout/AuthLayout";
import ForgotPasswordForm from "./components/forgot-password-form/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <AuthLayout
      heroTitle="Reset your password"
      heroText="Recover access to your merchant account securely and get back to managing payments."
      heroItems={[
        "OTP verification for secure recovery",
        "Quick password reset flow",
        "Return to dashboard in minutes",
      ]}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
