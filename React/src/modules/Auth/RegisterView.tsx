import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openLoader, hideLoader } from "@/store/features/loaderSlice";
import api from "@/api";
import Loader from "@/components/Loader";
import { z } from "zod";

// Define Zod schema for registration form
const RegisterSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(50, "Username must be less than 50 characters"),
    email: z.string().email("Valid email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password must be less than 100 characters"),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Valid phone number is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const OtpSchema = z.string().min(6, "OTP must be at least 6 characters").max(6, "OTP must be 6 characters");

type RegisterFormData = z.infer<typeof RegisterSchema>;

const RegisterView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  const {
    mutate: registerMutate,
    isPending: isRegisterPending,
  } = api.login.register.useMutation({
    onSuccess: (data) => {
      console.log("Register API Response:", data);
      if (data.status === 0 && data.message !== "User already exists. Register Failed") {
        console.log("Email after registration:", formData.email);
        setOtpDialogOpen(true);
        setError(null);
        setFormErrors({});
        setFormData({
          username: "",
          email: formData.email,
          password: "",
          confirmPassword: "",
          phoneNumber: "",
        });
      } else {
        setError(data.message || "Registration failed");
      }
    },
    onError: (error) => {
      console.error("Register Error:", error);
      setError(error?.message || "Registration failed");
    },
  });

  const {
    mutate: verifyOtpMutate,
    isPending: isVerifyOtpPending,
  } = api.login.verifyOtp.useMutation({
    onSuccess: (data) => {
      console.log("Verify OTP Response:", data);
      if (data.status === 0 && data.message === "Email verified successfully.") {
        setOtpDialogOpen(false);
        navigate("/auth/login");
      } else {
        setOtpError(data.message || "OTP verification failed");
      }
    },
    onError: (error) => {
      console.error("Verify OTP Error:", error);
      const apiError = error as { errors?: { email?: string[] }, message?: string };
      const errorMessage =
        apiError?.errors?.email?.[0] ||
        apiError?.message ||
        "OTP verification failed";
      setOtpError(errorMessage);
    },
  });

  const {
    mutate: resendOtpMutate,
    isPending: isResendOtpPending,
  } = api.login.resendOtp.useMutation({
    onSuccess: (data) => {
      console.log("Resend OTP Response:", data);
      if (data.message === "New OTP sent to email.") {
        setOtpError(null);
      } else {
        setOtpError(data.message || "Failed to resend OTP");
      }
    },
    onError: (error) => {
      console.error("Resend OTP Error:", {
        message: error?.message,
      });
      const apiError = error as { errors?: { email?: string[] }, message?: string };
      const errorMessage =
        apiError?.errors?.email?.[0] ||
        apiError?.message ||
        "Failed to resend OTP";
      setOtpError(errorMessage);
    },
  });

  useEffect(() => {
    console.log("Loader State:", { isRegisterPending, isVerifyOtpPending, isResendOtpPending });
    if (isRegisterPending || isVerifyOtpPending || isResendOtpPending) {
      dispatch(openLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [isRegisterPending, isVerifyOtpPending, isResendOtpPending, dispatch]);

  useEffect(() => {
    console.log("otpDialogOpen:", otpDialogOpen, "Email:", formData.email);
  }, [otpDialogOpen, formData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "email" ? value.trim() : value,
    }));
    // Clear error for the field being edited
    setFormErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});

    const result = RegisterSchema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const formattedErrors: Record<string, string> = {};
      Object.entries(errors).forEach(([key, value]) => {
        formattedErrors[key] = value?.[0] || "";
      });
      setFormErrors(formattedErrors);
      return;
    }

    console.log("Submitting registration with email:", formData.email);
    registerMutate({
      name: formData.username,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
    });
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOtpError(null);

    const result = OtpSchema.safeParse(otp);

    if (!result.success) {
      setOtpError(result.error.flatten().formErrors[0] || "Invalid OTP");
      return;
    }

    if (!formData.email) {
      setOtpError("Email is required to verify OTP");
      return;
    }

    console.log("Verifying OTP with email:", formData.email, "and OTP:", otp);
    verifyOtpMutate({
      email: formData.email,
      otp,
    });
  };

  const handleResendOtp = () => {
    setOtpError(null);
    if (!formData.email) {
      setOtpError("Email is required to resend OTP");
      return;
    }
    console.log("Resending OTP with payload:", formData.email, "to endpoint: /api/v1/User/ResentOTP");
    resendOtpMutate(formData.email);
  };

  return (
    <div className="flex justify-center items-center min-h-screen min-w-full">
      <div className="relative bg-gradient-to-r from-blue-400 to-green-400 shadow-xl rounded-2xl w-full max-w-md p-8 space-y-6 z-10">
        {(isRegisterPending || isVerifyOtpPending || isResendOtpPending) && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl z-20">
            <Loader />
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Create an Account
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-4 text-gray-900 text-lg" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
            {formErrors.username && (
              <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block mb-1">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
            {formErrors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-200"
            disabled={isRegisterPending}
          >
            {isRegisterPending ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="flex justify-between">
          <button
            onClick={() => navigate("/Auth/login")}
            className="text-gray-900 hover:underline"
          >
            Already have an account? Login
          </button>
        </div>
      </div>

      {otpDialogOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="otp-dialog-title"
        >
          <div className="relative bg-white rounded-lg p-6 w-full max-w-sm">
            {(isVerifyOtpPending || isResendOtpPending) && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-20">
                <Loader />
              </div>
            )}
            <h3
              id="otp-dialog-title"
              className="text-xl font-bold text-gray-800 text-center mb-4"
            >
              Verify OTP
            </h3>
            {otpError && (
              <p className="text-red-500 text-center mb-4">{otpError}</p>
            )}
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block mb-1">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                  disabled={isResendOtpPending}
                >
                  {isResendOtpPending ? "Resending..." : "Resend OTP"}
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-200"
                  disabled={isVerifyOtpPending}
                >
                  {isVerifyOtpPending ? "Verifying..." : "OK"}
                </button>
              </div>
            </form>
            <p className="text-gray-600 text-center mt-4">
              If you didn’t receive the OTP, try resending or contact support at support@example.com.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterView;