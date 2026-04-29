import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-[#334155]">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm text-[#0F172A] shadow-sm outline-none transition focus:border-[#818CF8] focus:ring-4 focus:ring-[#C7D2FE] ${className}`}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-[#B91C1C]">{error}</p> : null}
    </div>
  );
}
