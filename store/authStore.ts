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
  /** Safe relative path a user returns to after verifying (see `lib/auth/returnTo`). */
  returnTo?: string;
};

type AuthStore = {
  user: MockUser;
  isAuthenticated: boolean;
  pendingVerify: PendingVerify | null;
  setRole: (role: AppRole) => void;
  updateCurrentUser: (values: Pick<MockUser, "name" | "email" | "phone">) => void;
  setPendingVerify: (pending: PendingVerify | null) => void;
  /** A role signs in as that role's demo account; a user signs in as exactly that account. */
  completeSession: (account?: AppRole | MockUser) => void;
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
      completeSession: (account) =>
        set((state) => ({
          isAuthenticated: true,
          pendingVerify: null,
          user: !account ? state.user : typeof account === "string" ? MOCK_USERS[account] : account,
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
