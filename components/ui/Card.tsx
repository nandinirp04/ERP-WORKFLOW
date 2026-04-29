import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
};

export function Card({ title, subtitle, rightSlot, children }: CardProps) {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      {(title || rightSlot) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title ? <h3 className="text-base font-semibold text-[#0F172A]">{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-sm text-[#64748B]">{subtitle}</p> : null}
          </div>
          {rightSlot}
        </div>
      )}
      {children}
    </section>
  );
}
