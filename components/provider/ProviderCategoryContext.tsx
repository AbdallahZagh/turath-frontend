"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { ProviderCategory } from "@/lib/validation/auth";

const ProviderCategoryContext = createContext<ProviderCategory | null>(null);

/** Set once by `ProviderShell` from the business profile (or an active sidebar preview). */
export function ProviderCategoryProvider({
  category,
  children,
}: {
  category: ProviderCategory;
  children: ReactNode;
}): ReactNode {
  return <ProviderCategoryContext value={category}>{children}</ProviderCategoryContext>;
}

/** The category every business screen shows. Only valid inside `ProviderShell`. */
export function useProviderCategory(): ProviderCategory {
  const category = useContext(ProviderCategoryContext);
  if (!category) {
    throw new Error("useProviderCategory must be used inside ProviderShell.");
  }
  return category;
}
