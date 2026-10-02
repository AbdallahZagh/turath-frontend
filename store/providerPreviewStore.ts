import { create } from "zustand";

import type { ProviderCategory } from "@/lib/validation/auth";

/**
 * Frontend preview only: the business type an owner picked in the sidebar preview selector (staff
 * never see it). `null` (the default, and after every reload) means "show the signed-in business",
 * whose category comes from its profile query; this store never supplies a category on its own.
 */
type ProviderPreviewStore = {
  preview: ProviderCategory | null;
  setPreview: (category: ProviderCategory | null) => void;
};

export const useProviderPreviewStore = create<ProviderPreviewStore>((set) => ({
  preview: null,
  setPreview: (preview) => set({ preview }),
}));
