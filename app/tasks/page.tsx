"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { taskStatusOptions, useERPStore } from "@/store/erp-store";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import type { TaskStatus } from "@/types/erp";
import { isAdmin } from "@/utils/roles";

type TaskForm = {
  title: string;
  description: string;
  deadline: string;
  status: TaskStatus;
  assignedTo: string[];
};

const initialForm: TaskForm = {
  title: "",
  description: "",
  deadline: "",
  status: "Pending",
  assignedTo: [],
};

const getStatusTone = (status: TaskStatus): "warning" | "primary" | "success" => {
  if (status === "Completed") return "success";
  if (status === "In Progress") return "primary";
  return "warning";
};

export default function TasksPage() {
  const tasks = useERPStore((state) => state.tasks);
  const staff = useERPStore((state) => state.staff);
  const addTask = useERPStore((state) => state.addTask);
  const updateTask = useERPStore((state) => state.updateTask);
  const updateTaskStatus = useERPStore((state) => state.updateTaskStatus);
  const deleteTask = useERPStore((state) => state.deleteTask);
  const user = useAuthStore((state) => state.user);
  const pushToast = useUIStore((state) => state.pushToast);
  const admin = isAdmin(user?.role);
  const staffId = user?.staffId ?? "";

  const [statusFilter, setStatusFilter] = useState<"All" | TaskStatus>("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<TaskForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskForm, string>>>({});

  const filteredTasks = useMemo(() => {
    const scopedTasks = admin
      ? tasks
      : tasks.filter((task) => staffId && task.assignedTo.includes(staffId));

    return scopedTasks.filter((task) => {
      const staffNames = task.assignedTo
        .map((id) => staff.find((member) => member.id === id)?.name ?? "")
        .join(" ")
        .toLowerCase();
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [task.id, task.title, task.description, staffNames].some((field) =>
          field.toLowerCase().includes(query)
        );
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [admin, search, staff, staffId, statusFilter, tasks]);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof TaskForm, string>> = {};
    if (!form.title.trim()) nextErrors.title = "Title is required.";
    if (!form.description.trim()) nextErrors.description = "Description is required.";
    if (admin && !form.assignedTo.length) nextErrors.assignedTo = "Select at least one staff member.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setErrors({});
  };

  const submitForm = () => {
    if (!validate()) return;

    if (editingId) {
      updateTask(editingId, form);
      pushToast({ message: "Task updated successfully.", type: "success" });
    } else {
      addTask(form);
      pushToast({ message: "Task created successfully.", type: "success" });
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      <Card
        title="Tasks Module"
        subtitle={admin ? "Create and assign tasks across staff." : "View and update your tasks."}
      >
        {admin ? (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                id="task-title"
                label="Title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                error={errors.title}
              />
              <Input
                id="task-description"
                label="Description"
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                error={errors.description}
              />
              <Input
                id="task-deadline"
                label="Deadline"
                type="date"
                value={form.deadline}
                onChange={(event) => setForm((prev) => ({ ...prev, deadline: event.target.value }))}
              />
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-[#334155]"
                  htmlFor="task-status"
                >
                  Status
                </label>
                <select
                  id="task-status"
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, status: event.target.value as TaskStatus }))
                  }
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#818CF8] focus:ring-4 focus:ring-[#C7D2FE]"
                >
                  {taskStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-[#334155]"
                  htmlFor="task-assignee"
                >
                  Assign to Staff (multiple)
                </label>
                <select
                  id="task-assignee"
                  multiple
                  value={form.assignedTo}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      assignedTo: Array.from(event.target.selectedOptions).map((option) => option.value),
                    }))
                  }
                  className="h-28 w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#818CF8] focus:ring-4 focus:ring-[#C7D2FE]"
                >
                  {staff.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.id})
                    </option>
                  ))}
                </select>
                {errors.assignedTo ? (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.assignedTo}</p>
                ) : null}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={submitForm}>{editingId ? "Update Task" : "Add Task"}</Button>
              {editingId ? (
                <Button variant="secondary" onClick={resetForm}>
                  Cancel Edit
                </Button>
              ) : null}
            </div>
          </>
        ) : (
          <p className="text-sm text-[#64748B]">
            You can update only the status of your assigned tasks from the table below.
          </p>
        )}
      </Card>

      <Card
        title="Task List"
        subtitle="Track statuses and assignees."
        rightSlot={
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks..."
              className="w-44 rounded-xl border border-[#CBD5E1] px-3 py-2 text-sm outline-none transition focus:border-[#818CF8] focus:ring-4 focus:ring-[#C7D2FE]"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "All" | TaskStatus)}
              className="rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#818CF8] focus:ring-4 focus:ring-[#C7D2FE]"
            >
              <option value="All">All Status</option>
              {taskStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        }
      >
        {!filteredTasks.length ? (
          <EmptyState title="No tasks found" description="Create tasks or adjust your filters." />
        ) : (
          <Table headers={["ID", "Title", "Description", "Deadline", "Status", "Assignees", "Actions"]}>
            {filteredTasks.map((task, index) => {
              const assignees = task.assignedTo
                .map((id) => staff.find((member) => member.id === id)?.name ?? id)
                .join(", ");
              return (
                <TableRow key={task.id} striped={index % 2 === 0}>
                  <TableCell className="font-semibold">{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.deadline || "-"}</TableCell>
                  <TableCell>
                    <Badge tone={getStatusTone(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>{assignees || "Unassigned"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {admin ? (
                        <>
                          <Button
                            variant="secondary"
                            className="px-3 py-1.5 text-xs"
                            onClick={() => {
                              setEditingId(task.id);
                              setForm({
                                title: task.title,
                                description: task.description,
                                status: task.status,
                                deadline: task.deadline,
                                assignedTo: task.assignedTo,
                              });
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            className="px-3 py-1.5 text-xs"
                            onClick={() => setDeleteId(task.id)}
                          >
                            Delete
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="secondary"
                          className="px-3 py-1.5 text-xs"
                          onClick={() => {
                            const nextStatus =
                              task.status === "Pending"
                                ? "In Progress"
                                : task.status === "In Progress"
                                  ? "Completed"
                                  : "Completed";
                            updateTaskStatus(task.id, nextStatus);
                            pushToast({ message: `Task moved to ${nextStatus}.`, type: "success" });
                          }}
                        >
                          Advance Status
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>
        )}
      </Card>

      {admin ? (
        <Modal
          isOpen={Boolean(deleteId)}
          title="Delete Task"
          description="This action removes the task from the board."
          confirmLabel="Delete"
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            if (!deleteId) return;
            deleteTask(deleteId);
            setDeleteId(null);
            pushToast({ message: "Task deleted.", type: "info" });
          }}
        />
      ) : null}
    </div>
  );
}
