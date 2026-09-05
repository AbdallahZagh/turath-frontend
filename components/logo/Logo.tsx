"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type LogoVariant = "main" | "simple";
export type LogoSurface = "theme" | "light" | "dark";

type LogoProps = {
  variant?: LogoVariant;
  surface?: LogoSurface;
  className?: string;
  priority?: boolean;
};

const SRC = {
  main: {
    light: "/main-logo.png",
    dark: "/dark-main-logo.png",
    width: 967,
    height: 413,
  },
  simple: {
    light: "/simple-logo.png",
    dark: "/dark-simple-logo.png",
    width: 740,
    height: 853,
  },
} as const;

const IMAGE_STYLE: CSSProperties = { width: "auto", height: "100%" };

type LogoImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority: boolean;
  className?: string;
  hidden?: boolean;
};

function LogoImage({
  src,
  alt,
  width,
  height,
  priority,
  className,
  hidden,
}: LogoImageProps): ReactNode {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized
      aria-hidden={hidden || alt === "" ? true : undefined}
      className={cn("h-full w-auto max-w-none", className)}
      style={IMAGE_STYLE}
    />
  );
}

export function Logo({
  variant = "main",
  surface = "theme",
  className,
  priority = false,
}: LogoProps): ReactNode {
  const t = useTranslations("chrome");
  const brand = t("brand");
  const asset = SRC[variant];

  if (surface === "light" || surface === "dark") {
    return (
      <span className={cn("inline-flex h-12 w-fit shrink-0 items-center", className)}>
        <LogoImage
          src={surface === "dark" ? asset.dark : asset.light}
          alt={brand}
          width={asset.width}
          height={asset.height}
          priority={priority}
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex h-12 w-fit shrink-0 items-center", className)}>
      <LogoImage
        src={asset.light}
        alt={brand}
        width={asset.width}
        height={asset.height}
        priority={priority}
        className="dark:hidden"
      />
      <LogoImage
        src={asset.dark}
        alt=""
        width={asset.width}
        height={asset.height}
        priority={priority}
        hidden
        className="hidden dark:block"
      />
    </span>
  );
}
