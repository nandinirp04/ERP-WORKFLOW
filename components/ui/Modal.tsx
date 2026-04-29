import { Button } from "@/components/ui/Button";

type ModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmLabel?: string;
};

export function Modal({
  isOpen,
  title,
  description,
  onConfirm,
  onClose,
  confirmLabel = "Confirm",
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.2)]">
        <h3 className="text-lg font-semibold text-[#0F172A]">{title}</h3>
        <p className="mt-2 text-sm text-[#64748B]">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
