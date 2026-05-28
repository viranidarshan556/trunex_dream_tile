import { z } from "zod";

export const leadSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(100),
  contact_number: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  city: z.string().trim().min(2, "Enter your town/city").max(80),
  sqft: z.coerce.number().int().positive("Enter valid square feet").max(100000),
});

export type LeadInput = z.infer<typeof leadSchema>;
