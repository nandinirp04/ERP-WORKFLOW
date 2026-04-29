export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] p-6 text-white shadow-[0_10px_30px_rgba(15,23,42,0.25)]">
        <p className="text-sm text-[#CBD5E1]">Welcome back</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          ERP Operations Dashboard
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[#E2E8F0]">
          Track clients, staff, tasks, and workflow progress from a single
          control center.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active Clients", value: "128", delta: "+8.4%" },
          { label: "Staff Online", value: "47", delta: "+2.1%" },
          { label: "Open Tasks", value: "312", delta: "-3.7%" },
          { label: "Pending Alerts", value: "09", delta: "-1.0%" },
        ].map((card) => (
          <article
            key={card.label}
            className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm text-[#64748B]">{card.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-2xl font-semibold tracking-tight text-[#0F172A]">
                {card.value}
              </span>
              <span className="text-xs font-medium text-[#0369A1]">{card.delta}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="text-base font-semibold text-[#0F172A]">Today&apos;s Focus</h3>
          <p className="mt-2 text-sm text-[#64748B]">
            Prioritize overdue client tasks, review staff allocations, and clear
            pending approvals before end of day.
          </p>
        </article>
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-[#0F172A]">Quick Actions</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {["New Client", "Assign Task", "Add Staff"].map((action) => (
              <button
                key={action}
                type="button"
                className="rounded-lg border border-[#D6DEE8] bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#334155] transition hover:border-[#93C5FD] hover:bg-[#EFF6FF]"
              >
                {action}
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
