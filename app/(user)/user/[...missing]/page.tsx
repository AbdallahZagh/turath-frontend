import { notFound } from "next/navigation";

/** Any unmatched /user/... path renders this segment's not-found inside the portal shell. */
export default function UserMissingPage(): never {
  notFound();
}
