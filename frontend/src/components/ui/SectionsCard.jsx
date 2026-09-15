export default function SectionCard({
  number,
  title,
  description,
  icon,
  actions,
  children,
}) {
  return (
    <section className="animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
            {number}
          </div>

          <div className="flex items-center gap-2">
            {icon}

            <div>
              <h2 className="text-sm font-semibold text-slate-900">{title}</h2>

              {description && (
                <p className="mt-0.5 text-xs text-slate-400">{description}</p>
              )}
            </div>
          </div>
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <div className="px-6 py-5">{children}</div>
    </section>
  );
}
