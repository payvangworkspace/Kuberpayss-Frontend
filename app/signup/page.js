import AuthLayout from "../login/components/auth-layout/AuthLayout";
import SignupForm from "./components/SignupForm";

const Signup = () => {
  return (
    <AuthLayout
      wide
      heroTitle="Join Kuber Payss"
      heroText="Create your merchant account and start accepting payments with clarity and control."
      heroItems={[
        "Simple merchant onboarding",
        "Secure account setup",
        "Built for growing businesses",
      ]}
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
