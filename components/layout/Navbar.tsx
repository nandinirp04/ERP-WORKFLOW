"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";
import { clearAuthSessionCookies } from "@/utils/auth-session";

type NavbarProps = {
  onToggleSidebar: () => void;
};

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const [openProfile, setOpenProfile] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const displayName = user?.name ?? "ERP User";

  return (
    <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/85 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-lg border border-[#D6DEE8] px-3 py-2 text-sm text-[#334155] shadow-sm transition hover:bg-[#F8FAFC] lg:hidden"
            aria-label="Open sidebar"
          >
            Menu
          </button>
          <h1 className="text-base font-semibold tracking-tight text-[#0F172A] sm:text-lg">
            ERP Workflow System
          </h1>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenProfile((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl border border-[#D6DEE8] bg-white px-3 py-2 text-sm text-[#334155] shadow-sm transition hover:border-[#C7D2FE] hover:shadow"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E2E8F0] text-xs font-semibold text-[#1E293B]">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <span className="max-w-28 truncate">{displayName}</span>
          </button>

          {openProfile ? (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#E2E8F0] bg-white p-2 shadow-[0_14px_28px_rgba(15,23,42,0.12)]">
              <p className="px-2 py-1 text-xs text-[#64748B]">Signed in as {displayName}</p>
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  clearAuthSessionCookies();
                  setOpenProfile(false);
                  router.replace("/login");
                }}
                className="mt-1 w-full rounded-lg px-2 py-2 text-left text-sm text-[#B91C1C] transition hover:bg-[#FEF2F2]"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
