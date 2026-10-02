import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";

type KpiCardProps = {
  icon: LucideIcon;
  label: string;
  /** A formatted count or percentage, or `<StackedMoney variant="kpi" />` for an amount. */
  value: ReactNode;
  hint?: string;
  href?: string;
};

/** One dashboard KPI tile (business and admin dashboards, ledger balances). */
export function KpiCard({ icon: Icon, label, value, hint, href }: KpiCardProps): ReactNode {
  const content = (
    <>
      <div className="flex items-center gap-2">
        <span className="bg-option-hover text-accent flex size-8 shrink-0 items-center justify-center rounded-full">
          <Icon className="size-4" aria-hidden />
        </span>
        <p className="text-prose-muted text-xs font-semibold tracking-wide uppercase">{label}</p>
      </div>
      <div className="font-heading text-prose text-xl font-semibold tracking-tight wrap-break-word sm:text-2xl">
        {value}
      </div>
      {hint ? <p className="text-prose-muted text-xs leading-relaxed">{hint}</p> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex min-w-0 w-full">
        <GlassPanel className="flex min-w-0 flex-col gap-3 p-4 sm:p-5 transition-colors duration-200 hover:border-primary/40">
          {content}
        </GlassPanel>
      </Link>
    );
  }

  return <GlassPanel className="flex min-w-0 flex-col gap-3 p-4 sm:p-5">{content}</GlassPanel>;
}
