"use client";

import { create } from "zustand";

import type {
  ActivityItem,
  CalendarEvent,
  Client,
  NotificationItem,
  StaffMember,
  TaskItem,
  TaskStatus,
} from "@/types/erp";

type AddClientInput = Omit<Client, "id">;
type AddStaffInput = Omit<StaffMember, "id" | "defaultPassword" | "isFirstLogin" | "isActive">;
type AddTaskInput = Omit<TaskItem, "id">;
type AddCalendarEventInput = Omit<CalendarEvent, "id">;

type ERPStore = {
  clients: Client[];
  staff: StaffMember[];
  exEmployees: StaffMember[];
  tasks: TaskItem[];
  calendarEvents: CalendarEvent[];
  notifications: NotificationItem[];
  activities: ActivityItem[];
  getStaffByEmail: (email: string) => StaffMember | undefined;
  markFirstLoginDone: (staffId: string) => void;
  addClient: (payload: AddClientInput) => void;
  updateClient: (id: string, payload: AddClientInput) => void;
  deleteClient: (id: string) => void;
  addStaff: (payload: AddStaffInput) => void;
  updateStaff: (id: string, payload: AddStaffInput) => void;
  softDeleteStaff: (id: string) => void;
  addTask: (payload: AddTaskInput) => void;
  updateTask: (id: string, payload: AddTaskInput) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  addCalendarEvent: (payload: AddCalendarEventInput) => void;
};

const formatId = (prefix: string, value: number): string => {
  return `${prefix}${String(value).padStart(3, "0")}`;
};

