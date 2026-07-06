import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  LoginPayload,
  LoginResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
  SignupPayload,
  SignupResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  VerifyEmailResponse,
} from './types';

// Mutation to initiate login (sends OTP code to email)
export function useLogin() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/auth/login', payload);
      return res.data;
    },
  });
}

// Mutation to verify login OTP
export function useVerifyOtp() {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/auth/login/verify', payload);
      return res.data;
    },
  });
}

// Mutation to register a new tenant account
export function useSignup() {
  return useMutation<SignupResponse, Error, SignupPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/auth/register', payload);
      return res.data;
    },
  });
}

// Mutation to request password reset code
export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/auth/forgot-password', payload);
      return res.data;
    },
  });
}

// Mutation to complete password reset
export function useResetPassword() {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: async (payload) => {
      const res = await api.post('/auth/reset-password', payload);
      return res.data;
    },
  });
}

// Mutation to resend onboarding email verification link
export function useResendVerification() {
  return useMutation<{ isSuccess?: boolean; message?: string }, Error, { email: string }>({
    mutationFn: async (payload) => {
      const res = await api.post('/auth/resend-verification', payload);
      return res.data;
    },
  });
}

// Query to verify email link token
export function useVerifyEmailQuery(token: string, email: string) {
  return useQuery<VerifyEmailResponse, Error>({
    queryKey: ['verify-email', token, email],
    queryFn: async () => {
      const res = await api.get('/auth/verify-email', {
        params: { token },
      });
      return res.data;
    },
    enabled: !!token,
    retry: false,
  });
}
