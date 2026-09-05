export type AuthChannel = "phone" | "email";

export type SendCodeInput = {
  channel: AuthChannel;
  destination: string;
};

export type VerifyCodeInput = {
  channel: AuthChannel;
  destination: string;
  code: string;
};

export type ForgotPasswordInput = {
  channel: AuthChannel;
  destination: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  dateOfBirth: string;
  nationality: string;
  phone: string;
  phoneCountry: string;
  email: string;
  password: string;
};

export type LoginEmailInput = {
  email: string;
  password: string;
};

const MOCK_DELAY_MS = 650;

function wait(ms = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Mock: any non-empty destination succeeds. */
export async function sendLoginCode(input: SendCodeInput): Promise<void> {
  await wait();
  if (!input.destination.trim()) {
    throw new Error("invalidDestination");
  }
}

/** Mock: email + password always succeeds when both present. */
export async function loginWithEmail(input: LoginEmailInput): Promise<void> {
  await wait();
  if (!input.email.trim() || !input.password) {
    throw new Error("invalidCredentials");
  }
}

/** Mock: register always succeeds when payload is present. */
export async function registerTourist(input: RegisterInput): Promise<void> {
  await wait();
  if (!input.email.trim() || !input.phone.trim() || !input.name.trim()) {
    throw new Error("invalidRegister");
  }
}

/** Mock: any 6-digit code succeeds. */
export async function verifyOtpCode(input: VerifyCodeInput): Promise<void> {
  await wait();
  if (!/^\d{6}$/.test(input.code.trim())) {
    throw new Error("invalidOtp");
  }
}

/** Mock: issues a reset token string. */
export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<{ token: string }> {
  await wait();
  if (!input.destination.trim()) {
    throw new Error("invalidDestination");
  }
  return { token: "mock-reset-token" };
}

/** Mock: any token + password succeeds. */
export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  await wait();
  if (!input.token.trim() || input.password.length < 8) {
    throw new Error("invalidReset");
  }
}

export function maskDestination(channel: AuthChannel, destination: string): string {
  const value = destination.trim();
  if (channel === "email") {
    const at = value.indexOf("@");
    if (at <= 1) {
      return value;
    }
    return `${value.slice(0, 1)}•••${value.slice(at)}`;
  }
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) {
    return value;
  }
  return `••• ${digits.slice(-3)}`;
}
