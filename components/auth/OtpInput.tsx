"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import {
  FIELD_GROUP_MAIN,
  FIELD_STACK_LABEL,
  FIELD_VARIANT,
} from "@/components/ui/controlClasses";
import { cn } from "@/lib/cn";

const OTP_LENGTH = 6;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
  "aria-invalid"?: boolean;
};

function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, OTP_LENGTH);
}

export function OtpInput({
  value,
  onChange,
  label,
  disabled = false,
  autoFocus = true,
  name,
  "aria-invalid": ariaInvalid,
}: OtpInputProps): ReactNode {
  const baseId = useId();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = digitsOnly(value).padEnd(OTP_LENGTH, " ").slice(0, OTP_LENGTH).split("");

  const focusIndex = useCallback((index: number) => {
    const el = inputsRef.current[index];
    if (el) {
      el.focus();
      el.select();
    }
  }, []);

  useEffect(() => {
    if (!autoFocus || disabled) {
      return;
    }
    focusIndex(0);
  }, [autoFocus, disabled, focusIndex]);

  function setDigitAt(index: number, digit: string): void {
    const next = digitsOnly(value).split("");
    while (next.length < OTP_LENGTH) {
      next.push("");
    }
    next[index] = digit;
    onChange(next.join("").slice(0, OTP_LENGTH));
  }

  function handleChange(index: number, raw: string): void {
    const cleaned = digitsOnly(raw);
    if (cleaned.length === 0) {
      setDigitAt(index, "");
      return;
    }
    if (cleaned.length > 1) {
      const next = digitsOnly(value).split("");
      while (next.length < OTP_LENGTH) {
        next.push("");
      }
      for (let i = 0; i < cleaned.length && index + i < OTP_LENGTH; i += 1) {
        next[index + i] = cleaned[i] ?? "";
      }
      onChange(next.join("").slice(0, OTP_LENGTH));
      focusIndex(Math.min(index + cleaned.length, OTP_LENGTH - 1));
      return;
    }
    setDigitAt(index, cleaned);
    if (index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Backspace") {
      const current = digitsOnly(value);
      if (!current[index] && index > 0) {
        event.preventDefault();
        setDigitAt(index - 1, "");
        focusIndex(index - 1);
      }
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusIndex(Math.max(index - 1, 0));
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusIndex(Math.min(index + 1, OTP_LENGTH - 1));
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>): void {
    event.preventDefault();
    const pasted = digitsOnly(event.clipboardData.getData("text"));
    if (!pasted) {
      return;
    }
    onChange(pasted);
    focusIndex(Math.min(pasted.length, OTP_LENGTH) - 1);
  }

  return (
    <div className={FIELD_GROUP_MAIN}>
      <div
        dir="ltr"
        className="z-[5] flex w-full min-w-0 items-stretch justify-between gap-1.5 overflow-x-clip sm:gap-2.5"
        role="group"
        aria-label={label}
      >
        {Array.from({ length: OTP_LENGTH }, (_, index) => {
          const digit = digits[index]?.trim() ?? "";
          const inputId = `${baseId}-otp-${index}`;
          return (
            <input
              key={inputId}
              ref={(node) => {
                inputsRef.current[index] = node;
              }}
              id={inputId}
              name={index === 0 ? name : undefined}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              disabled={disabled}
              aria-invalid={ariaInvalid}
              aria-label={label ? `${label} ${index + 1}` : undefined}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              onFocus={(event) => event.currentTarget.select()}
              className={cn(
                FIELD_VARIANT.main,
                "box-border aspect-square min-h-11 min-w-0 w-full max-w-14 flex-1 basis-0 rounded-[0.75rem] px-0 py-0 text-center text-xl font-semibold tracking-tight caret-primary sm:min-h-14 sm:text-2xl",
                "shadow-[inset_0_1px_0_var(--glass-highlight)] dark:shadow-none",
              )}
            />
          );
        })}
      </div>
      {label ? (
        <label className={FIELD_STACK_LABEL} htmlFor={`${baseId}-otp-0`}>
          {label}
        </label>
      ) : null}
    </div>
  );
}
