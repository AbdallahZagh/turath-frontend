import { create } from "zustand";

type UiStore = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  /** Page body scrolls on main instead of a nested fill scroller (admin cards). */
  contentScrolls: boolean;
  toggleSidebarCollapsed: () => void;
  setMobileNavOpen: (open: boolean) => void;
  setContentScrolls: (contentScrolls: boolean) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  sidebarCollapsed: false,
  mobileNavOpen: false,
  contentScrolls: false,
  toggleSidebarCollapsed: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  setContentScrolls: (contentScrolls) => set({ contentScrolls }),
}));
