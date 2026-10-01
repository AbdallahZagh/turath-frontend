import { create } from "zustand";

import type { ProviderCategory } from "@/lib/validation/auth";

type ProviderPreviewStore = {
  category: ProviderCategory;
  setCategory: (category: ProviderCategory) => void;
};

export const useProviderPreviewStore = create<ProviderPreviewStore>((set) => ({
  category: "hotels",
  setCategory: (category) => set({ category }),
}));
