export interface LoginPayload {
  email: string;
  password?: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  message?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  isSuccess: boolean;
  message?: string;
  token?: string;
  user?: {
    email: string;
    [key: string]: any;
  };
  data?: {
    token?: string;
    user?: {
      email: string;
      [key: string]: any;
    };
  };
}

export interface SignupPayload {
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface SignupResponse {
  isSuccess: boolean;
  message?: string;
  data?: any;
}

export interface VerifyEmailResponse {
  isSuccess: boolean;
  message?: string;
  token?: string;
  user?: any;
  data?: {
    token?: string;
    user?: any;
  };
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  isSuccess: boolean;
  message?: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ResetPasswordResponse {
  isSuccess: boolean;
  message?: string;
}
