import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { PublicShell } from "@/components/layout/PublicShell";
import { NotFoundPanel } from "@/components/ui/NotFoundPanel";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: t("title") };
}

export default function NotFound(): ReactNode {
  return (
    <PublicShell>
      <div className="flex min-h-[70svh] items-center px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24">
        <NotFoundPanel />
      </div>
    </PublicShell>
  );
}
