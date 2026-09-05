import type { ReactNode } from "react";

type AuthFieldErrorProps = {
  message?: string;
};

export function AuthFieldError({ message }: AuthFieldErrorProps): ReactNode {
  if (!message) {
    return null;
  }
  return <p className="text-destructive text-xs leading-snug">{message}</p>;
}
