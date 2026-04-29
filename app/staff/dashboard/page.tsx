"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/store/auth-store";
import { useERPStore } from "@/store/erp-store";

export default function StaffDashboardPage() {
  const authUser = useAuthStore((state) => state.user);
  const staff = useERPStore((state) => state.staff);
  const tasks = useERPStore((state) => state.tasks);
  const notifications = useERPStore((state) => state.notifications);

  const profile = useMemo(() => {
    return staff.find((item) => item.id === authUser?.staffId) ?? staff[0] ?? null;
  }, [authUser?.staffId, staff]);

  const assignedTasks = useMemo(() => {
    if (!profile) {
      return [];
    }

    return tasks.filter((task) => task.assignedTo.includes(profile.id));
  }, [profile, tasks]);

  const personalNotifications = useMemo(() => {
    if (!profile) {
      return [];
    }

    return notifications.filter((item) => !item.staffId || item.staffId === profile.id).slice(0, 5);
  }, [notifications, profile]);

  return (
    <div className="space-y-6">
      <Card title="Staff Dashboard" subtitle="Your profile and assigned tasks">
        {profile ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-xs text-[#64748B]">Name</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">{profile.name}</p>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-xs text-[#64748B]">Email</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">{profile.email}</p>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-xs text-[#64748B]">Role</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">{profile.role}</p>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="text-xs text-[#64748B]">Designation</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">{profile.designation}</p>
            </div>
          </div>
        ) : (
          <EmptyState
            title="Profile not found"
            description="No staff profile is mapped to the current login session."
          />
        )}
      </Card>

      <Card title="Assigned Tasks" subtitle="Track your active workload">
        {!assignedTasks.length ? (
          <EmptyState
            title="No tasks assigned"
            description="You currently have no assigned tasks. Check back later."
          />
        ) : (
          <div className="space-y-3">
            {assignedTasks.map((task) => (
              <article
                key={task.id}
                className="rounded-xl border border-[#E2E8F0] bg-white p-4 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{task.title}</p>
                    <p className="mt-1 text-sm text-[#64748B]">{task.description}</p>
                  </div>
                  <Badge
                    tone={
                      task.status === "Completed"
                        ? "success"
                        : task.status === "In Progress"
                          ? "primary"
                          : "warning"
                    }
                  >
                    {task.status}
                  </Badge>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>

      <Card title="Notifications" subtitle="Personal and system alerts">
        {!personalNotifications.length ? (
          <EmptyState title="No notifications" description="You're all caught up." />
        ) : (
          <div className="space-y-2">
            {personalNotifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#334155]"
              >
                {notification.message}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
