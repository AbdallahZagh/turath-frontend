import { notFound } from "next/navigation";

/** Any unmatched /provider/... path renders this segment's not-found inside the portal shell. */
export default function ProviderMissingPage(): never {
  notFound();
}
