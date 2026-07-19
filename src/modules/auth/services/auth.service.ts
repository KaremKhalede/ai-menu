import { apiClient } from "@/core/http/api-client";
import { LoginCredentials } from "../types/auth.types";
import type { User } from "@/lib/types";
import { demoUser } from "./auth.mock";

export class AuthService {
  async login(credentials: LoginCredentials) {
    console.log("Login", credentials);
     // Future:
     // return apiClient.post<LoginResponse>("/auth/login", credentials);
    return {
      success: true,
      user: demoUser,
    };
  }

  async loginWithPhone(phone: string) {
    console.log("Phone:", phone);
     // Future:
     // return apiClient.post<LoginResponse>("/auth/login", credentials);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
      success: true,
    };
  }

  async verifyOtp(phone: string, otp: string): Promise<User> {
    console.log(phone, otp);
     // Future:
     // return apiClient.post<LoginResponse>("/auth/login", credentials);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return demoUser;
  }

  async sendMagicLink(email: string) {
    console.log(email);
     // Future:
     // return apiClient.post<LoginResponse>("/auth/login", credentials);
    return {
      success: true,
    };
  }

  async logout() {
    return {
      success: true,
    };
  }
}

export const authService = new AuthService();