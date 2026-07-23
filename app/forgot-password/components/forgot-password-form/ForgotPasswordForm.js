"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { endPoints } from "@/app/services/apiEndpoints";
import usePostRequest from "@/app/hooks/usePost";
import styles from "./ForgotPasswordForm.module.css";
import Label from "@/app/ui/label/Label";
import Input from "@/app/ui/input/Input";
import Button from "@/app/ui/button/Button";

export default function ForgotPasswordForm() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
    const otpRefs = Array.from({ length: 6 }, () => useRef(null));

    const [timer, setTimer] = useState(30);

    const combinedOtp = otpDigits.join("");

    const renderError = (err) =>
        typeof err === "string" ? err : err?.message || "Something went wrong";

    const {
        response: otpResponse,
        postData: requestOtp,
        loading: otpLoading,
        error: otpError,
    } = usePostRequest(endPoints.auth.forgotPasswordOtp);

    const {
        response: verifyResponse,
        postData: verifyOtp,
        loading: verifyLoading,
        error: verifyError,
    } = usePostRequest(endPoints.auth.forgotPasswordVerifyOtp);

    useEffect(() => {
        if (otpResponse?.data?.status === "success") {
            setStep(2);
            setTimer(30);
        }
    }, [otpResponse]);

    useEffect(() => {
        if (verifyResponse?.data?.status === "success") {
            setStep(3);
        }
    }, [verifyResponse]);

    useEffect(() => {
        if (step !== 2 || timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [step, timer]);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError("");
        if (!email) return setError("Email is required");
        await requestOtp({ email });
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        if (combinedOtp.length !== 6 || !password) {
            return setError("Enter valid OTP and password");
        }
        await verifyOtp({ email, otp: combinedOtp, password });
    };

    const handleResendOtp = async () => {
        setOtpDigits(Array(6).fill(""));
        setTimer(30);
        await requestOtp({ email });
    };

    const handleOtpChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otpDigits];
        newOtp[index] = value;
        setOtpDigits(newOtp);
        if (value && index < 5) otpRefs[index + 1].current.focus();
    };

    const handleOtpBackspace = (e, index) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            otpRefs[index - 1].current.focus();
        }
    };

    return (
        <div className={styles.formPanel}>
            {step === 1 && (
                <form className={styles.form} onSubmit={handleRequestOtp}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Forgot Password</h2>
                        <p className={styles.subtitle}>Enter your email to receive a one-time password.</p>
                    </div>
                    <div className={styles.fieldGroup}>
                        <Label label="Email Id" htmlFor="email" className="login" />
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                        />
                        {(error || otpError) && (
                            <small className={styles.errorText}>
                                <span className={styles.errorMarker}>*</span>
                                {renderError(error || otpError)}
                            </small>
                        )}
                    </div>
                    <div className={styles.actions}>
                        <Button
                            label={otpLoading ? "Sending OTP..." : "Send OTP"}
                            type="submit"
                            className="login"
                            disabled={otpLoading}
                        />
                    </div>
                    <Link href="/login" className={styles.backLink}>Back to Login</Link>
                </form>
            )}

            {step === 2 && (
                <div className={styles.form}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Verify OTP</h2>
                        <p className={styles.subtitle}>Enter the code sent to your email and set a new password.</p>
                    </div>
                    <div className={styles.otpRow}>
                        {otpDigits.map((digit, index) => (
                            <input
                                key={index}
                                ref={otpRefs[index]}
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                onKeyDown={(e) => handleOtpBackspace(e, index)}
                                className={styles.otpInput}
                            />
                        ))}
                    </div>

                    <div className={styles.fieldGroup}>
                        <Label label="New Password" htmlFor="password" className="login" />
                        <Input
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                        />
                    </div>

                    {(error || verifyError) && (
                        <small className={styles.errorText}>
                            <span className={styles.errorMarker}>*</span>
                            {renderError(error || verifyError)}
                        </small>
                    )}

                    <div className={styles.actions}>
                        <Button
                            label={verifyLoading ? "Resetting..." : "Reset Password"}
                            onClick={handleVerifyOtp}
                            className="login"
                            disabled={verifyLoading}
                        />
                    </div>

                    <div className={styles.resendText}>
                        {timer > 0 ? (
                            <span>Resend OTP in <b>{timer}s</b></span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                className={styles.resendButton}
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className={styles.successPanel}>
                    <div className={styles.successIcon}>✓</div>
                    <h3 className={styles.successTitle}>Password Reset Successful</h3>
                    <Button
                        label="Back to Login"
                        className="login"
                        onClick={() => window.location.href = "/login"}
                    />
                </div>
            )}
        </div>
    );
}
