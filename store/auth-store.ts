"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthTokens, AuthUser } from "@/types/auth";

type AuthStore = {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setSession: (payload: { user: AuthUser; tokens: AuthTokens }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setSession: ({ user, tokens }) =>
        set({
          user,
          tokens,
          isAuthenticated: true,
        }),
      clearSession: () =>
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
