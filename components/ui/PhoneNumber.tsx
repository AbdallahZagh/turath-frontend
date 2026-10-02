import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type PhoneNumberProps = {
  /** The number as stored, e.g. "+963 944 123 456". */
  value: string;
  className?: string;
};

/**
 * Every displayed phone number: its own left-to-right isolate, so in Arabic it still reads
 * "+963 944 123 456" (never "456 123 944 963+"), and it never wraps between digit groups.
 */
export function PhoneNumber({ value, className }: PhoneNumberProps): ReactNode {
  return (
    <bdi dir="ltr" className={cn("tabular-nums whitespace-nowrap", className)}>
      {value}
    </bdi>
  );
}
