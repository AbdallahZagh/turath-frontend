"use client";

import {
  useMutation,
  type UseMutationResult,
} from "@tanstack/react-query";

import {
  loginWithEmail,
  registerProvider,
  registerTourist,
  requestPasswordReset,
  resetPassword,
  sendLoginCode,
  verifyOtpCode,
  type ForgotPasswordInput,
  type LoginEmailInput,
  type ProviderRegisterInput,
  type RegisterInput,
  type ResetPasswordInput,
  type SendCodeInput,
  type VerifyCodeInput,
} from "@/services/auth";

export function useSendLoginCode(): UseMutationResult<void, Error, SendCodeInput> {
  return useMutation({ mutationFn: sendLoginCode });
}

export function useLoginWithEmail(): UseMutationResult<void, Error, LoginEmailInput> {
  return useMutation({ mutationFn: loginWithEmail });
}

export function useRegisterTourist(): UseMutationResult<void, Error, RegisterInput> {
  return useMutation({ mutationFn: registerTourist });
}

export function useRegisterProvider(): UseMutationResult<
  void,
  Error,
  ProviderRegisterInput
> {
  return useMutation({ mutationFn: registerProvider });
}

export function useVerifyOtp(): UseMutationResult<void, Error, VerifyCodeInput> {
  return useMutation({ mutationFn: verifyOtpCode });
}

export function useRequestPasswordReset(): UseMutationResult<
  { token: string },
  Error,
  ForgotPasswordInput
> {
  return useMutation({ mutationFn: requestPasswordReset });
}

export function useResetPassword(): UseMutationResult<void, Error, ResetPasswordInput> {
  return useMutation({ mutationFn: resetPassword });
}
