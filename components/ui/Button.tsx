import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-[0_10px_22px_rgba(79,70,229,0.35)] hover:opacity-95",
  secondary: "border border-[#D7DFEA] bg-white text-[#1E293B] hover:bg-[#F8FAFC]",
  danger: "border border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FEE2E2]",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
