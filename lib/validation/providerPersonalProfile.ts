import { z } from "zod";

export const providerPersonalProfileSchema = z.object({
  name: z.string().trim().min(2, "name"),
  email: z.email("email"),
  phone: z.string().trim().regex(/^\+?[\d\s-]{8,20}$/, "phone"),
  nationality: z.string().trim().min(2, "nationality"),
  dateOfBirth: z.iso.date("dateOfBirth"),
});

export type ProviderPersonalProfileValues = z.infer<typeof providerPersonalProfileSchema>;
