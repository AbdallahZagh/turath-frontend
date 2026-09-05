import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionHeadingAlign = "center" | "start";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: SectionHeadingAlign;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps): ReactNode {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col",
        isCentered ? "mx-auto max-w-2xl items-center text-center" : "max-w-xl items-start text-start",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2.5",
          isCentered ? "justify-center" : "justify-start",
        )}
      >
        <span className="bg-accent h-px w-8" aria-hidden />
        <p className="text-accent text-xs font-semibold tracking-[0.14em] uppercase">
          {eyebrow}
        </p>
      </div>
      <h2 className="font-heading text-prose mt-4 text-3xl leading-[1.15] font-semibold text-balance sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-prose-muted mt-4 text-base leading-relaxed text-pretty sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
