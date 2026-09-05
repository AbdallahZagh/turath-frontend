import type { FieldError } from "react-hook-form";

export const AUTH_ERROR_KEYS = [
  "emailRequired",
  "emailInvalid",
  "passwordRequired",
  "passwordMin",
  "phoneRequired",
  "phoneInvalid",
  "nameRequired",
  "dateOfBirthRequired",
  "nationalityRequired",
  "termsRequired",
  "otpInvalid",
  "confirmRequired",
  "passwordMismatch",
  "businessNameEnRequired",
  "businessNameArRequired",
  "categoryRequired",
  "governorateRequired",
  "ownerNameRequired",
] as const;

export type AuthErrorKey = (typeof AUTH_ERROR_KEYS)[number];

function isAuthErrorKey(value: string): value is AuthErrorKey {
  return (AUTH_ERROR_KEYS as readonly string[]).includes(value);
}

/** Maps zod issue message keys (e.g. emailRequired) to auth.errors.* copy. */
export function fieldMessage(
  tErrors: (key: AuthErrorKey) => string,
  error: FieldError | undefined,
): string | undefined {
  if (!error?.message) {
    return undefined;
  }
  if (!isAuthErrorKey(error.message)) {
    return error.message;
  }
  return tErrors(error.message);
}
