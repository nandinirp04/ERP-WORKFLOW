"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ToastViewport } from "@/components/ui/ToastViewport";
import { useAuthStore } from "@/store/auth-store";
import { isAdmin } from "@/utils/roles";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role;
  const isFirstLogin = Boolean(user?.isFirstLogin);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const isPublicRoute = pathname === "/login" || pathname === "/forgot-password";

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && isPublicRoute) {
      router.replace(
        isAdmin(userRole) ? "/admin/dashboard" : isFirstLogin ? "/staff/reset-password" : "/staff/dashboard"
      );
      return;
    }

    if (isAuthenticated && !isAdmin(userRole) && isFirstLogin && pathname !== "/staff/reset-password") {
      router.replace("/staff/reset-password");
      return;
    }

    if (isAuthenticated && pathname.startsWith("/admin") && !isAdmin(userRole)) {
      router.replace("/staff/dashboard");
      return;
    }

    if (isAuthenticated && pathname.startsWith("/staff") && isAdmin(userRole)) {
      router.replace("/admin/dashboard");
      return;
    }

    if (
      isAuthenticated &&
      !isAdmin(userRole) &&
      (pathname.startsWith("/clients") ||
        (pathname.startsWith("/staff") &&
          pathname !== "/staff/dashboard" &&
          pathname !== "/staff/reset-password"))
    ) {
      router.replace("/staff/dashboard");
    }
  }, [hasHydrated, isAuthenticated, isFirstLogin, isPublicRoute, pathname, router, userRole]);

  if (!hasHydrated && !isPublicRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FB] text-sm text-[#64748B]">
        Loading workspace...
      </div>
    );
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F8FAFC_0%,#F3F6FB_100%)] text-[#0F172A]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:pl-72">
        <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white/90 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
            {children}
          </div>
        </main>
      </div>
      <ToastViewport />
    </div>
  );
}
