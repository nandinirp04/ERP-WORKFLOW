export type Client = {
  id: string;
  clientName: string;
  officeAddress: string;
  whatsappNo: string;
  alternateNo: string;
  email: string;
  contactPersonName: string;
  contactPersonDesignation: string;
  contactPersonWhatsapp: string;
  contactPersonAlternateNo: string;
  contactPersonEmail: string;
};

export type StaffMember = {
  id: string;
  joiningDate: string;
  designation: string;
  defaultPassword: string;
  isFirstLogin: boolean;
  isActive: boolean;
  name: string;
  dob: string;
  gender: string;
  aadhar: string;
  address: string;
  phone: string;
  email: string;
  role: string;
  qualification: string;
  skills: string;
  experienceCompany: string;
  experienceRole: string;
  experienceMonths: number;
  pan: string;
  accountNo: string;
  bank: string;
  ifsc: string;
};

export type TaskStatus = "Pending" | "In Progress" | "Completed";

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: TaskStatus;
  assignedTo: string[];
};

export type ActivityItem = {
  id: string;
  message: string;
  timestamp: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  description: string;
  linkedTaskId?: string;
};

export type NotificationItem = {
  id: string;
  message: string;
  createdAt: string;
  staffId?: string;
  type: "task_assigned" | "deadline_near" | "meeting_created" | "system";
  isRead: boolean;
};
