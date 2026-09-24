import { z } from "zod";

export const providerCheckInSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{6}$/),
});

export type ProviderCheckInValues = z.infer<typeof providerCheckInSchema>;
