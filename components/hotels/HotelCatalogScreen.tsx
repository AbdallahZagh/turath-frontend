import { connection } from "next/server";
import type { ReactNode } from "react";

import { HotelCatalog } from "@/components/hotels/HotelCatalog";

/** Rendered per request: the filters and dates come from the URL query. */
export async function HotelCatalogScreen({
  detailBasePath = "/hotels",
}: {
  detailBasePath?: string;
}): Promise<ReactNode> {
  await connection();
  return <HotelCatalog detailBasePath={detailBasePath} />;
}
