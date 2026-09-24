import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  updateCurrentUser: (values: Pick<MockUser, "name" | "email" | "phone">) => void;
  setPendingVerify: (pending: PendingVerify | null) => void;
  completeSession: (role?: AppRole) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: DEFAULT_MOCK_USER,
      isAuthenticated: false,
      pendingVerify: null,
      setRole: (role) => set({ user: MOCK_USERS[role] }),
      updateCurrentUser: (values) =>
        set((state) => ({ user: { ...state.user, ...values } })),
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
    }),
    {
      name: "turath-auth-session",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
