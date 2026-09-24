import { Construction } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";

export async function ProviderWorkspacePlaceholder(): Promise<ReactNode> {
  const t = await getTranslations("provider.workspace");

  return (
    <GlassPanel className="flex min-h-72 flex-col items-center justify-center px-6 py-14 text-center">
      <span className="bg-primary/12 text-primary grid size-14 place-items-center rounded-2xl">
        <Construction className="size-7" aria-hidden />
      </span>
      <h2 className="font-heading text-prose mt-5 text-2xl font-semibold">
        {t("title")}
      </h2>
      <p className="text-prose-muted mt-2 max-w-lg text-sm leading-7">
        {t("description")}
      </p>
    </GlassPanel>
  );
}
