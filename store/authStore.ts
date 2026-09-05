import { create } from "zustand";

import { DEFAULT_MOCK_USER, MOCK_USERS, type MockUser } from "@/lib/auth/session";
import type { AppRole } from "@/lib/auth/roles";

type AuthStore = {
  user: MockUser;
  setRole: (role: AppRole) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: DEFAULT_MOCK_USER,
  setRole: (role) => set({ user: MOCK_USERS[role] }),
}));
