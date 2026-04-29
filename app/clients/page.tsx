"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { useERPStore } from "@/store/erp-store";
import { useUIStore } from "@/store/ui-store";

type ClientForm = {
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

const initialForm: ClientForm = {
  clientName: "",
  officeAddress: "",
  whatsappNo: "",
  alternateNo: "",
  email: "",
  contactPersonName: "",
  contactPersonDesignation: "",
  contactPersonWhatsapp: "",
  contactPersonAlternateNo: "",
  contactPersonEmail: "",
};

export default function ClientsPage() {
  const clients = useERPStore((state) => state.clients);
  const addClient = useERPStore((state) => state.addClient);
  const updateClient = useERPStore((state) => state.updateClient);
  const deleteClient = useERPStore((state) => state.deleteClient);
  const pushToast = useUIStore((state) => state.pushToast);

  const [search, setSearch] = useState("");
  const [form, setForm] = useState<ClientForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientForm, string>>>({});

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return clients;
    }

    return clients.filter((client) =>
      [client.id, client.clientName, client.email, client.whatsappNo, client.contactPersonName].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [clients, search]);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof ClientForm, string>> = {};
    if (!form.clientName.trim()) nextErrors.clientName = "Client name is required.";
    if (!form.officeAddress.trim()) nextErrors.officeAddress = "Office address is required.";
    if (!form.whatsappNo.trim()) nextErrors.whatsappNo = "WhatsApp is required.";
    if (!form.email.trim() || !form.email.includes("@")) nextErrors.email = "Valid email is required.";
    if (!form.contactPersonName.trim()) nextErrors.contactPersonName = "Contact person is required.";
    if (!form.contactPersonEmail.trim() || !form.contactPersonEmail.includes("@")) {
      nextErrors.contactPersonEmail = "Valid contact person email is required.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setErrors({});
  };

  const submitForm = () => {
    if (!validate()) {
      return;
    }

    if (editingId) {
      updateClient(editingId, form);
      pushToast({ message: "Client updated successfully.", type: "success" });
    } else {
      addClient(form);
      pushToast({ message: "Client added successfully.", type: "success" });
    }

    resetForm();
  };

  return (
    <div className="space-y-6">
      <Card title="Clients Module" subtitle="Manage client and contact person details.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="client-name"
            label="Client Name"
            value={form.clientName}
            onChange={(event) => setForm((prev) => ({ ...prev, clientName: event.target.value }))}
            error={errors.clientName}
          />
          <Input
            id="client-address"
            label="Office Address"
            value={form.officeAddress}
            onChange={(event) => setForm((prev) => ({ ...prev, officeAddress: event.target.value }))}
            error={errors.officeAddress}
          />
          <Input
            id="client-whatsapp"
            label="WhatsApp No"
            value={form.whatsappNo}
            onChange={(event) => setForm((prev) => ({ ...prev, whatsappNo: event.target.value }))}
            error={errors.whatsappNo}
          />
          <Input
            id="client-alt-no"
            label="Alternate No"
            value={form.alternateNo}
            onChange={(event) => setForm((prev) => ({ ...prev, alternateNo: event.target.value }))}
          />
          <Input
            id="client-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            error={errors.email}
          />
          <Input
            id="contact-person-name"
            label="Contact Person Name"
            value={form.contactPersonName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, contactPersonName: event.target.value }))
            }
            error={errors.contactPersonName}
          />
          <Input
            id="contact-person-designation"
            label="Contact Person Designation"
            value={form.contactPersonDesignation}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, contactPersonDesignation: event.target.value }))
            }
          />
          <Input
            id="contact-person-whatsapp"
            label="Contact Person WhatsApp"
            value={form.contactPersonWhatsapp}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, contactPersonWhatsapp: event.target.value }))
            }
          />
          <Input
            id="contact-person-alt-no"
            label="Contact Person Alternate No"
            value={form.contactPersonAlternateNo}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, contactPersonAlternateNo: event.target.value }))
            }
          />
          <Input
            id="contact-person-email"
            label="Contact Person Email"
            value={form.contactPersonEmail}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, contactPersonEmail: event.target.value }))
            }
            error={errors.contactPersonEmail}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={submitForm}>{editingId ? "Update Client" : "Add Client"}</Button>
          {editingId ? (
            <Button variant="secondary" onClick={resetForm}>
              Cancel Edit
            </Button>
          ) : null}
        </div>
      </Card>

      <Card
        title="Client List"
        subtitle="Search and manage all clients."
        rightSlot={
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search clients..."
            className="w-52 rounded-xl border border-[#CBD5E1] px-3 py-2 text-sm outline-none transition focus:border-[#818CF8] focus:ring-4 focus:ring-[#C7D2FE]"
          />
        }
      >
        {!filteredClients.length ? (
          <EmptyState
            title="No clients found"
            description="Try changing your search or add a new client."
          />
        ) : (
          <Table
            headers={[
              "ID",
              "Client Name",
              "Office Address",
              "WhatsApp",
              "Email",
              "Contact Person",
              "Actions",
            ]}
          >
            {filteredClients.map((client, index) => (
              <TableRow key={client.id} striped={index % 2 === 0}>
                <TableCell className="font-semibold">{client.id}</TableCell>
                <TableCell>{client.clientName}</TableCell>
                <TableCell>{client.officeAddress}</TableCell>
                <TableCell>{client.whatsappNo}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{client.contactPersonName}</p>
                    <p className="text-xs text-[#64748B]">{client.contactPersonDesignation}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="px-3 py-1.5 text-xs"
                      onClick={() => {
                        setEditingId(client.id);
                        setForm({
                          clientName: client.clientName,
                          officeAddress: client.officeAddress,
                          whatsappNo: client.whatsappNo,
                          alternateNo: client.alternateNo,
                          email: client.email,
                          contactPersonName: client.contactPersonName,
                          contactPersonDesignation: client.contactPersonDesignation,
                          contactPersonWhatsapp: client.contactPersonWhatsapp,
                          contactPersonAlternateNo: client.contactPersonAlternateNo,
                          contactPersonEmail: client.contactPersonEmail,
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="px-3 py-1.5 text-xs"
                      onClick={() => setDeleteId(client.id)}
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
        title="Delete Client"
        description="This action will permanently remove the client record."
        confirmLabel="Delete"
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;
          deleteClient(deleteId);
          setDeleteId(null);
          pushToast({ message: "Client deleted.", type: "info" });
        }}
      />
    </div>
  );
}
