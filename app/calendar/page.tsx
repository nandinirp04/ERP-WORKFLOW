"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { useERPStore } from "@/store/erp-store";
import { useUIStore } from "@/store/ui-store";

export default function CalendarPage() {
  const events = useERPStore((state) => state.calendarEvents);
  const tasks = useERPStore((state) => state.tasks);
  const addCalendarEvent = useERPStore((state) => state.addCalendarEvent);
  const pushToast = useUIStore((state) => state.pushToast);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [linkedTaskId, setLinkedTaskId] = useState("");

  return (
    <div className="space-y-6">
      <Card title="Calendar" subtitle="Create and track meetings/events.">
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            id="event-title"
            label="Event Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Input
            id="event-date"
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          <Input
            id="event-description"
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-[#334155]" htmlFor="linked-task">
              Link Task Deadline
            </label>
            <select
              id="linked-task"
              value={linkedTaskId}
              onChange={(event) => setLinkedTaskId(event.target.value)}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#818CF8] focus:ring-4 focus:ring-[#C7D2FE]"
            >
              <option value="">No linked task</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title} ({task.deadline || "no deadline"})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={() => {
              if (!title || !date) {
                pushToast({ message: "Event title and date are required.", type: "error" });
                return;
              }

              addCalendarEvent({ title, date, description, linkedTaskId: linkedTaskId || undefined });
              setTitle("");
              setDate("");
              setDescription("");
              setLinkedTaskId("");
              pushToast({ message: "Event created.", type: "success" });
            }}
          >
            Create Event
          </Button>
        </div>
      </Card>

      <Card title="Upcoming Events" subtitle="Calendar schedule">
        {!events.length ? (
          <EmptyState title="No events scheduled" description="Create your first meeting/event." />
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
              >
                <p className="text-sm font-semibold text-[#0F172A]">{event.title}</p>
                <p className="mt-1 text-xs text-[#64748B]">{event.date}</p>
                <p className="mt-1 text-sm text-[#334155]">{event.description || "No description"}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
