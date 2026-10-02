import { connection } from "next/server";
import type { ReactNode } from "react";

import { EventCatalog } from "@/components/events/EventCatalog";

/** Rendered per request: the filters come from the URL query. */
export async function EventCatalogScreen({
  detailBasePath = "/events",
}: {
  detailBasePath?: string;
}): Promise<ReactNode> {
  await connection();
  return <EventCatalog detailBasePath={detailBasePath} />;
}
