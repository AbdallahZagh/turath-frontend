import { create } from "zustand";

import { DEFAULT_MOCK_USER, MOCK_USERS, type MockUser } from "@/lib/auth/session";
import type { AppRole } from "@/lib/auth/roles";
import type { AuthChannel } from "@/services/auth";

export type AuthFlow = "login" | "register" | "reset";

export type PendingVerify = {
  channel: AuthChannel;
  destination: string;
  flow: AuthFlow;
};

type AuthStore = {
  user: MockUser;
  isAuthenticated: boolean;
  pendingVerify: PendingVerify | null;
  setRole: (role: AppRole) => void;
  setPendingVerify: (pending: PendingVerify | null) => void;
  completeSession: (role?: AppRole) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: DEFAULT_MOCK_USER,
  isAuthenticated: false,
  pendingVerify: null,
  setRole: (role) => set({ user: MOCK_USERS[role] }),
  setPendingVerify: (pendingVerify) => set({ pendingVerify }),
  completeSession: (role) =>
    set((state) => ({
      isAuthenticated: true,
      pendingVerify: null,
      user: role ? MOCK_USERS[role] : state.user,
    })),
  signOut: () =>
    set({
      isAuthenticated: false,
      pendingVerify: null,
      user: DEFAULT_MOCK_USER,
    }),
}));
