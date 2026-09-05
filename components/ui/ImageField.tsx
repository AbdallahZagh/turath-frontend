"use client";

import { ImagePlus, X } from "lucide-react";
import { useId, useRef, type ChangeEvent, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type ImageFieldProps = {
  label: string;
  hint?: string;
  removeLabel: string;
  value?: string;
  onChange: (file: File | undefined, previewUrl: string | undefined) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export function ImageField({
  label,
  hint,
  removeLabel,
  value,
  onChange,
  disabled,
  required,
  className,
}: ImageFieldProps): ReactNode {
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function clear(): void {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange(undefined, undefined);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) {
      onChange(undefined, undefined);
      return;
    }
    onChange(file, URL.createObjectURL(file));
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-prose-muted text-xs font-medium">{label}</span>
      {value ? (
        <div className="border-glass-border relative overflow-hidden rounded-2xl border">
          {/* Blob previews and public CMS images share this frame. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-40 w-full object-cover" />
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            className="bg-ink/70 text-foam absolute inset-e-2 top-2 flex size-8 items-center justify-center rounded-full"
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
            "flex min-h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed",
            "hover:text-prose hover:border-primary/60",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          <ImagePlus className="size-6" aria-hidden />
          <span className="text-sm font-medium">{hint ?? label}</span>
        </button>
      )}
      <input
        id={generatedId}
        ref={inputRef}
        type="file"
        accept="image/*"
        required={required && !value}
        disabled={disabled}
        className="sr-only"
        onChange={onFileChange}
      />
    </div>
  );
}
