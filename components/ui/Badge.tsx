import type { ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "primary";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
};

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-[#E2E8F0] text-[#334155]",
  success: "bg-[#DCFCE7] text-[#166534]",
  warning: "bg-[#FEF3C7] text-[#92400E]",
  primary: "bg-[#DBEAFE] text-[#1D4ED8]",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeTones[tone]}`}>
      {children}
    </span>
  );
}
