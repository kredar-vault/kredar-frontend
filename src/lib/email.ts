'use client';

import { toast } from 'sonner';

/**
 * Client-side mock email sender that saves OTPs to localStorage
 * so that our verification and password reset pages can fetch them.
 * Also prints the email content to console and shows a user-facing toast notification.
 */
export async function sendVerificationEmail(email: string, code: string) {
  console.log(`[Mock Email] Sending Verification OTP to ${email}: ${code}`);

  // Store the active code in localStorage for verification
  localStorage.setItem(`otp_verify_${email}`, code);

  // Show toast notification with the code so the user knows what to enter immediately
  toast.success(`Verification email sent! OTP Code: ${code}`, {
    duration: 10000,
    description: `A mock verification email has been simulated.`,
  });
}

export async function sendPasswordResetEmail(email: string, code: string) {
  console.log(`[Mock Email] Sending Password Reset Code to ${email}: ${code}`);

  // Store reset code in localStorage
  localStorage.setItem(`otp_reset_${email}`, code);

  // Show toast notification
  toast.success(`Reset code sent! Code: ${code}`, {
    duration: 10000,
    description: `A mock password reset email has been simulated.`,
  });
}
