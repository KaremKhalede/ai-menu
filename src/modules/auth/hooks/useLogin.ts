import { useState } from "react";
import { authService } from "../services/auth.service";
import { LoginCredentials } from "../types/auth.types";

export function useLogin() {
  const [loading, setLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);

    try {
      return await authService.login(credentials);
    } finally {
      setLoading(false);
    }
  };

  const loginWithPhone = async (phone: string) => {
    setLoading(true);

    try {
      return await authService.loginWithPhone(phone);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    setLoading(true);

    try {
      return await authService.verifyOtp(phone, otp);
    } finally {
      setLoading(false);
    }
  };

  const sendMagicLink = async (email: string) => {
    console.log("useLogin: before");

    setLoading(true);

    try {
      const result = await authService.sendMagicLink(email);

      console.log("useLogin: after", result);

      return result;
    } catch (e) {
      console.error("useLogin error:", e);
      throw e;
    } finally {
      console.log("useLogin: finally");
      setLoading(false);
    }
  };

  return {
    loading,
    login,
    loginWithPhone,
    verifyOtp,
    sendMagicLink,
  };
}