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
      <div className="rounded-glass relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-[clamp(360px,60vh,640px)]">
        <Image src={activeImage} alt={imageAlt} fill priority sizes="(min-width: 1024px) 62vw, 94vw" className="object-cover" />
        <div aria-hidden className="from-ink/30 absolute inset-0 bg-linear-to-t to-transparent" />
      </div>
      {/* Swipe row on phones (starts at the inline start, so from the right in Arabic); column beside the photo on desktop. */}
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 lg:h-[clamp(360px,60vh,640px)] lg:snap-y lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pb-0">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(image)}
            aria-label={openImageLabel(index + 1)}
            aria-pressed={activeImage === image}
            className={cn(
              "focus-visible:outline-ring rounded-glass relative aspect-4/3 w-20 shrink-0 cursor-pointer snap-start overflow-hidden border-2 transition focus-visible:outline-2 focus-visible:-outline-offset-2 sm:w-28 lg:aspect-square lg:w-full",
              activeImage === image ? "border-primary" : "border-transparent opacity-75 hover:opacity-100",
            )}
          >
            <Image src={image} alt="" fill sizes="(min-width: 1024px) 7rem, 7rem" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
