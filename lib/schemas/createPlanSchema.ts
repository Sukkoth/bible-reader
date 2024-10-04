import { z } from "zod";

export const CreatePlanSchema = z.object({
  name: z
    .string({
      required_error: "Plan name is required",
    })
    .min(3, "Plane name should be atleast 3 characters")
    .max(20),
  description: z.string().min(10).optional(),
  suggestedDuration: z
    .string()
    .transform((val) => parseFloat(val)) // Transform the string into a number
    .refine((val) => !isNaN(val), { message: "Must be a valid number" }) // Ensure it's a valid number
    .refine((val) => val > 0, { message: "Number must be greater than 0" }), // Add additional constraints if necessary,
  coverImg: z
    .string({
      required_error: "Cover image is required",
    })
    .startsWith("https://")
    .optional(),
});

export type CreatePlanSchemaType = z.infer<typeof CreatePlanSchema>;
