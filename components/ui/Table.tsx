import type { ReactNode } from "react";

type TableProps = {
  headers: string[];
  children: ReactNode;
};

export function Table({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
      <table className="min-w-full divide-y divide-[#E2E8F0] bg-white">
        <thead className="bg-[#F8FAFC]">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EEF2F7]">{children}</tbody>
      </table>
    </div>
  );
}

type TableRowProps = {
  children: ReactNode;
  striped?: boolean;
};

export function TableRow({ children, striped = false }: TableRowProps) {
  return (
    <tr
      className={`${striped ? "bg-[#FAFCFF]" : "bg-white"} transition-colors hover:bg-[#F1F5F9]`}
    >
      {children}
    </tr>
  );
}

type TableCellProps = {
  children: ReactNode;
  className?: string;
};

export function TableCell({ children, className = "" }: TableCellProps) {
  return <td className={`px-4 py-3 text-sm text-[#334155] ${className}`}>{children}</td>;
}
