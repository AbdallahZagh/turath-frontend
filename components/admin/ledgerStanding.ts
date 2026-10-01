import { CREDIT_GRACE_RATIO, CREDIT_WATCH_RATIO } from "@/lib/mock/adminLedger";

export function creditUsedClass(ratio: number): string {
  if (ratio >= CREDIT_GRACE_RATIO) {
    return "text-destructive";
  }
  if (ratio >= CREDIT_WATCH_RATIO) {
    return "text-accent";
  }
  return "text-prose";
}

export function creditBarClass(ratio: number): string {
  if (ratio >= CREDIT_GRACE_RATIO) {
    return "bg-destructive";
  }
  if (ratio >= CREDIT_WATCH_RATIO) {
    return "bg-accent";
  }
  return "bg-primary";
}
