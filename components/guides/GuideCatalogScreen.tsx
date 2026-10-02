import { connection } from "next/server";
import type { ReactNode } from "react";

import { GuideCatalog } from "@/components/guides/GuideCatalog";

/** Rendered per request: the filters come from the URL query. */
export async function GuideCatalogScreen({
  detailBasePath = "/guides",
}: {
  detailBasePath?: string;
}): Promise<ReactNode> {
  await connection();
  return <GuideCatalog detailBasePath={detailBasePath} />;
}
