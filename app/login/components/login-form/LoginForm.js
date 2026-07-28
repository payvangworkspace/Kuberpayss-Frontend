"use client";
import styles from "./LoginForm.module.css";
import Label from "@/app/ui/label/Label";
import Input from "@/app/ui/input/Input";
import Title from "@/app/ui/headings/Title";
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
export default function LoginForm() {
  const { postData, loading, error, response } = usePost(endPoints.auth.login);
  const router = useRouter();
  // form json state data
  const [formData, setFormData] = useState(generateToken);
  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(formData);
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }
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
  }, [response, error]);

  return (
    <div className={styles.login}>
      <Title label="Login to your Account" className="login" />
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <Label label="Email Id" htmlFor="username" className="login" />
          <div className="col-12">
            <Input
              type="text"
              placeholder="Enter Email/Username "
              name="userName"
              id="username"
              onChange={handleChange}
            />
          </div>
          {errors.email && (
            <small className="text-white">
              <span className="text-danger"> *</span>
              {errors.email}
            </small>
          )}
        </div>
        <div className="row mb-4">
          <Label label="Password" htmlFor="password" className="login" />
          <div className="col-12">
            <div className="position-relative">
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
                className={"btn btn-link p-0 ms-2"}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "black",
                }}
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash" aria-hidden="true" />
                ) : (
                  <i className="bi bi-eye" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <small className="text-white">
                <span className="text-danger"> *</span>
                {errors.password}
              </small>
            )}
            <div className="d-flex justify-content-end mt-1">
              <Link
                href="/forgot-password"
                className="text-decoration-none small"
                style={{ color: "white" }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>{" "}
        </div>

        <Button
          label={loading ? "Logging In..." : "Continue"}
          type="submit"
          className="login"
          disabled={loading}
        />
      </form>
      {/* <hr />
      <p>
        Unable to login to Payment Gateway? <Link href="">Clear here</Link>
        <br />
        For business account of your shop/store, Watch{" "}
        <Link href="">Video</Link>
      </p> */}
    </div>
  );
}
