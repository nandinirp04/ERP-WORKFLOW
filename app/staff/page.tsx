"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { useERPStore } from "@/store/erp-store";
import { useUIStore } from "@/store/ui-store";

type StaffForm = {
  joiningDate: string;
  designation: string;
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
  experienceMonths: string;
  pan: string;
  accountNo: string;
  bank: string;
  ifsc: string;
};

const initialForm: StaffForm = {
  joiningDate: "",
  designation: "",
  name: "",
  dob: "",
  gender: "",
  aadhar: "",
  address: "",
  phone: "",
  email: "",
  role: "staff",
  qualification: "",
  skills: "",
  experienceCompany: "",
  experienceRole: "",
  experienceMonths: "",
  pan: "",
  accountNo: "",
  bank: "",
  ifsc: "",
};

export default function StaffPage() {
  const staff = useERPStore((state) => state.staff);
  const exEmployees = useERPStore((state) => state.exEmployees);
  const addStaff = useERPStore((state) => state.addStaff);
  const updateStaff = useERPStore((state) => state.updateStaff);
  const softDeleteStaff = useERPStore((state) => state.softDeleteStaff);
  const pushToast = useUIStore((state) => state.pushToast);

  const [search, setSearch] = useState("");
  const [form, setForm] = useState<StaffForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof StaffForm, string>>>({});

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return staff;
    return staff.filter((member) =>
      [member.id, member.name, member.email, member.role].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [search, staff]);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof StaffForm, string>> = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.joiningDate.trim()) nextErrors.joiningDate = "Joining date is required.";
    if (!form.designation.trim()) nextErrors.designation = "Designation is required.";
    if (!form.email.trim() || !form.email.includes("@")) nextErrors.email = "Valid email is required.";
    if (!form.role.trim()) nextErrors.role = "Role is required.";
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

    const payload = {
      ...form,
      experienceMonths: Number(form.experienceMonths) || 0,
    };

    if (editingId) {
      updateStaff(editingId, payload);
      pushToast({ message: "Staff updated successfully.", type: "success" });
    } else {
      addStaff(payload);
      pushToast({ message: "Staff added. Default password: Welcome@123", type: "success" });
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      <Card title="Staff Module" subtitle="Manage team members and roles.">
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            id="staff-joining-date"
            label="Joining Date"
            type="date"
            value={form.joiningDate}
            onChange={(event) => setForm((prev) => ({ ...prev, joiningDate: event.target.value }))}
            error={errors.joiningDate}
          />
          <Input
            id="staff-designation"
            label="Role / Designation"
            value={form.designation}
            onChange={(event) => setForm((prev) => ({ ...prev, designation: event.target.value }))}
            error={errors.designation}
          />
          <Input
            id="staff-name"
            label="Name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            error={errors.name}
          />
          <Input
            id="staff-dob"
            label="DOB"
            type="date"
            value={form.dob}
            onChange={(event) => setForm((prev) => ({ ...prev, dob: event.target.value }))}
          />
          <Input
            id="staff-gender"
            label="Gender"
            value={form.gender}
            onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
          />
          <Input
            id="staff-aadhar"
            label="Aadhar"
            value={form.aadhar}
            onChange={(event) => setForm((prev) => ({ ...prev, aadhar: event.target.value }))}
          />
          <Input
            id="staff-address"
            label="Address"
            value={form.address}
            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
          />
          <Input
            id="staff-phone"
            label="Phone"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          />
          <Input
            id="staff-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            error={errors.email}
          />
          <Input
            id="staff-role"
            label="Role"
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            error={errors.role}
          />
          <Input
            id="staff-qualification"
            label="Qualification"
            value={form.qualification}
            onChange={(event) => setForm((prev) => ({ ...prev, qualification: event.target.value }))}
          />
          <Input
            id="staff-skills"
            label="Skills"
            value={form.skills}
            onChange={(event) => setForm((prev) => ({ ...prev, skills: event.target.value }))}
          />
          <Input
            id="staff-exp-company"
            label="Experience Company"
            value={form.experienceCompany}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, experienceCompany: event.target.value }))
            }
          />
          <Input
            id="staff-exp-role"
            label="Experience Role"
            value={form.experienceRole}
            onChange={(event) => setForm((prev) => ({ ...prev, experienceRole: event.target.value }))}
          />
          <Input
            id="staff-exp-months"
            label="Experience (months)"
            value={form.experienceMonths}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, experienceMonths: event.target.value }))
            }
          />
          <Input
            id="staff-pan"
            label="PAN"
            value={form.pan}
            onChange={(event) => setForm((prev) => ({ ...prev, pan: event.target.value }))}
          />
          <Input
            id="staff-account"
            label="Account No"
            value={form.accountNo}
            onChange={(event) => setForm((prev) => ({ ...prev, accountNo: event.target.value }))}
          />
          <Input
            id="staff-bank"
            label="Bank"
            value={form.bank}
            onChange={(event) => setForm((prev) => ({ ...prev, bank: event.target.value }))}
          />
          <Input
            id="staff-ifsc"
            label="IFSC"
            value={form.ifsc}
            onChange={(event) => setForm((prev) => ({ ...prev, ifsc: event.target.value }))}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={submitForm}>{editingId ? "Update Staff" : "Add Staff"}</Button>
          {editingId ? (
            <Button variant="secondary" onClick={resetForm}>
              Cancel Edit
            </Button>
          ) : null}
        </div>
      </Card>

      <Card
        title="Staff List"
        subtitle="Search and maintain active staff records."
        rightSlot={
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search staff..."
            className="w-52 rounded-xl border border-[#CBD5E1] px-3 py-2 text-sm outline-none transition focus:border-[#818CF8] focus:ring-4 focus:ring-[#C7D2FE]"
          />
        }
      >
        {!filteredStaff.length ? (
          <EmptyState title="No staff found" description="Add team members to get started." />
        ) : (
          <Table headers={["ID", "Name", "Email", "Role", "Designation", "Actions"]}>
            {filteredStaff.map((member, index) => (
              <TableRow key={member.id} striped={index % 2 === 0}>
                <TableCell className="font-semibold">{member.id}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Badge tone="primary">{member.role}</Badge>
                </TableCell>
                <TableCell>{member.designation}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="px-3 py-1.5 text-xs"
                      onClick={() => {
                        setEditingId(member.id);
                        setForm({
                          joiningDate: member.joiningDate,
                          designation: member.designation,
                          name: member.name,
                          dob: member.dob,
                          gender: member.gender,
                          aadhar: member.aadhar,
                          address: member.address,
                          phone: member.phone,
                          email: member.email,
                          role: member.role,
                          qualification: member.qualification,
                          skills: member.skills,
                          experienceCompany: member.experienceCompany,
                          experienceRole: member.experienceRole,
                          experienceMonths: String(member.experienceMonths),
                          pan: member.pan,
                          accountNo: member.accountNo,
                          bank: member.bank,
                          ifsc: member.ifsc,
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="px-3 py-1.5 text-xs"
                      onClick={() => setDeleteId(member.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>

      <Modal
        isOpen={Boolean(deleteId)}
        title="Delete Staff"
        description="This performs a soft delete and moves staff to ex-employees."
        confirmLabel="Delete"
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;
          softDeleteStaff(deleteId);
          setDeleteId(null);
          pushToast({ message: "Staff member deleted.", type: "info" });
        }}
      />

      <Card title="Ex-Employees" subtitle="Soft-deleted staff records.">
        {!exEmployees.length ? (
          <EmptyState title="No ex-employees" description="Soft deleted staff will appear here." />
        ) : (
          <Table headers={["ID", "Name", "Email", "Designation"]}>
            {exEmployees.map((member, index) => (
              <TableRow key={member.id} striped={index % 2 === 0}>
                <TableCell className="font-semibold">{member.id}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.designation}</TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
