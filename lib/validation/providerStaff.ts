import { z } from "zod";

export const PROVIDER_STAFF_ROLES = ["scanner", "readOnly"] as const;

export const providerStaffInviteSchema = z.object({
  name: z.string().trim().min(2, "name"),
  phone: z.string().trim().regex(/^\+?[\d\s-]{8,20}$/, "phone"),
  role: z.enum(PROVIDER_STAFF_ROLES, { error: "role" }),
});

export type ProviderStaffInviteValues = z.infer<typeof providerStaffInviteSchema>;
export type ProviderStaffUpdateValues = ProviderStaffInviteValues;
