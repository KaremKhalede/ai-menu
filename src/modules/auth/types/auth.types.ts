import type { User } from "@/lib/types";


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PhoneLoginCredentials {
  phone: string;
}

export interface OtpVerification {
  phone: string;
  code: string;
}



export interface AuthSession {
  user: User  | null;
  isAuthenticated: boolean;
}