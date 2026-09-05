"use client";

import { FileUp, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useRef, type ChangeEvent, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type FileFieldProps = {
  label: string;
  hint?: string;
  removeLabel: string;
  value?: File;
  onChange: (file: File | undefined) => void;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export function FileField({
  label,
  hint,
  removeLabel,
  value,
  onChange,
  accept = "application/pdf,image/jpeg,image/png,image/webp",
  disabled,
  required,
  className,
}: FileFieldProps): ReactNode {
  const t = useTranslations("fileField");
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function clear(): void {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange(undefined);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    onChange(file);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-prose-muted text-xs font-medium">{label}</span>
      {value ? (
        <div className="border-glass-border bg-glass-control flex items-center gap-3 rounded-2xl border px-3 py-3">
          <span className="bg-app-muted text-prose flex size-9 shrink-0 items-center justify-center rounded-full">
            <FileUp className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-prose truncate text-sm font-medium">{value.name}</p>
            <p className="text-prose-muted text-xs">
              {value.size < 1024
                ? t("bytes", { size: String(value.size) })
                : value.size < 1024 * 1024
                  ? t("kilobytes", { size: String(Math.round(value.size / 1024)) })
                  : t("megabytes", { size: (value.size / (1024 * 1024)).toFixed(1) })}
            </p>
          </div>
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            className="bg-ink/70 text-foam flex size-8 shrink-0 items-center justify-center rounded-full"
            aria-label={removeLabel}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-glass-border bg-glass-control text-prose-muted backdrop-blur-sm",
            "flex min-h-24 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-3 py-4",
            "hover:text-prose hover:border-primary/60",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          <FileUp className="size-5" aria-hidden />
          <span className="text-sm font-medium">{hint ?? label}</span>
        </button>
      )}
      <input
        id={generatedId}
        ref={inputRef}
        type="file"
        accept={accept}
        required={required && !value}
        disabled={disabled}
        className="sr-only"
        onChange={onFileChange}
      />
    </div>
  );
}
