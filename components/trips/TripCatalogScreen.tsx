import { connection } from "next/server";
import type { ReactNode } from "react";

import { TripCatalog } from "@/components/trips/TripCatalog";

/** Rendered per request: the filters come from the URL query. */
export async function TripCatalogScreen({
  detailBasePath = "/trips",
}: {
  detailBasePath?: string;
}): Promise<ReactNode> {
  await connection();
  return <TripCatalog detailBasePath={detailBasePath} />;
}
