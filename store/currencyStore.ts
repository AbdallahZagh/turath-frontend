import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Currency = "SYP" | "USD";

type CurrencyStore = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

export function isCurrency(value: string): value is Currency {
  return value === "SYP" || value === "USD";
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: "SYP",
      setCurrency: (currency) => set({ currency }),
    }),
    { name: "turath-currency" },
  ),
);
