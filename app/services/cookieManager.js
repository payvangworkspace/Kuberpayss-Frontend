import { errorMsg } from "@/app/services/notify";
import { encryptToken } from "../utils/encryptToken";
import Cookies from "js-cookie";

export const saveAuthToken = (
  token = "",
  userRole = "",
  email = "",
  fullName = ""
) => {
  try {
    const encryptedToken = encryptToken(token);
    const encryptedRole = encryptToken(userRole);
    const encryptedEmail = encryptToken(email);
    const encryptedFullName = encryptToken(fullName);
    Cookies.set("auth_token", encryptedToken, {
      expires: process.env.NEXT_PUBLIC_EXP_TIME / 24,
      secure: process.env.NEXT_PUBLIC_SECURE_COOKIE,
      sameSite: process.env.NEXT_PUBLIC_STRICT_TYPE,
    });
    Cookies.set("user_role", encryptedRole, {
      expires: process.env.NEXT_PUBLIC_EXP_TIME / 24,
      secure: process.env.NEXT_PUBLIC_SECURE_COOKIE,
      sameSite: process.env.NEXT_PUBLIC_STRICT_TYPE,
    });
    Cookies.set("fullName", encryptedFullName, {
      expires: process.env.NEXT_PUBLIC_EXP_TIME / 24,
      secure: process.env.NEXT_PUBLIC_SECURE_COOKIE,
      sameSite: process.env.NEXT_PUBLIC_STRICT_TYPE,
    });
    Cookies.set("email", encryptedEmail, {
      expires: process.env.NEXT_PUBLIC_EXP_TIME / 24,
      secure: process.env.NEXT_PUBLIC_SECURE_COOKIE,
      sameSite: process.env.NEXT_PUBLIC_STRICT_TYPE,
    });
    return true;
  } catch (error) {
    errorMsg("Failed to login! Please try again after some time");
    return false;
  }
};

export const deleteToken = async () => {
  try {
    const cookies = Cookies.get(); // Get all cookies
    Object.keys(cookies).forEach((cookieName) => {
      Cookies.remove(cookieName); // Remove each cookie
    });

    // Cookies.remove("email");
    // Cookies.remove("user_role");
    // Cookies.remove("fullName");
    // Cookies.remove("auth_token");
    return true;
  } catch (error) {
    return false;
  }
};
