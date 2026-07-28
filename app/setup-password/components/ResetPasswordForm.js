"use client";
import styles from "./ResetPasswordForm.module.css";
import Label from "@/app/ui/label/Label";
import Input from "@/app/ui/input/Input";
import Title from "@/app/ui/headings/Title";
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

  // Clear auth token to prevent interference
  useEffect(() => {
    deleteToken();
  }, []);

  // Use POST as PUT returned 403
  const { postData, loading, error, response } = usePost(
    endPoints.users.setupPassword
  );
  const router = useRouter();

  // form json state data
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // State to handle errors on form submission
  const [errors, setErrors] = useState({});

  // State to handle password visibility
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  // handle input change
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
    <div className={styles.resetPassword}>
      <Title label="Reset Your Password" className="login" />
      <hr />
      {isExpired && (
        <div className="alert alert-danger text-center m-3 p-2" style={{ color: 'red', fontWeight: 'bold' }}>
          This link has expired. Please request a new setup password link.
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ opacity: isExpired ? 0.5 : 1, pointerEvents: isExpired ? 'none' : 'auto' }}>
        <div className="row mb-3">
          <Label label="New Password" htmlFor="password" className="login" />
          <div className="col-12">
            <Input
              type={showPassword.password ? "text" : "password"}
              placeholder="Enter New Password"
              name="password"
              id="password"
              onChange={handleChange}
              value={formData.password}
            />
          </div>
          <div className="col-12 mt-1">
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
          </div>
          {errors.password && (
            <small className="text-white">
              <span className="text-danger"> *</span>
              {errors.password}
            </small>
          )}
        </div>
        <div className="row mb-4">
          <Label
            label="Confirm Password"
            htmlFor="confirmPassword"
            className="login"
          />
          <div className="col-12">
            <Input
              type={showPassword.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm New Password"
              onChange={handleChange}
              value={formData.confirmPassword}
            />
          </div>
          <div className="col-12 mt-1">
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
          </div>
          {errors.confirmPassword && (
            <small className="text-white">
              <span className="text-danger"> *</span>
              {errors.confirmPassword}
            </small>
          )}
        </div>
        <Button
          label={loading ? "Resetting Password..." : "Reset Password"}
          type="submit"
          className="login"
          disabled={loading}
        />
        <div className="mt-3 text-center">
          <Link href="/login" className={styles.backToLogin}>
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
