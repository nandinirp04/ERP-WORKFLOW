"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { isAdmin } from "@/utils/roles";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const adminNavItems = [
  { label: "Clients", href: "/clients", badge: "02" },
  { label: "Staff", href: "/staff", badge: "03" },
  { label: "Tasks", href: "/tasks", badge: "04" },
  { label: "Calendar", href: "/calendar", badge: "05" },
  { label: "Notifications", href: "/notifications", badge: "06" },
];

const staffNavItems = [
  { label: "Tasks", href: "/tasks", badge: "02" },
  { label: "Calendar", href: "/calendar", badge: "03" },
  { label: "Notifications", href: "/notifications", badge: "04" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const role = useAuthStore((state) => state.user?.role);
  const admin = isAdmin(role);
  const dashboardHref = admin ? "/admin/dashboard" : "/staff/dashboard";
  const navItems = [
    { label: "Dashboard", href: dashboardHref, badge: "01" },
    ...(admin ? adminNavItems : staffNavItems),
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-[#0B1220]/50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-[#E2E8F0] bg-[linear-gradient(180deg,#FCFDFF_0%,#F8FAFC_100%)] p-5 shadow-[0_18px_40px_rgba(10,25,47,0.1)] transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#64748B]">Workspace</p>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-[#0F172A]">
            ERP Menu
          </h2>
        </div>

        <div className="mb-5 flex items-center justify-end lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-[#64748B] transition hover:bg-[#EEF2F7] lg:hidden"
            aria-label="Close sidebar"
          > 
            Close
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#DBEAFE] text-[#1D4ED8] shadow-[inset_0_0_0_1px_rgba(29,78,216,0.18)]"
                    : "text-[#334155] hover:bg-[#EEF2F7] hover:text-[#0F172A]"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs ${
                    isActive
                      ? "bg-[#BFDBFE] text-[#1E40AF]"
                      : "bg-[#E2E8F0] text-[#64748B] group-hover:bg-[#CBD5E1]"
                  }`}
                >
                  {item.badge}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