const getNextId = (items: { id: string }[], prefix: string): string => {
  const maxValue = items.reduce((max, item) => {
    const numeric = Number(item.id.replace(prefix, ""));
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 0);
  return formatId(prefix, maxValue + 1);
};

const createActivity = (message: string): ActivityItem => ({
  id: crypto.randomUUID(),
  message,
  timestamp: new Date().toISOString(),
});

const createNotification = (
  message: string,
  type: NotificationItem["type"],
  staffId?: string
): NotificationItem => ({
  id: crypto.randomUUID(),
  message,
  createdAt: new Date().toISOString(),
  type,
  staffId,
  isRead: false,
});

const initialStaff: StaffMember[] = [
  {
    id: "AS001",
    joiningDate: "2026-01-02",
    designation: "Operations Manager",
    defaultPassword: "Welcome@123",
    isFirstLogin: false,
    isActive: true,
    name: "Ravi Kumar",
    dob: "1995-07-15",
    gender: "Male",
    aadhar: "1111-2222-3333",
    address: "Mumbai, Maharashtra",
    phone: "+919900001111",
    email: "ravi@erp.com",
    role: "admin",
    qualification: "MBA",
    skills: "Leadership, Operations",
    experienceCompany: "Prime Ops",
    experienceRole: "Team Lead",
    experienceMonths: 60,
    pan: "ABCDE1234F",
    accountNo: "123456789012",
    bank: "HDFC Bank",
    ifsc: "HDFC0001234",
  },
  {
    id: "AS002",
    joiningDate: "2026-02-20",
    designation: "Workflow Executive",
    defaultPassword: "Welcome@123",
    isFirstLogin: true,
    isActive: true,
    name: "Neha Singh",
    dob: "1998-03-10",
    gender: "Female",
    aadhar: "4444-5555-6666",
    address: "Bengaluru, Karnataka",
    phone: "+919911112222",
    email: "neha@erp.com",
    role: "staff",
    qualification: "B.Com",
    skills: "Coordination, Reporting",
    experienceCompany: "BluePeak",
    experienceRole: "Coordinator",
    experienceMonths: 28,
    pan: "PQRST7890L",
    accountNo: "987654321098",
    bank: "ICICI Bank",
    ifsc: "ICIC0004567",
  },
];

const initialClients: Client[] = [
  {
    id: "AC001",
    clientName: "Apex Manufacturing",
    officeAddress: "Mumbai, Maharashtra",
    whatsappNo: "+919876543210",
    alternateNo: "+919700000001",
    email: "contact@apexmfg.com",
    contactPersonName: "Arjun Mehta",
    contactPersonDesignation: "Procurement Head",
    contactPersonWhatsapp: "+919612345678",
    contactPersonAlternateNo: "+919600000001",
    contactPersonEmail: "arjun@apexmfg.com",
  },
  {
    id: "AC002",
    clientName: "BluePeak Logistics",
    officeAddress: "Bengaluru, Karnataka",
    whatsappNo: "+919812345678",
    alternateNo: "+919700000002",
    email: "ops@bluepeak.com",
    contactPersonName: "Nitin Rao",
    contactPersonDesignation: "Operations Manager",
    contactPersonWhatsapp: "+919833334444",
    contactPersonAlternateNo: "+919600000002",
    contactPersonEmail: "nitin@bluepeak.com",
  },
];

const initialTasks: TaskItem[] = [
  {
    id: "AT001",
    title: "Client onboarding documents",
    description: "Finalize KYC and contract validation.",
    deadline: "2026-04-30",
    status: "Pending",
    assignedTo: ["AS001", "AS002"],
  },
  {
    id: "AT002",
    title: "Weekly workflow audit",
    description: "Review pending items and escalation queue.",
    deadline: "2026-05-04",
    status: "In Progress",
    assignedTo: ["AS002"],
  },
];

const initialCalendarEvents: CalendarEvent[] = [
  {
    id: "EV001",
    title: "Client Onboarding Review",
    date: "2026-04-29",
    description: "Kickoff meeting with Apex team.",
    linkedTaskId: "AT001",
  },
];

const initialNotifications: NotificationItem[] = [
  createNotification("Task AT001 assigned to your queue.", "task_assigned", "AS002"),
  createNotification("Deadline approaching for AT001.", "deadline_near", "AS002"),
  createNotification("Meeting created: Client Onboarding Review.", "meeting_created"),
];

export const useERPStore = create<ERPStore>((set, get) => ({
  clients: initialClients,
  staff: initialStaff,
  exEmployees: [],
  tasks: initialTasks,
  calendarEvents: initialCalendarEvents,
  notifications: initialNotifications,
  activities: [createActivity("ERP workspace initialized.")],
  getStaffByEmail: (email) =>
    get().staff.find((member) => member.email.toLowerCase() === email.toLowerCase()),
  markFirstLoginDone: (staffId) =>
    set((state) => ({
      staff: state.staff.map((member) =>
        member.id === staffId ? { ...member, isFirstLogin: false } : member
      ),
      activities: [createActivity(`First login completed: ${staffId}`), ...state.activities],
    })),

  addClient: (payload) =>
    set((state) => {
      const newClient: Client = { id: getNextId(state.clients, "AC"), ...payload };
      return {
        clients: [...state.clients, newClient],
        activities: [createActivity(`Client added: ${newClient.clientName}`), ...state.activities],
      };
    }),
  updateClient: (id, payload) =>
    set((state) => ({
      clients: state.clients.map((item) => (item.id === id ? { ...item, ...payload } : item)),
      activities: [createActivity(`Client updated: ${id}`), ...state.activities],
    })),
  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((item) => item.id !== id),
      activities: [createActivity(`Client deleted: ${id}`), ...state.activities],
    })),

  addStaff: (payload) =>
    set((state) => {
      const newStaff: StaffMember = {
        id: getNextId([...state.staff, ...state.exEmployees], "AS"),
        ...payload,
        defaultPassword: "Welcome@123",
        isFirstLogin: true,
        isActive: true,
      };
      return {
        staff: [...state.staff, newStaff],
        activities: [createActivity(`Staff added: ${newStaff.name}`), ...state.activities],
        notifications: [
          createNotification(
            `Welcome ${newStaff.name}. Please reset your password on first login.`,
            "system",
            newStaff.id
          ),
          ...state.notifications,
        ],
      };
    }),
  updateStaff: (id, payload) =>
    set((state) => ({
      staff: state.staff.map((item) => (item.id === id ? { ...item, ...payload } : item)),
      activities: [createActivity(`Staff updated: ${id}`), ...state.activities],
    })),
  softDeleteStaff: (id) =>
    set((state) => {
      const target = state.staff.find((item) => item.id === id);
      if (!target) {
        return state;
      }

      return {
        staff: state.staff.filter((item) => item.id !== id),
        exEmployees: [{ ...target, isActive: false }, ...state.exEmployees],
        activities: [createActivity(`Staff moved to ex-employees: ${id}`), ...state.activities],
        tasks: state.tasks.map((task) => ({
          ...task,
          assignedTo: task.assignedTo.filter((assigneeId) => assigneeId !== id),
        })),
      };
    }),

  addTask: (payload) =>
    set((state) => {
      const newTask: TaskItem = { id: getNextId(state.tasks, "AT"), ...payload };
      const assigneeNotifications = newTask.assignedTo.map((staffId) =>
        createNotification(`Task assigned: ${newTask.title}`, "task_assigned", staffId)
      );
      return {
        tasks: [...state.tasks, newTask],
        activities: [createActivity(`Task created: ${newTask.title}`), ...state.activities],
        notifications: [...assigneeNotifications, ...state.notifications],
      };
    }),
  updateTask: (id, payload) =>
    set((state) => ({
      tasks: state.tasks.map((item) => (item.id === id ? { ...item, ...payload } : item)),
      activities: [createActivity(`Task updated: ${id}`), ...state.activities],
    })),
  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((item) => (item.id === id ? { ...item, status } : item)),
      activities: [createActivity(`Task status updated: ${id} -> ${status}`), ...state.activities],
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((item) => item.id !== id),
      activities: [createActivity(`Task deleted: ${id}`), ...state.activities],
    })),
  addCalendarEvent: (payload) =>
    set((state) => ({
      calendarEvents: [
        ...state.calendarEvents,
        { id: getNextId(state.calendarEvents, "EV"), ...payload },
      ],
      notifications: [
        createNotification(`Meeting created: ${payload.title}`, "meeting_created"),
        ...state.notifications,
      ],
      activities: [createActivity(`Meeting scheduled: ${payload.title}`), ...state.activities],
    })),
}));

export const taskStatusOptions: TaskStatus[] = ["Pending", "In Progress", "Completed"];
