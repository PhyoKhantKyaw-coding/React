import axios from "axios";
import { UseMutationOptions,useMutation } from "@tanstack/react-query";
export const login = {
  useMutation: (
    opt?: Partial<UseMutationOptions<LoginResponse, Error, LoginPayload>>
  ) => {
    return useMutation<LoginResponse, Error, LoginPayload>({
      mutationFn: async (payload: LoginPayload): Promise<LoginResponse> => {
        const response = await axios.post<LoginResponse>(
          "Authentication/LoginWeb",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      },
      ...opt,
    });
  },
};
export const register = {
  useMutation: (
    opt?: Partial<UseMutationOptions<RegisterResponse, Error, RegisterPayload>>
  ) => {
    return useMutation<RegisterResponse, Error, RegisterPayload>({
      mutationFn: async (payload: RegisterPayload): Promise<RegisterResponse> => {
        const response = await axios.post<RegisterResponse>(
          "User/create",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      },
      ...opt,
    });
  },
};

export const verifyOtp = {
  useMutation: (
    opt?: Partial<UseMutationOptions<RegisterResponse, Error, OtpVerifyPayload>>
  ) => {
    return useMutation<RegisterResponse, Error, OtpVerifyPayload>({
      mutationFn: async (payload: OtpVerifyPayload): Promise<RegisterResponse> => {
        const response = await axios.post<RegisterResponse>(
          "User/verify-email",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      },
      ...opt,
    });
  },
};
// In your API file (e.g., src/api/index.ts)
export const resendOtp = {
  useMutation: (
    opt?: Partial<UseMutationOptions<RegisterResponse, Error, string>>
  ) => {
    return useMutation<RegisterResponse, Error, string>({
      mutationFn: async (payload: string): Promise<RegisterResponse> => {
        const response = await axios.post<RegisterResponse>(
          "User/ResentOTP", // Full endpoint path
          { email: payload }, // Send as JSON object
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      },
      ...opt,
    });
  },
};