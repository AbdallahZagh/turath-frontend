import { create } from "zustand";

type PageHeaderStore = {
  handlers: Record<string, () => void>;
  register: (id: string, onClick: () => void) => void;
  unregister: (id: string) => void;
};

export const usePageHeaderStore = create<PageHeaderStore>((set) => ({
  handlers: {},
  register: (id, onClick) =>
    set((state) => ({ handlers: { ...state.handlers, [id]: onClick } })),
  unregister: (id) =>
    set((state) => {
      const { [id]: _removed, ...handlers } = state.handlers;
      return { handlers };
    }),
}));
