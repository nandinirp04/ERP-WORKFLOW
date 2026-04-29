"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/store/auth-store";
import { useERPStore } from "@/store/erp-store";
import { isAdmin } from "@/utils/roles";

export default function NotificationsPage() {
  const notifications = useERPStore((state) => state.notifications);
  const user = useAuthStore((state) => state.user);
  const filtered = isAdmin(user?.role)
    ? notifications
    : notifications.filter((item) => !item.staffId || item.staffId === user?.staffId);

  return (
    <Card title="Notifications" subtitle="Activity alerts and updates.">
      {!filtered.length ? (
        <EmptyState
          title="No notifications yet"
          description="System and workflow alerts will appear here."
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
            >
              <p className="text-sm text-[#334155]">{item.message}</p>
              <Badge tone="neutral">{item.type.replace("_", " ")}</Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
