"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useERPStore } from "@/store/erp-store";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const clients = useERPStore((state) => state.clients);
  const staff = useERPStore((state) => state.staff);
  const tasks = useERPStore((state) => state.tasks);
  const activities = useERPStore((state) => state.activities);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl bg-[#E2E8F0]" />
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Total Clients", value: clients.length, icon: "🏢" },
    { label: "Staff Members", value: staff.length, icon: "👥" },
    { label: "Total Tasks", value: tasks.length, icon: "📋" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] p-6 text-white shadow-[0_14px_30px_rgba(15,23,42,0.28)]">
        <h2 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h2>
        <p className="mt-2 text-sm text-[#E2E8F0]">
          Monitor business performance, team execution, and workflow health in one place.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">{stat.label}</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-[#0F172A]">
                  {stat.value}
                </p>
              </div>
              <span className="rounded-xl bg-[#EEF2FF] px-3 py-2 text-xl">{stat.icon}</span>
            </div>
          </Card>
        ))}
      </section>

      <Card title="Recent Activity" subtitle="Latest workspace changes">
        <div className="space-y-3">
          {activities.slice(0, 6).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
            >
              <p className="text-sm text-[#334155]">{activity.message}</p>
              <Badge tone="neutral">
                {new Date(activity.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
