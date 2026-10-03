import { connection } from "next/server";
import type { ReactNode } from "react";

import { RestaurantCatalog } from "@/components/restaurants/RestaurantCatalog";

/** Rendered per request: the filters and dates come from the URL query. */
export async function RestaurantCatalogScreen({
  detailBasePath = "/restaurants",
}: {
  detailBasePath?: string;
}): Promise<ReactNode> {
  await connection();
  return <RestaurantCatalog detailBasePath={detailBasePath} />;
}
