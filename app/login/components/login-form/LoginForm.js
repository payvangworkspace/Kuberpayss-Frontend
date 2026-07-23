"use client";
import styles from "./LoginForm.module.css";
import Label from "@/app/ui/label/Label";
import Input from "@/app/ui/input/Input";
import Button from "@/app/ui/button/Button";
import usePost from "@/app/hooks/usePost";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { login, loginFail } from "@/app/utils/message";
import { endPoints } from "@/app/services/apiEndpoints";
import { validate } from "@/app/validations/forms/LoginFormValidations";
import { generateToken } from "@/app/formBuilder/auth";
import { saveAuthToken } from "@/app/services/cookieManager";
import { errorMsg, successMsg } from "@/app/services/notify";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/images/kuberPay_logo.png";

export default function LoginForm() {
  const { postData, loading, error, response } = usePost(endPoints.auth.login);
  const router = useRouter();
  const [formData, setFormData] = useState(generateToken);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(formData);
    await postData(formData);
  }

  useEffect(() => {
    if (response?.data && !error) {
      if (response.status === "fail") {
        errorMsg(loginFail);
      } else {
        const setCookie = saveAuthToken(
          response.data.token,
          response.data.userRole,
          response.data.email,
          response.data.fullName
        );
        if (setCookie) {
          router.push("/home");
          successMsg(login);
        }
      }
    }
  }, [response, error, router]);

  return (
    <div className={styles.formPanel}>
      <div className={`${styles.logoWrapper} ${styles.mobileLogo}`}>
        <Image
          src={logo}
          alt="Kuber Payss Logo"
          width={240}
          height={110}
          className={styles.logo}
          priority
        />
      </div>

      <div className={styles.header}>
        <p className={styles.eyebrow}>Welcome back</p>
        <h2 className={styles.title}>Secure Payments</h2>
        <p className={styles.subtitle}>
          Sign in to access your merchant dashboard instantly.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <Label label="Email Id" htmlFor="username" className="login" />
          <Input
            type="text"
            placeholder="Enter Email/Username"
            name="userName"
            id="username"
            onChange={handleChange}
          />
          {errors.email && (
            <small className={styles.errorText}>
              <span className={styles.errorMarker}>*</span>
              {errors.email}
            </small>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <Label label="Password" htmlFor="password" className="login" />
          <div className={styles.passwordField}>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter Password"
              onChange={handleChange}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              className={styles.eyeButton}
            >
              {showPassword ? (
                <i className="bi bi-eye-slash" aria-hidden="true" />
              ) : (
                <i className="bi bi-eye" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <small className={styles.errorText}>
              <span className={styles.errorMarker}>*</span>
              {errors.password}
            </small>
          )}
          <Link href="/forgot-password" className={styles.forgotLink}>
            Forgot Password?
          </Link>
        </div>

        <div className={styles.actions}>
          <Button
            label={loading ? "Logging In..." : "Continue"}
            type="submit"
            className="login"
            disabled={loading}
          />
          <p className={styles.signupPrompt}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className={styles.signupLink}>
              Signup
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
