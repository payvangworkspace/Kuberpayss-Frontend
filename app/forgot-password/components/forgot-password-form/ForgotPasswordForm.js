"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { endPoints } from "@/app/services/apiEndpoints";
import usePostRequest from "@/app/hooks/usePost";
import styles from "./ForgotPasswordForm.module.css";
import Label from "@/app/ui/label/Label";
import Input from "@/app/ui/input/Input";
import Title from "@/app/ui/headings/Title";
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

    /* REQUEST OTP */
    const {
        response: otpResponse,
        postData: requestOtp,
        loading: otpLoading,
        error: otpError,
    } = usePostRequest(endPoints.auth.forgotPasswordOtp);

    /* VERIFY OTP */
    const {
        response: verifyResponse,
        postData: verifyOtp,
        loading: verifyLoading,
        error: verifyError,
    } = usePostRequest(endPoints.auth.forgotPasswordVerifyOtp);

    /* STEP CHANGE: OTP SUCCESS */
    useEffect(() => {
        if (otpResponse?.data?.status === "success") {
            setStep(2);
            setTimer(30);
        }
    }, [otpResponse]);

    /* STEP CHANGE: VERIFY SUCCESS */
    useEffect(() => {
        if (verifyResponse?.data?.status === "success") {
            setStep(3);
        }
    }, [verifyResponse]);

    /* TIMER (ONLY ONE) */
    useEffect(() => {
        if (step !== 2 || timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [step, timer]);

    /* HANDLERS */
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
        <div className={styles.login}>
            {step === 1 && (
                <form onSubmit={handleRequestOtp} style={{ width: "100%" }}>
                    <Title label="Forgot Password" className="login" />
                    <hr />
                    <div className="row mb-3">
                        <Label label="Email Id" htmlFor="email" className="login" />
                        <div className="col-12">
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                            />
                        </div>
                        {(error || otpError) && (
                            <small className="text-white">
                                <span className="text-danger"> *</span>
                                {renderError(error || otpError)}
                            </small>
                        )}
                    </div>
                    <Button
                        label={otpLoading ? "Sending OTP..." : "Send OTP"}
                        type="submit"
                        className="login"
                        disabled={otpLoading}
                    />
                    <div className="mt-3 text-center">
                        <Link href="/login" className="text-white text-decoration-none small">Back to Login</Link>
                    </div>
                </form>
            )}

            {step === 2 && (
                <div style={{ width: "100%" }}>
                    <Title label="Verify OTP" className="login" />
                    <hr />
                    <div className="mb-3">
                        <div className="d-flex justify-content-between gap-2 mb-2">
                            {otpDigits.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={otpRefs[index]}
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                    onKeyDown={(e) => handleOtpBackspace(e, index)}
                                    className="form-control text-center"
                                    style={{ width: "40px", height: "40px", fontSize: "1.2rem", padding: "5px" }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <Label label="New Password" htmlFor="password" className="login" />
                        <div className="col-12">
                            <Input
                                type="password"
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                            />
                        </div>
                    </div>

                    {(error || verifyError) && (
                        <small className="text-white mb-2 d-block">
                            <span className="text-danger"> *</span>
                            {renderError(error || verifyError)}
                        </small>
                    )}

                    <Button
                        label={verifyLoading ? "Resetting..." : "Reset Password"}
                        onClick={handleVerifyOtp}
                        className="login"
                        disabled={verifyLoading}
                    />

                    <div className="mt-3 text-center">
                        {timer > 0 ? (
                            <span className="text-white small">Resend OTP in <b>{timer}s</b></span>
                        ) : (
                            <button
                                onClick={handleResendOtp}
                                className="btn btn-link text-white text-decoration-none small p-0"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="text-center text-white">
                    <Title label="Success" className="login" />
                    <hr />
                    <div className="text-success fs-1 mb-2">✓</div>
                    <h3 className="h5 mb-3">
                        Password Reset Successful
                    </h3>
                    <Link
                        href="/login"
                        className="btn btn-success text-white"
                        style={{ textDecoration: 'none' }}
                    >
                        Back to Login
                    </Link>
                </div>
            )}
        </div>
    );
}
