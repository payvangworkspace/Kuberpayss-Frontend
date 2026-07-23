"use client";
import styles from "./ResetPasswordForm.module.css";
import Label from "@/app/ui/label/Label";
import Input from "@/app/ui/input/Input";
import Button from "@/app/ui/button/Button";
import { deleteToken } from "@/app/services/cookieManager";
import usePost from "@/app/hooks/usePost";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import Link from "next/link";
import { validate } from "@/app/validations/forms/ResetPasswordValidation";
import { errorMsg, successMsg } from "@/app/services/notify";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  let email = emailParam;
  let isExpired = false;

  if (token) {
    const decoded = parseJwt(token);
    if (decoded) {
      if (decoded.sub && !email) {
        email = decoded.sub;
      }
      if (decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          isExpired = true;
        }
      }
    }
  }

  useEffect(() => {
    deleteToken();
  }, []);

  const { postData, loading, error, response } = usePost(
    endPoints.users.setupPassword
  );
  const router = useRouter();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (!token) {
      errorMsg(
        "Invalid reset link. Please check your email for the correct link."
      );
      return;
    }

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = {
      token,
      password: formData.password,
    };

    await postData(data);
  }

  useEffect(() => {
    if (response && !error) {
      if (response.status === "fail") {
        errorMsg(
          response.message ||
          response.data?.message ||
          "Failed to reset password. Please try again."
        );
      } else {
        successMsg(
          response.message ||
          response.data?.message ||
          "Password reset successfully! Redirecting to login..."
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } else if (error) {
      errorMsg("An error occurred. Please try again.");
    }
  }, [response, error, router]);

  return (
    <div className={styles.formPanel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Reset Your Password</h2>
        <p className={styles.subtitle}>Choose a strong password for your merchant account.</p>
      </div>

      {isExpired && (
        <div className={styles.expiredAlert}>
          This link has expired. Please request a new setup password link.
        </div>
      )}

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        style={{ opacity: isExpired ? 0.5 : 1, pointerEvents: isExpired ? "none" : "auto" }}
      >
        <div className={styles.fieldGroup}>
          <Label label="New Password" htmlFor="password" className="login" />
          <Input
            type={showPassword.password ? "text" : "password"}
            placeholder="Enter New Password"
            name="password"
            id="password"
            onChange={handleChange}
            value={formData.password}
          />
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword({
                ...showPassword,
                password: !showPassword.password,
              });
            }}
            className={styles.showPassword}
          >
            {showPassword.password ? "Hide password" : "Show password"}
          </Link>
          {errors.password && (
            <small className={styles.errorText}>
              <span className={styles.errorMarker}>*</span>
              {errors.password}
            </small>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <Label
            label="Confirm Password"
            htmlFor="confirmPassword"
            className="login"
          />
          <Input
            type={showPassword.confirmPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm New Password"
            onChange={handleChange}
            value={formData.confirmPassword}
          />
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword({
                ...showPassword,
                confirmPassword: !showPassword.confirmPassword,
              });
            }}
            className={styles.showPassword}
          >
            {showPassword.confirmPassword ? "Hide password" : "Show password"}
          </Link>
          {errors.confirmPassword && (
            <small className={styles.errorText}>
              <span className={styles.errorMarker}>*</span>
              {errors.confirmPassword}
            </small>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            label={loading ? "Resetting Password..." : "Reset Password"}
            type="submit"
            className="login"
            disabled={loading}
          />
        </div>

        <Link href="/login" className={styles.backLink}>
          Back to Login
        </Link>
      </form>
    </div>
  );
}
