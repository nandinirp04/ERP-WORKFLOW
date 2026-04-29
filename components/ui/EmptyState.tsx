type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
      <h4 className="text-base font-semibold text-[#0F172A]">{title}</h4>
      <p className="mt-1 text-sm text-[#64748B]">{description}</p>
    </div>
  );
}
