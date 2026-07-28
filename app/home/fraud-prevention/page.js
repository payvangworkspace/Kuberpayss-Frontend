import { adminRole } from "@/app/services/storageData";
import Details from "./components/Details";
import { cookies } from "next/headers";
import { decryptToken } from "@/app/utils/decryptToken";

export default function FraudPrevention() {
  const cookieStore = cookies();
  return (
    <Details
      role={adminRole()}
      userId={decryptToken(cookieStore.get("email").value)}
      fullName={decryptToken(cookieStore.get("fullName").value)}
    />
  );
}
