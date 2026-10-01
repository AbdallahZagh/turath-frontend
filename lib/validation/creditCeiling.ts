import { parseNumberInput } from "@/lib/format/digits";

/**
 * A per-business credit ceiling as typed by an admin.
 * - `default`: the field is blank, so the business uses its tier default (no override is stored).
 * - `amount`: a whole SYP amount above zero, saved as the override.
 * - `invalid`: zero, negative or junk; shown as a field error and never saved.
 */
export type CreditCeilingInput =
  { kind: "default" } | { kind: "amount"; amountSyp: number } | { kind: "invalid" };

export function parseCreditCeilingInput(raw: string): CreditCeilingInput {
  if (raw.trim() === "") {
    return { kind: "default" };
  }
  const amount = parseNumberInput(raw);
  if (amount === undefined || amount <= 0) {
    return { kind: "invalid" };
  }
  return { kind: "amount", amountSyp: amount };
}
