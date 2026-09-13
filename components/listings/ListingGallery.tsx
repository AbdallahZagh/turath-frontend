"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type ListingGalleryProps = {
  images: string[];
  imageAlt: string;
  openImageLabel: (number: number) => string;
};

export function ListingGallery({ images, imageAlt, openImageLabel }: ListingGalleryProps): ReactNode {
  const [activeImage, setActiveImage] = useState(images[0] ?? "");
  if (!activeImage) return null;

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_7rem]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-glass">
        <Image src={activeImage} alt={imageAlt} fill priority sizes="(min-width: 1024px) 62vw, 94vw" className="object-cover" />
        <div aria-hidden className="from-ink/30 absolute inset-0 bg-linear-to-t to-transparent" />
      </div>
      <div className="flex justify-start gap-3 lg:flex-col">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(image)}
            aria-label={openImageLabel(index + 1)}
            aria-pressed={activeImage === image}
            className={cn(
              "focus-visible:outline-ring relative aspect-4/3 cursor-pointer overflow-hidden rounded-2xl border-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 lg:aspect-square",
              activeImage === image ? "border-primary" : "border-transparent opacity-75 hover:opacity-100",
            )}
          >
            <Image src={image} alt="" fill sizes="(min-width: 1024px) 7rem, 30vw" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
