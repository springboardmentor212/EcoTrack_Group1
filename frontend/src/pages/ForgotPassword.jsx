import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flower, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email: cleanEmail },
      );
      toast.success(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key == "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        { email: cleanEmail, otp: otpString },
      );
      toast.success(res.data.message || "OTP verified");
      setStep(3);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        { email: cleanEmail, otp: otp.join(""), newPassword },
      );
      toast.success(res.data.message || "Password reset successful");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setOtp(["", "", "", "", "", ""]);
      setStep(1);
      return;
    }
    if (step === 3) {
      navigate("/login");
      return;
    }
  };

  const handleResendOtp = async () => {
    const cleanEmail = email.trim().toLowerCase();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email: cleanEmail },
      );
      toast.success(res.data.message || "OTP resent to your email");
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-eco)]">
            <Flower size={18} color="#FFFFFF" />
          </div>
          <span className="text-lg font-semiBold text-[var(--color-primary)]">
            EcoTrack
          </span>
        </div>
      </header>

      <main className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm rounded-2xl bg-[var(--color-surface)] p-8 shadow-[0_10px_25px_-5px_var(--color-primary)]">
          {step === 1 ? (
            <Link
              to="/login"
              className="flex items-center gap-1 text-sm font-medium text-[var(--color-secondary)]"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-sm font-medium text-[var(--color-secondary)]"
            >
              <ArrowLeft size={16} />
              {step === 1 ? "Back to Login" : "Back"}
            </button>
          )}

          {step === 1 && (
            <>
              <h1 className="mt-4 text-xl font-semibold text-[var(--color-primary)]">
                Forgot Password?
              </h1>
              <p className="mt-1 text-sm text-[var(--color-slate)]">
                Enter your registered email address to recieve a 6-digit
                verification code.
              </p>

              <form
                onSubmit={handleSendOtp}
                className="mt-6 flex flex-col gap-4"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-[var(--color-muted)]"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-slate)] px-3 py-2 text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer mt-1 w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition-transform duration-150 hover:bg-[#1E293B] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Please wait
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="mt-4 text-xl font-semibold text-[var(--color-primary)]">
                Enter Verification Code
              </h1>
              <p className="mt-1 text-sm text-[var(--color-slate)]">
                We sent a 6-digit code to your email address.
              </p>

              <form
                onSubmit={handleVerifyOtp}
                className="mt-6 flex flex-col gap-4"
              >
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className="w-12 h-12 text-center text-lg rounded-lg border border-[var(--color-slate)] outline-none"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer mt-1 w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition-transform duration-150 hover:bg-[#1E293B] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Please wait
                    </span>
                  ) : (
                    "Verify & Proceed"
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-sm">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="font-medium text-[var(--color-secondary)]"
                >
                  Resend OTP
                </button>
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <h1 classNamw="mt-4 text-xl font-semibold text-[var(--color-primary)]">
                Reset Password
              </h1>
              <p className="mt-1 text-sm text-[var(--color-slate)]">
                Your new Password must be at least 8 characters long.
              </p>

              <form
                onSubmit={handleResetPassword}
                className="mt-6 flex flex-col gap-4"
              >
                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-1 block text-sm font-medium text-[var(--color-muted)]"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-slate)] px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1 block text-sm font-medium text-[var(--color-muted)]"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-slate)] px-3 py-2 text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer mt-1 w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition-transform duration-150 hover:bg-[#1E293B] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 size={16} className="animate-spin" />
                      Please wait
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
