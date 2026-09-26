import { notFound } from "next/navigation";

/** Any unmatched /admin/... path renders this segment's not-found inside the portal shell. */
export default function AdminMissingPage(): never {
  notFound();
}
