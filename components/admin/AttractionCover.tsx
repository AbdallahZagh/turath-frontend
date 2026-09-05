"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type AttractionCoverProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
};

function isLocalFileSrc(src: string): boolean {
  return src.startsWith("blob:") || src.startsWith("data:");
}

export function AttractionCover({
  src,
  alt,
  sizes,
  className,
}: AttractionCoverProps): ReactNode {
  if (isLocalFileSrc(src)) {
    return (
      // Local file preview from the add-attraction picker; next/image cannot optimize blob URLs.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={cn("object-cover", className)} />
    );
  }

  return (
    <Image src={src} alt={alt} fill sizes={sizes} className={cn("object-cover", className)} />
  );
}
