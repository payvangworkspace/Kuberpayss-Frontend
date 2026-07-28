import { cookies } from "next/headers";
import { decryptToken } from "../utils/decryptToken";

export const merchantRole = () => {
  const cookieStore = cookies();
  const role = cookieStore.get("user_role")?.value;
  return decryptToken(role) === "MERCHANT";
};
export const adminRole = () => {
  const cookieStore = cookies();
  const role = cookieStore.get("user_role")?.value;
  return decryptToken(role) === "ADMIN";
};
export const acquirerRole = () => {
  const cookieStore = cookies();
  const role = cookieStore.get("user_role")?.value;
  return decryptToken(role) === "ACQUIRER";
};
export const resellerRole = () => {
  const cookieStore = cookies();
  const role = cookieStore.get("user_role")?.value;
  return decryptToken(role) === "RESELLER";
};
export const subAdminRole = () => {
  const cookieStore = cookies();
  const role = cookieStore.get("user_role")?.value;
  return decryptToken(role) === "SUBADMIN";
};
export const subMerchantRole = () => {
  const cookieStore = cookies();
  const role = cookieStore.get("user_role")?.value;
  return decryptToken(role) === "SUBMERCHANT";
};
export const userEmail = () => {
  const cookieStore = cookies();
  const userId = cookieStore.get("email")?.value;
  return decryptToken(userId);
};
